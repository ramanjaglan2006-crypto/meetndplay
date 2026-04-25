const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

const PORT = 5001;
const AI_SERVICE_URL = 'http://localhost:8000';
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// --- Fast In-Memory Cache Setup ---
const appCache = new Map();

// Utility for fetching from Cache or DB (Cache-Aside pattern)
async function fetchWithCache(key, ttlSeconds, fetchCallback) {
    if (appCache.has(key)) {
        console.log(`[CACHE HIT] ${key}`);
        return appCache.get(key);
    }

    console.log(`[CACHE MISS] Fetching data for ${key}`);
    const data = await fetchCallback();

    if (data) {
        appCache.set(key, data);
        setTimeout(() => appCache.delete(key), ttlSeconds * 1000);
    }
    return data;
}

// Invalidation utility
async function invalidateCache(keys) {
    for (const key of keys) {
        appCache.delete(key);
        console.log(`[CACHE INVALIDATED] ${key}`);
    }
}
// --- End Fast In-Memory Cache Setup ---

// Load/Init DB
const getDB = () => JSON.parse(fs.readFileSync(DB_PATH));
const saveDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

if (!fs.existsSync(DB_PATH)) {
    const initialData = {
        users: [
            { id: 'u1', name: 'Raman', sport_type: 'Badminton', skill_level: 4, lat: 12.9716, lon: 77.5946 },
            { id: 'u2', name: 'John', sport_type: 'Football', skill_level: 3, lat: 12.9720, lon: 77.5950 }
        ],
        matches: [
            { 
                id: 'm1', 
                hostId: 'u2', 
                sport: 'Football', 
                location: 'Power Play Arena', 
                lat: 12.9800, 
                lon: 77.6000,
                dateTime: new Date(Date.now() + 7200000).toISOString(), // In 2 hours (Urgent)
                totalPlayers: 12, 
                joinedPlayers: ['u2'], 
                status: 'open' 
            },
            { 
                id: 'm2', 
                hostId: 'u1', 
                sport: 'Badminton', 
                location: 'Active Sports Club', 
                lat: 12.9700, 
                lon: 77.5900,
                dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                totalPlayers: 4, 
                joinedPlayers: ['u1', 'u3'], 
                status: 'open' 
            }
        ],
        communities: [
            { id: 'c1', name: 'Football LNCT', sport: 'Football', members: ['u1', 'u2'], messages: [] },
            { id: 'c2', name: 'Badminton Pros', sport: 'Badminton', members: ['u1'], messages: [] }
        ]
    };
    saveDB(initialData);
}

// REST API
app.get('/', (req, res) => res.json({ 
    status: 'Meet-U Backend API is Active!', 
    available_routes: ['/api/matches', '/api/users/:id', '/api/tournaments', '/api/communities'] 
}));

const JWT_SECRET = 'meetusecret_local';

app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password, lat, lon, sports, skill_level, age, bio } = req.body;
    const db = getDB();
    if (db.users.find(u => u.email === email)) return res.status(400).json({ error: 'Email exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: `u${Date.now()}`, name, email, password: hashedPassword,
        lat: parseFloat(lat), lon: parseFloat(lon), sports: sports || ['Football'],
        skill_level: parseInt(skill_level) || 3, age: parseInt(age) || 20, bio: bio || 'Ready to play!',
        photos: ['https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400']
    };
    db.users.push(newUser);
    saveDB(db);
    
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: newUser });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password, currentLat, currentLon } = req.body;
    const db = getDB();
    const user = db.users.find(u => u.email === email);
    
    if (!user || user.password === undefined) {
        return res.status(401).json({ error: 'Invalid credentials. Create an account.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    if (currentLat && currentLon) {
        user.lat = parseFloat(currentLat);
        user.lon = parseFloat(currentLon);
        saveDB(db);
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
});
app.get('/api/matches', async (req, res) => {
    const matches = await fetchWithCache('matches:all', 60, () => getDB().matches);
    res.json(matches);
});

app.post('/api/matches', async (req, res) => {
    const db = getDB();
    const newMatch = { id: 'm' + Date.now(), ...req.body, joinedPlayers: [req.body.hostId], status: 'open' };
    db.matches.push(newMatch);
    saveDB(db);
    
    await invalidateCache(['matches:all']);
    res.status(201).json(newMatch);
});

app.post('/api/matches/:id/join', async (req, res) => {
    const { userId } = req.body;
    const db = getDB();
    const match = db.matches.find(m => m.id === req.params.id);
    if (!match) return res.status(404).send('Match not found');
    if (match.joinedPlayers.length >= match.totalPlayers) return res.status(400).send('Match full');
    
    if (!match.joinedPlayers.includes(userId)) {
        match.joinedPlayers.push(userId);
        if (match.joinedPlayers.length === match.totalPlayers) match.status = 'full';
        saveDB(db);
        
        await invalidateCache(['matches:all']);
        io.emit('match_updated', match);
    }
    res.json(match);
});

app.post('/api/matches/:id/leave', async (req, res) => {
    const { userId } = req.body;
    const db = getDB();
    const match = db.matches.find(m => m.id === req.params.id);
    if (!match) return res.status(404).send('Match not found');
    
    if (match.joinedPlayers.includes(userId)) {
        match.joinedPlayers = match.joinedPlayers.filter(id => id !== userId);
        if (match.status === 'full') match.status = 'open'; // Re-open if someone leaves
        saveDB(db);
        
        await invalidateCache(['matches:all']);
        io.emit('match_updated', match);
    }
    res.json(match);
});

app.get('/api/matches/:id/players', async (req, res) => {
    const db = getDB();
    const match = db.matches.find(m => m.id === req.params.id);
    if (!match) return res.status(404).send('Match not found');
    const players = db.users.filter(u => match.joinedPlayers.includes(u.id));
    res.json(players);
});

app.post('/api/matches/:id/invite', async (req, res) => {
    const { targetUserIds } = req.body;
    const db = getDB();
    const match = db.matches.find(m => m.id === req.params.id);
    if (!match) return res.status(404).send('Match not found');
    
    if (!match.invites) match.invites = [];
    targetUserIds.forEach(targetId => {
        if (!match.invites.includes(targetId)) match.invites.push(targetId);
    });
    
    saveDB(db);
    res.json({ success: true, invites: match.invites });
});

app.get('/api/communities', async (req, res) => {
    const communities = await fetchWithCache('communities:all', 300, () => getDB().communities);
    res.json(communities);
});

app.post('/api/communities/create', async (req, res) => {
    const { name, icon, admin, sport } = req.body;
    const db = getDB();
    const newCommunity = {
        id: `c${Date.now()}`,
        name, icon: icon || name.substring(0, 2).toUpperCase(), admin, sport, members: [admin]
    };
    db.communities.push(newCommunity);
    db.channels.push({ id: `ch${Date.now()}`, communityId: newCommunity.id, name: 'general', type: 'text' });
    saveDB(db);
    await invalidateCache(['communities:all']);
    res.json(newCommunity);
});

app.post('/api/communities/:id/join', async (req, res) => {
    const { userId } = req.body;
    const db = getDB();
    const comm = db.communities.find(c => c.id === req.params.id);
    if (!comm) return res.status(404).send('Not found');
    if (!comm.members.includes(userId)) {
        comm.members.push(userId);
        saveDB(db);
        await invalidateCache(['communities:all']);
    }
    res.json(comm);
});

app.get('/api/channels/:communityId', async (req, res) => {
    const channels = await fetchWithCache(`channels:${req.params.communityId}`, 120, () => 
        getDB().channels.filter(c => c.communityId === req.params.communityId)
    );
    res.json(channels);
});

app.get('/api/messages/:channelId', async (req, res) => {
    const messages = await fetchWithCache(`messages:${req.params.channelId}`, 30, () => 
        getDB().messages.filter(m => m.channelId === req.params.channelId).slice(-50)
    );
    res.json(messages);
});

app.post('/api/recommendations/matches', async (req, res) => {
    const { userId } = req.body;
    
    const cacheKey = `recommendations:matches:${userId}`;
    const recommendations = await fetchWithCache(cacheKey, 120, async () => {
        const db = getDB();
        const user = db.users.find(u => u.id === userId);
        
        try {
            const response = await axios.post(`${AI_SERVICE_URL}/recommend/matches`, {
                user: user,
                matches: db.matches
            });
            return response.data;
        } catch (error) {
            const fallbackRecommendations = db.matches
                .filter(m => m.status === 'open')
                .map(m => {
                    let score = 0;
                    if (m.sport === user.sport_type) score += 10;
                    const dist = Math.sqrt(Math.pow(m.lat - user.lat, 2) + Math.pow(m.lon - user.lon, 2));
                    score += (1 - dist) * 5;
                    return { ...m, matchScore: score };
                })
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, 3);
            return { recommendations: fallbackRecommendations };
        }
    });

    res.json(recommendations);
});

app.post('/api/recommendations', async (req, res) => {
    const { userId } = req.body;
    
    const cacheKey = `recommendations:players:${userId}`;
    const recommendations = await fetchWithCache(cacheKey, 120, async () => {
        const db = getDB();
        try {
            const response = await axios.post(`${AI_SERVICE_URL}/recommend`, {
                player_id: userId,
                all_players: db.users
            });
            return response.data;
        } catch (error) {
            console.error('Error calling AI service for players:', error.message);
            return { error: 'Failed to get player recommendations' };
        }
    });

    if (recommendations.error) {
        res.status(500).json(recommendations);
    } else {
        res.json(recommendations);
    }
});

// Socket.io for Real-time Chat
io.on('connection', (socket) => {
    socket.on('joinRoom', (channelId) => {
        socket.join(channelId);
    });

    socket.on('sendMessage', async (data) => {
        const { channelId, senderId, senderName, content } = data;
        const db = getDB();
        
        const newMessage = { 
            id: `msg${Date.now()}`,
            channelId,
            senderId, 
            senderName, 
            content, 
            createdAt: new Date().toISOString() 
        };
        db.messages.push(newMessage);
        saveDB(db);
        
        await invalidateCache([`messages:${channelId}`]);
        io.to(channelId).emit('receiveMessage', newMessage);
    });

    socket.on('userTyping', ({ channelId, username }) => {
        socket.to(channelId).emit('displayTyping', username);
    });
});

// Tournaments
app.get('/api/tournaments', async (req, res) => {
  const tournaments = await fetchWithCache('tournaments:all', 300, () => getDB().tournaments || []);
  res.json(tournaments);
});

// Connections
app.post('/api/connections/request', async (req, res) => {
    const { senderId, receiverId } = req.body;
    const db = getDB();
    if (!db.connections) db.connections = [];

    let conn = db.connections.find(c => (c.senderId === senderId && c.receiverId === receiverId) || (c.senderId === receiverId && c.receiverId === senderId));
    if (conn) return res.status(400).json({ error: 'Connection already exists', status: conn.status });

    const newConn = { id: `conn${Date.now()}`, senderId, receiverId, status: 'pending' };
    db.connections.push(newConn);
    saveDB(db);
    res.json(newConn);
});

app.post('/api/connections/accept', async (req, res) => {
    const { connectionId } = req.body;
    const db = getDB();
    if (!db.connections) db.connections = [];
    const conn = db.connections.find(c => c.id === connectionId);
    if (!conn) return res.status(404).json({ error: 'Connection not found' });
    
    conn.status = 'accepted';
    saveDB(db);
    res.json(conn);
});

app.post('/api/connections/reject', async (req, res) => {
    const { connectionId } = req.body;
    const db = getDB();
    if (!db.connections) db.connections = [];
    const conn = db.connections.find(c => c.id === connectionId);
    if (!conn) return res.status(404).json({ error: 'Connection not found' });
    
    conn.status = 'rejected';
    saveDB(db);
    res.json(conn);
});

app.get('/api/connections/:userId', async (req, res) => {
    const db = getDB();
    if (!db.connections) db.connections = [];
    const conns = db.connections.filter(c => c.senderId === req.params.userId || c.receiverId === req.params.userId);
    res.json(conns);
});

// Direct Messages
app.post('/api/direct_messages/send', async (req, res) => {
    const { senderId, receiverId, content, matchContext } = req.body;
    const db = getDB();
    if (!db.connections) db.connections = [];
    const conn = db.connections.find(c => c.status === 'accepted' && ((c.senderId === senderId && c.receiverId === receiverId) || (c.senderId === receiverId && c.receiverId === senderId)));
    
    if (!conn) return res.status(403).json({ error: 'Users are not connected' });

    if (!db.direct_messages) db.direct_messages = [];
    const newMsg = {
        id: `dm${Date.now()}`,
        senderId,
        receiverId,
        content,
        matchContext,
        timestamp: new Date().toISOString()
    };
    db.direct_messages.push(newMsg);
    saveDB(db);
    res.json(newMsg);
});

app.get('/api/direct_messages/:userId1/:userId2', async (req, res) => {
    const { userId1, userId2 } = req.params;
    const db = getDB();
    if (!db.direct_messages) db.direct_messages = [];
    const msgs = db.direct_messages.filter(m => (m.senderId === userId1 && m.receiverId === userId2) || (m.senderId === userId2 && m.receiverId === userId1));
    res.json(msgs);
});

// Profile
app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const user = await fetchWithCache(`user:${userId}`, 300, () => {
      const db = getDB();
      return db.users.find(u => u.id === req.params.id);
  });
  if (!user) return res.status(404).send('User not found');
  res.json(user);
});

app.put('/api/users/update', async (req, res) => {
    const { id, name, age, bio, sports, skill_level, photos, lat, lon } = req.body;
    const db = getDB();
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    const user = db.users[userIndex];
    if (name) user.name = name;
    if (age) user.age = age;
    if (bio) user.bio = bio;
    if (sports) user.sports = sports;
    if (skill_level) user.skill_level = skill_level;
    if (photos) user.photos = photos;
    if (lat && lon) {
        user.lat = lat;
        user.lon = lon;
    }

    saveDB(db);
    await invalidateCache([`user:${id}`]);
    res.json(user);
});

// Bumble/Tinder Swipe System
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2 - lat1) * (Math.PI / 180);
  var dLon = (lon2 - lon1) * (Math.PI / 180); 
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
          Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; 
}

app.get('/api/users/discover', async (req, res) => {
    const { userId, lat, lon, page = 1, limit = 12 } = req.query;
    const db = getDB();
    
    const userIndex = db.users.findIndex(u => u.id === userId);
    if(userIndex > -1 && lat && lon) {
       db.users[userIndex].lat = parseFloat(lat);
       db.users[userIndex].lon = parseFloat(lon);
       saveDB(db);
    }
    
    const userLat = lat ? parseFloat(lat) : (userIndex > -1 ? db.users[userIndex].lat : 0);
    const userLon = lon ? parseFloat(lon) : (userIndex > -1 ? db.users[userIndex].lon : 0);

    const userSwipes = db.swipes ? db.swipes.filter(s => s.userId === userId).map(s => s.targetUserId) : [];
    
    let potentials = db.users.filter(u => u.id !== userId && !userSwipes.includes(u.id));
    
    const currentUser = db.users.find(u => u.id === userId);

    const fetchUsers = (radiusKm, requireSameSport = true) => {
        let valid = potentials.map(p => ({
            ...p,
            distanceKm: getDistanceFromLatLonInKm(userLat, userLon, p.lat, p.lon)
        })).filter(p => p.distanceKm <= radiusKm);

        if (requireSameSport && currentUser && (currentUser.sports || currentUser.sport_type)) {
            const userSports = currentUser.sports || [currentUser.sport_type];
            valid = valid.filter(p => {
                const pSports = p.sports || [p.sport_type];
                return pSports.some(s => userSports.includes(s));
            });
        }

        valid.sort((a, b) => {
            const aSkillDiff = Math.abs(a.skill_level - (currentUser?.skill_level || 3));
            const bSkillDiff = Math.abs(b.skill_level - (currentUser?.skill_level || 3));
            // Prioritize similar skill level (diff * 10) and then distance
            return (aSkillDiff * 10 + a.distanceKm) - (bSkillDiff * 10 + b.distanceKm);
        });

        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        return valid.slice(startIndex, endIndex);
    };

    // Fallback logic for empty states
    let players = fetchUsers(20, true); // Strict: 20km, Same Sport
    if (players.length < 5) players = fetchUsers(100, true); // Relax radius: 100km, Same Sport
    if (players.length < 5) players = fetchUsers(500, false); // Relax everything: 500km, Any Sport

    res.json(players); // Handles expanding radius globally
});

app.post('/api/swipe', async (req, res) => {
    const { userId, targetUserId, action } = req.body;
    const db = getDB();
    if (!db.swipes) db.swipes = [];
    if (!db.player_matches) db.player_matches = [];

    db.swipes.push({ userId, targetUserId, action, timestamp: new Date().toISOString() });
    
    let isMatch = false;
    if (action === 'right') {
        const mutual = db.swipes.find(s => s.userId === targetUserId && s.targetUserId === userId && s.action === 'right');
        if (mutual) {
            isMatch = true;
            // Simplified match ID logic
            db.player_matches.push({ id: `pm${Date.now()}`, user1: userId, user2: targetUserId });
        }
    }
    
    saveDB(db);
    res.json({ success: true, isMatch });
});

app.post('/api/tournaments/register', async (req, res) => {
  const { tournamentId, teamName } = req.body;
  const db = getDB();
  const tournament = db.tournaments.find(t => t.id === tournamentId);
  if (!tournament) return res.status(404).send('Tournament not found');
  
  if (!tournament.teamsRegistered.includes(teamName)) {
    tournament.teamsRegistered.push(teamName);
    saveDB(db);
    
    await invalidateCache(['tournaments:all']);
  }
  res.json(tournament);
});

server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

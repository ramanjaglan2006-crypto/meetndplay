const Match = require('../models/Match');
const MatchParticipation = require('../models/MatchParticipation');
const Message = require('../models/Message');

const createMatch = async (req, res) => {
    try {
        const {
            sport = 'Football',
            title,
            date,
            time,
            durationMinutes = 60,
            locationName = 'Local Pitch',
            lat,
            lon,
            maxPlayers = 10,
            totalPlayers,
            playersPerTeam,
            format = '5-a-side',
            skillLevel = 3,
            description = '',
            rules = '',
            matchType = 'Casual',
            visibility = 'public',
            approvalRequired = false,
            community
        } = req.body;

        const calculatedTotal = parseInt(totalPlayers || maxPlayers) || 10;
        const calculatedPerTeam = parseInt(playersPerTeam) || Math.ceil(calculatedTotal / 2);
        
        let matchDate = new Date();
        if (date && time) {
            matchDate = new Date(`${date}T${time}`);
        } else if (date) {
            matchDate = new Date(date);
        }

        // Safe coordinates parsing (default to Bhopal coordinates 77.4126, 23.2599 if NaN or uncaptured)
        let parsedLat = parseFloat(lat);
        let parsedLon = parseFloat(lon);
        if (isNaN(parsedLat) || isNaN(parsedLon)) {
            parsedLat = 23.2599;
            parsedLon = 77.4126;
        }

        // Ensure req.userId exists
        const hostId = req.userId || req.user?._id || req.user?.id;
        if (!hostId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const match = new Match({
            title: title || `${format} ${sport} Match`,
            sport,
            format,
            playersPerTeam: calculatedPerTeam,
            hostId,
            joinedPlayers: [hostId],
            totalPlayers: calculatedTotal,
            skillLevel: parseInt(skillLevel) || 3,
            dateTime: matchDate,
            durationMinutes: parseInt(durationMinutes) || 60,
            locationName: locationName || 'Bhopal Turf',
            location: {
                type: 'Point',
                coordinates: [parsedLon, parsedLat]
            },
            description,
            rules,
            matchType,
            visibility,
            approvalRequired: !!approvalRequired,
            community
        });
        
        await match.save();

        const hostPosition = sport.toLowerCase().includes('football') ? 'Striker' : (sport.toLowerCase().includes('cricket') ? 'Batsman' : 'Player');
        const hostParticipation = new MatchParticipation({
            matchId: match._id,
            userId: hostId,
            team: 'A',
            position: hostPosition,
            status: 'confirmed'
        });
        await hostParticipation.save();

        if (community) {
            const sysMessage = new Message({
                community,
                type: 'system',
                sender: hostId,
                text: 'created a match',
                systemData: {
                    action: 'match_created',
                    link: `/matches/${match._id}`
                }
            });
            await sysMessage.save();
        }

        if (req.io) {
            req.io.emit('match_created', match);
        }

        res.status(201).json(match);
    } catch (err) {
        console.error('Error creating match:', err);
        res.status(500).json({ error: 'Server error creating match: ' + err.message });
    }
};

const getMatches = async (req, res) => {
    try {
        const matches = await Match.find({ status: 'open' })
            .select('-__v -updatedAt')
            .populate('hostId', 'name profileImage photos')
            .populate('joinedPlayers', 'name profileImage photos')
            .sort({ dateTime: 1 });
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getMyMatches = async (req, res) => {
    try {
        const userId = req.userId;

        // 1. Fetch matches created by authenticated user
        const createdMatches = await Match.find({ hostId: userId })
            .select('-__v -updatedAt')
            .populate('hostId', 'name profileImage photos')
            .populate('joinedPlayers', 'name profileImage photos')
            .sort({ dateTime: -1 });

        // 2. Fetch matches joined by authenticated user
        const participations = await MatchParticipation.find({ userId, status: 'confirmed' })
            .populate({
                path: 'matchId',
                populate: { path: 'hostId', select: 'name profileImage photos' }
            })
            .sort({ joinedAt: -1 });

        const joinedMatches = [];
        participations.forEach(p => {
            if (p.matchId) {
                const matchObj = p.matchId.toObject ? p.matchId.toObject() : p.matchId;
                if (matchObj.hostId?._id?.toString() !== userId.toString() && matchObj.hostId?.toString() !== userId.toString()) {
                    joinedMatches.push({
                        ...matchObj,
                        myPosition: p.position,
                        myRole: p.position,
                        joinedAt: p.joinedAt
                    });
                }
            }
        });

        // Compute Statistics
        const now = new Date();
        const allUserMatches = [...createdMatches, ...joinedMatches];
        const upcomingMatches = allUserMatches.filter(m => new Date(m.dateTime) >= now && m.status !== 'cancelled');
        const completedMatches = allUserMatches.filter(m => new Date(m.dateTime) < now || m.status === 'completed');

        upcomingMatches.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
        const nextGame = upcomingMatches.length > 0 ? upcomingMatches[0] : null;

        res.json({
            created: createdMatches,
            joined: joinedMatches,
            stats: {
                createdCount: createdMatches.length,
                joinedCount: joinedMatches.length,
                upcomingCount: upcomingMatches.length,
                completedCount: completedMatches.length
            },
            nextGame
        });
    } catch (err) {
        console.error('Error fetching my matches:', err);
        res.status(500).json({ error: 'Server error fetching my matches' });
    }
};

const getNearbyMatches = async (req, res) => {
    try {
        const { lat, lon, radius = 50000, sport } = req.query;
        if (!lat || !lon) return res.status(400).json({ error: 'Location required' });

        const query = {
            status: 'open',
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lon), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius)
                }
            }
        };

        if (sport) query.sport = sport;

        const matches = await Match.find(query)
            .select('-__v -updatedAt')
            .populate('hostId', 'name profileImage photos')
            .populate('joinedPlayers', 'name profileImage photos')
            .limit(20);
            
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getMatchRoom = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate('hostId', 'name photos locationName age sports bio reputation achievements');
        
        if (!match) return res.status(404).json({ error: 'Match not found' });

        let hostPart = await MatchParticipation.findOne({ matchId: match._id, userId: match.hostId._id, status: 'confirmed' });
        if (!hostPart) {
            const hostPos = (match.sport || '').toLowerCase().includes('football') ? 'Striker' : ((match.sport || '').toLowerCase().includes('cricket') ? 'Batsman' : 'Player');
            hostPart = new MatchParticipation({
                matchId: match._id,
                userId: match.hostId._id,
                team: 'A',
                position: hostPos,
                status: 'confirmed'
            });
            await hostPart.save();
        }

        const participants = await MatchParticipation.find({ matchId: match._id, status: 'confirmed' })
            .populate('userId', 'name photos locationName age sports bio reputation achievements interests')
            .sort({ joinedAt: 1 });

        const formattedParticipants = participants.map(p => ({
            id: p._id,
            user: p.userId,
            team: p.team,
            position: p.position,
            positionType: p.positionType,
            openToOtherPositions: p.openToOtherPositions,
            joinedAt: p.joinedAt
        }));

        res.json({
            match,
            organizer: match.hostId,
            participants: formattedParticipants,
            capacity: {
                total: match.totalPlayers,
                joined: formattedParticipants.length,
                remaining: Math.max(0, match.totalPlayers - formattedParticipants.length)
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const joinMatch = async (req, res) => {
    try {
        const { position = 'Player', openToOtherPositions = false } = req.body;
        const match = await Match.findById(req.params.id);
        if (!match) return res.status(404).json({ error: 'Match not found' });
        
        if (match.status !== 'open') return res.status(400).json({ error: 'Match is full or cancelled' });
        
        const existing = await MatchParticipation.findOne({ matchId: match._id, userId: req.userId, status: 'confirmed' });
        if (existing) return res.status(400).json({ error: 'Already joined this match' });
        
        const currentCount = await MatchParticipation.countDocuments({ matchId: match._id, status: 'confirmed' });
        if (currentCount >= match.totalPlayers) {
            match.status = 'full';
            await match.save();
            return res.status(400).json({ error: 'Match is full' });
        }

        const teamACount = await MatchParticipation.countDocuments({ matchId: match._id, team: 'A', status: 'confirmed' });
        const teamBCount = await MatchParticipation.countDocuments({ matchId: match._id, team: 'B', status: 'confirmed' });
        const assignedTeam = teamACount <= teamBCount ? 'A' : 'B';

        const participation = new MatchParticipation({
            matchId: match._id,
            userId: req.userId,
            team: assignedTeam,
            position,
            openToOtherPositions: !!openToOtherPositions,
            status: 'confirmed'
        });
        await participation.save();

        if (!match.joinedPlayers.includes(req.userId)) {
            match.joinedPlayers.push(req.userId);
        }
        
        if (currentCount + 1 >= match.totalPlayers) {
            match.status = 'full';
        }
        await match.save();

        if (req.io) {
            req.io.emit('match_roster_updated', { matchId: match._id });
        }

        res.status(201).json({ success: true, participation });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Already joined this match' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

const leaveMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) return res.status(404).json({ error: 'Match not found' });
        
        await MatchParticipation.deleteMany({ matchId: match._id, userId: req.userId });

        match.joinedPlayers = match.joinedPlayers.filter(id => id.toString() !== req.userId);
        if (match.status === 'full' && match.joinedPlayers.length < match.totalPlayers) {
            match.status = 'open';
        }
        await match.save();

        if (req.io) {
            req.io.emit('match_roster_updated', { matchId: match._id });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const updatePosition = async (req, res) => {
    try {
        const { position } = req.body;
        if (!position) return res.status(400).json({ error: 'Position required' });

        const participation = await MatchParticipation.findOneAndUpdate(
            { matchId: req.params.id, userId: req.userId, status: 'confirmed' },
            { position },
            { new: true }
        );

        if (!participation) return res.status(404).json({ error: 'Participant not found' });

        if (req.io) {
            req.io.emit('match_roster_updated', { matchId: req.params.id });
        }

        res.json(participation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const removeParticipant = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) return res.status(404).json({ error: 'Match not found' });

        if (match.hostId.toString() !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized: Only organizer can remove players' });
        }

        const targetUserId = req.params.userId;
        await MatchParticipation.deleteMany({ matchId: match._id, userId: targetUserId });

        match.joinedPlayers = match.joinedPlayers.filter(id => id.toString() !== targetUserId);
        if (match.status === 'full' && match.joinedPlayers.length < match.totalPlayers) {
            match.status = 'open';
        }
        await match.save();

        if (req.io) {
            req.io.emit('match_roster_updated', { matchId: match._id });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { createMatch, getMatches, getMyMatches, getNearbyMatches, getMatchRoom, joinMatch, leaveMatch, updatePosition, removeParticipant };

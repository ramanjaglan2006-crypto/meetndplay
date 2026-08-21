const Match = require('../models/Match');
const MatchParticipation = require('../models/MatchParticipation');
const Message = require('../models/Message');

const createMatch = async (req, res) => {
    try {
        const { sport, title, date, time, locationName, lat, lon, maxPlayers = 10, format = '5-a-side', skillLevel, description, rules } = req.body;
        
        const match = new Match({
            title: title || `${format} ${sport} Match`,
            sport: sport || 'Football',
            format,
            playersPerTeam: format === '5-a-side' ? 5 : (format === '7-a-side' ? 7 : 11),
            hostId: req.userId,
            joinedPlayers: [req.userId],
            totalPlayers: parseInt(maxPlayers) || (format === '5-a-side' ? 10 : 14),
            skillLevel: parseInt(skillLevel) || 3,
            dateTime: new Date(`${date}T${time}`),
            locationName,
            location: {
                type: 'Point',
                coordinates: [parseFloat(lon || 0), parseFloat(lat || 0)]
            },
            description,
            rules
        });
        
        await match.save();

        // Create initial host participation
        const hostParticipation = new MatchParticipation({
            matchId: match._id,
            userId: req.userId,
            team: 'A',
            position: 'Striker',
            status: 'confirmed'
        });
        await hostParticipation.save();

        if (req.body.community) {
            const sysMessage = new Message({
                community: req.body.community,
                type: 'system',
                sender: req.userId,
                text: 'created a match',
                systemData: {
                    action: 'match_created',
                    link: `/matches/${match._id}`
                }
            });
            await sysMessage.save();
            const populatedMsg = await Message.findById(sysMessage._id).populate('sender', 'name profilePicture');
            if (req.io) {
                req.io.to(`community:${req.body.community}`).emit('new_community_message', populatedMsg);
            }
        }

        res.status(201).json(match);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
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

        // Ensure host has a MatchParticipation record
        let hostPart = await MatchParticipation.findOne({ matchId: match._id, userId: match.hostId._id, status: 'confirmed' });
        if (!hostPart) {
            hostPart = new MatchParticipation({
                matchId: match._id,
                userId: match.hostId._id,
                team: 'A',
                position: 'Striker',
                status: 'confirmed'
            });
            await hostPart.save();
        }

        // Fetch all confirmed participants
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
        const { position = 'Midfielder', openToOtherPositions = false } = req.body;
        const match = await Match.findById(req.params.id);
        if (!match) return res.status(404).json({ error: 'Match not found' });
        
        if (match.status !== 'open') return res.status(400).json({ error: 'Match is full or cancelled' });
        
        // Uniqueness check
        const existing = await MatchParticipation.findOne({ matchId: match._id, userId: req.userId, status: 'confirmed' });
        if (existing) return res.status(400).json({ error: 'Already joined this match' });
        
        // Count confirmed participants to enforce capacity strictly
        const currentCount = await MatchParticipation.countDocuments({ matchId: match._id, status: 'confirmed' });
        if (currentCount >= match.totalPlayers) {
            match.status = 'full';
            await match.save();
            return res.status(400).json({ error: 'Match is full' });
        }

        // Team assignment: count A vs B
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

        // Authorization check: Only match host/organizer can remove a participant
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

module.exports = { createMatch, getMatches, getNearbyMatches, getMatchRoom, joinMatch, leaveMatch, updatePosition, removeParticipant };

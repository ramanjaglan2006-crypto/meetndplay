const Match = require('../models/Match');
const Message = require('../models/Message');

const createMatch = async (req, res) => {
    try {
        const { sport, title, date, time, locationName, lat, lon, maxPlayers, skillLevel, description } = req.body;
        
        const match = new Match({
            title,
            sport,
            hostId: req.userId,
            joinedPlayers: [req.userId],
            totalPlayers: maxPlayers,
            skillLevel,
            dateTime: new Date(`${date}T${time}`),
            locationName,
            location: {
                type: 'Point',
                coordinates: [lon, lat] // GeoJSON is [longitude, latitude]
            },
            description
        });
        
        await match.save();

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
            .populate('hostId', 'name profileImage')
            .populate('joinedPlayers', 'name profileImage')
            .sort({ dateTime: 1 });
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getNearbyMatches = async (req, res) => {
    try {
        const { lat, lon, radius = 50000, sport } = req.query; // Default 50km radius
        
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
            .populate('hostId', 'name profileImage')
            .populate('joinedPlayers', 'name profileImage')
            .limit(20);
            
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const joinMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) return res.status(404).json({ error: 'Match not found' });
        
        if (match.status !== 'open') return res.status(400).json({ error: 'Match is full or cancelled' });
        if (match.joinedPlayers.includes(req.userId)) return res.status(400).json({ error: 'Already joined' });
        
        match.joinedPlayers.push(req.userId);
        
        if (match.joinedPlayers.length >= match.totalPlayers) {
            match.status = 'full';
        }
        
        await match.save();
        res.json(match);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const leaveMatch = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) return res.status(404).json({ error: 'Match not found' });
        
        if (!match.joinedPlayers.includes(req.userId)) return res.status(400).json({ error: 'Not in this match' });
        
        match.joinedPlayers = match.joinedPlayers.filter(id => id.toString() !== req.userId);
        if (match.status === 'full' && match.joinedPlayers.length < match.totalPlayers) {
            match.status = 'open';
        }
        
        await match.save();
        res.json(match);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { createMatch, getMatches, getNearbyMatches, joinMatch, leaveMatch };

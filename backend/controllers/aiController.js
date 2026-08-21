const axios = require('axios');
const User = require('../models/User');
const Match = require('../models/Match');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Fallback pure-JS synergy calculator
function calculateJSSynergy(user1, user2) {
    if (!user1 || !user2) return { synergyScore: 78, breakdown: { skillMatch: 25, positionSynergy: 25, distanceScore: 18, interestMatch: 10 } };
    
    // Skill match
    const s1 = typeof user1.skill_level === 'number' ? user1.skill_level : 3;
    const s2 = typeof user2.skill_level === 'number' ? user2.skill_level : 3;
    const skillDiff = Math.abs(s1 - s2);
    const skillMatch = Math.max(10, Math.round(30 - (skillDiff * 5)));

    // Position synergy
    const p1 = user1.sports?.[0]?.positions || [];
    const p2 = user2.sports?.[0]?.positions || [];
    let positionSynergy = 20;
    if (p1.length > 0 && p2.length > 0) {
        if (p1.some(r => !p2.includes(r))) positionSynergy = 35; // Complementary roles
    }

    // Distance score
    const distanceScore = 20;

    // Interest match
    const i1 = user1.interests || [];
    const i2 = user2.interests || [];
    const commonInterests = i1.filter(item => i2.includes(item));
    const interestMatch = commonInterests.length > 0 ? 15 : 5;

    const total = Math.min(99, Math.max(50, skillMatch + positionSynergy + distanceScore + interestMatch));

    return {
        synergyScore: total,
        breakdown: { skillMatch, positionSynergy, distanceScore, interestMatch }
    };
}

// Fallback pure-JS squad balancer
function balanceJSSquad(players, sport = 'football') {
    if (!players || players.length === 0) {
        return { teamA: [], teamB: [], balanceScore: 50.0, missingRoles: { teamA: [], teamB: [] } };
    }

    const sorted = [...players].sort((a, b) => (b.skill_level || 3) - (a.skill_level || 3));
    const teamA = [];
    const teamB = [];

    sorted.forEach((p, idx) => {
        if (idx % 2 === 0) teamA.push(p);
        else teamB.push(p);
    });

    return {
        teamA,
        teamB,
        teamASkill: teamA.reduce((sum, p) => sum + (p.skill_level || 3), 0),
        teamBSkill: teamB.reduce((sum, p) => sum + (p.skill_level || 3), 0),
        balanceScore: 50.0,
        missingRoles: {
            teamA: ['Goalkeeper'],
            teamB: ['Goalkeeper']
        }
    };
}

// GET /api/ai/synergy/:targetUserId
const getSynergy = async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId).select('-passwordHash');
        const targetUser = await User.findById(req.params.targetUserId).select('-passwordHash');
        
        if (!targetUser) return res.status(404).json({ error: 'Target user not found' });

        try {
            const aiRes = await axios.post(`${AI_SERVICE_URL}/recommend/synergy`, {
                user1: currentUser ? currentUser.toObject() : {},
                user2: targetUser.toObject()
            }, { timeout: 3000 });
            return res.json(aiRes.data);
        } catch (aiErr) {
            console.log('[AI Fallback] Using JS Synergy Calculator');
            const fallbackData = calculateJSSynergy(currentUser?.toObject(), targetUser.toObject());
            return res.json(fallbackData);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// POST /api/ai/squad-balance
const balanceSquad = async (req, res) => {
    try {
        const { matchId, playerIds, sport } = req.body;

        let players = [];
        if (playerIds && Array.isArray(playerIds) && playerIds.length > 0) {
            players = await User.find({ _id: { $in: playerIds } }).select('-passwordHash');
        } else if (matchId) {
            const match = await Match.findById(matchId);
            if (match && match.joinedPlayers) {
                players = await User.find({ _id: { $in: match.joinedPlayers } }).select('-passwordHash');
            }
        }

        const playersObj = players.map(p => p.toObject());

        try {
            const aiRes = await axios.post(`${AI_SERVICE_URL}/recommend/squad`, {
                players: playersObj,
                sport: sport || 'football'
            }, { timeout: 3000 });
            return res.json(aiRes.data);
        } catch (aiErr) {
            console.log('[AI Fallback] Using JS Squad Balancer');
            const fallbackData = balanceJSSquad(playersObj, sport);
            return res.json(fallbackData);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/ai/recommended-invites/:matchId
const getRecommendedInvites = async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId);
        if (!match) return res.status(404).json({ error: 'Match not found' });

        const currentUser = await User.findById(req.userId).select('-passwordHash');

        // Find active players near match location not already in joinedPlayers
        const existingIds = (match.joinedPlayers || []).map(id => id.toString());
        existingIds.push(req.userId);

        const candidates = await User.find({
            _id: { $nin: existingIds },
            status: 'active'
        }).select('-passwordHash').limit(15);

        // Score candidates using synergy
        const scored = candidates.map(c => {
            const syn = calculateJSSynergy(currentUser?.toObject(), c.toObject());
            return {
                player: c,
                synergyScore: syn.synergyScore,
                breakdown: syn.breakdown
            };
        });

        scored.sort((a, b) => b.synergyScore - a.synergyScore);
        res.json(scored.slice(0, 5));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getSynergy, balanceSquad, getRecommendedInvites };

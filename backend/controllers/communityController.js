const Community = require('../models/Community');
const CommunityMember = require('../models/CommunityMember');
const mongoose = require('mongoose');

// Generate a slug from name
const generateSlug = async (name) => {
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let existing = await Community.findOne({ slug });
    let count = 1;
    while (existing) {
        const newSlug = `${slug}-${count}`;
        existing = await Community.findOne({ slug: newSlug });
        if (!existing) {
            slug = newSlug;
        }
        count++;
    }
    return slug;
};

exports.createCommunity = async (req, res) => {
    try {
        const { name, description, category, sports, locationName, lat, lon, privacy, rules, tags } = req.body;
        
        const slug = await generateSlug(name);
        
        const community = new Community({
            name,
            slug,
            description,
            category,
            sports: sports || [],
            locationName,
            location: (lat && lon) ? { type: 'Point', coordinates: [parseFloat(lon), parseFloat(lat)] } : undefined,
            owner: req.userId,
            privacy,
            rules,
            tags: tags || [],
            stats: { memberCount: 1, postCount: 0, matchCount: 0, eventCount: 0 }
        });
        
        await community.save();
        
        // Add owner as a member
        const member = new CommunityMember({
            community: community._id,
            user: req.userId,
            role: 'owner',
            status: 'active'
        });
        await member.save();
        
        res.status(201).json(community);
    } catch (error) {
        console.error('Create community error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getCommunities = async (req, res) => {
    try {
        const { tab, lat, lon, search, sport, limit = 20, page = 1 } = req.query;
        let query = {};
        
        // Tabs logic
        if (tab === 'joined') {
            const memberships = await CommunityMember.find({ user: req.userId, status: 'active' });
            const communityIds = memberships.map(m => m.community);
            query._id = { $in: communityIds };
        } else if (tab === 'nearby' && lat && lon) {
            query.location = {
                $near: {
                    $geometry: { type: 'Point', coordinates: [parseFloat(lon), parseFloat(lat)] },
                    $maxDistance: 50000 // 50km
                }
            };
            query.privacy = { $ne: 'hidden' };
        } else {
            // Default: popular or recommended
            query.privacy = { $ne: 'hidden' };
        }

        // Filters
        if (search) {
            query.$text = { $search: search };
        }
        if (sport) {
            query.sports = sport;
        }

        let sort = {};
        if (tab === 'popular') sort = { 'stats.memberCount': -1 };
        else if (tab === 'newest') sort = { createdAt: -1 };
        else if (search) sort = { score: { $meta: 'textScore' } };
        else if (tab !== 'nearby') sort = { 'stats.memberCount': -1 }; // Default sort if not geospatial

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const communitiesQuery = Community.find(query);
        if (Object.keys(sort).length > 0 && !query.location) {
            communitiesQuery.sort(sort);
        }
        
        const communities = await communitiesQuery
            .select('name slug description category sports locationName privacy stats coverImage logo verified')
            .skip(skip)
            .limit(parseInt(limit))
            .lean(); // Faster execution
            
        // For 'joined' tab, we also want to return the user's role
        if (req.userId) {
            const communityIds = communities.map(c => c._id);
            const userMemberships = await CommunityMember.find({ 
                user: req.userId, 
                community: { $in: communityIds }
            });
            
            const membershipMap = {};
            userMemberships.forEach(m => membershipMap[m.community.toString()] = m);
            
            communities.forEach(c => {
                c.membership = membershipMap[c._id.toString()] || null;
            });
        }
            
        res.json(communities);
    } catch (error) {
        console.error('Get communities error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getCommunityBySlug = async (req, res) => {
    try {
        const community = await Community.findOne({ slug: req.params.slug })
            .populate('owner', 'name profileImage');
            
        if (!community) return res.status(404).json({ error: 'Community not found' });
        
        // If hidden, only members can view
        let membership = null;
        if (req.userId) {
            membership = await CommunityMember.findOne({ community: community._id, user: req.userId });
        }
        
        if (community.privacy === 'hidden' && (!membership || membership.status !== 'active')) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const communityObj = community.toObject();
        communityObj.membership = membership;
        
        res.json(communityObj);
    } catch (error) {
        console.error('Get community error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.joinCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);
        if (!community) return res.status(404).json({ error: 'Community not found' });
        
        if (community.privacy === 'hidden') return res.status(403).json({ error: 'Cannot join hidden community directly' });
        
        let member = await CommunityMember.findOne({ community: community._id, user: req.userId });
        
        if (member) {
            if (member.status === 'active') return res.status(400).json({ error: 'Already a member' });
            if (member.status === 'banned') return res.status(403).json({ error: 'You are banned from this community' });
            
            // Re-join if they left
            member.status = community.privacy === 'private' ? 'pending' : 'active';
            await member.save();
        } else {
            member = new CommunityMember({
                community: community._id,
                user: req.userId,
                status: community.privacy === 'private' ? 'pending' : 'active'
            });
            await member.save();
        }
        
        if (member.status === 'active') {
            await Community.findByIdAndUpdate(community._id, { $inc: { 'stats.memberCount': 1 } });
        }
        
        res.json({ message: member.status === 'active' ? 'Joined successfully' : 'Request sent', membership: member });
    } catch (error) {
        console.error('Join community error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.leaveCommunity = async (req, res) => {
    try {
        const member = await CommunityMember.findOne({ community: req.params.id, user: req.userId });
        if (!member || member.status !== 'active') return res.status(400).json({ error: 'Not an active member' });
        
        if (member.role === 'owner') return res.status(400).json({ error: 'Owner cannot leave without transferring ownership' });
        
        member.status = 'left';
        await member.save();
        
        await Community.findByIdAndUpdate(req.params.id, { $inc: { 'stats.memberCount': -1 } });
        
        res.json({ message: 'Left community successfully' });
    } catch (error) {
        console.error('Leave community error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getCommunityMembers = async (req, res) => {
    try {
        const members = await CommunityMember.find({ community: req.params.id, status: 'active' })
            .select('-__v -updatedAt')
            .populate('user', 'name profileImage sports skillLevel locationName')
            .sort({ role: 1 }); // Quick sort (owner, admin, etc.)
            
        res.json(members);
    } catch (error) {
        console.error('Get members error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

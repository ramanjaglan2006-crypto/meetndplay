const CommunityPost = require('../models/CommunityPost');
const CommunityComment = require('../models/CommunityComment');
const CommunityMember = require('../models/CommunityMember');
const Community = require('../models/Community');
const Notification = require('../models/Notification'); // If we need it

exports.getPosts = async (req, res) => {
    try {
        const { limit = 20, page = 1 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Authorization check (can they view this community?)
        const community = await Community.findById(req.params.communityId);
        if (!community) return res.status(404).json({ error: 'Community not found' });
        
        let isMember = false;
        if (req.userId) {
            const member = await CommunityMember.findOne({ community: community._id, user: req.userId, status: 'active' });
            if (member) isMember = true;
        }
        
        if (community.privacy !== 'public' && !isMember) {
            return res.status(403).json({ error: 'Access denied. You must be a member to view posts.' });
        }
        
        const postsQuery = { community: req.params.communityId };
        
        // Pinned posts logic? Maybe they are fetched separately or sorted first. We'll just sort by pinned, then date.
        const posts = await CommunityPost.find(postsQuery)
            .sort({ pinned: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('author', 'name profileImage')
            .populate({
                path: 'linkedMatch',
                populate: { path: 'hostId', select: 'name' }
            })
            .populate({
                path: 'linkedEvent',
                populate: { path: 'organizer', select: 'name' }
            });
            
        // Get user reactions
        if (req.userId) {
            posts.forEach(post => {
                post._doc.hasLiked = post.likes.includes(req.userId);
            });
        }
            
        res.json(posts);
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { content, type, attachments, linkedMatch, linkedEvent } = req.body;
        const communityId = req.params.communityId;
        
        const member = await CommunityMember.findOne({ community: communityId, user: req.userId, status: 'active' });
        if (!member) return res.status(403).json({ error: 'You must be a member to post' });
        
        const post = new CommunityPost({
            community: communityId,
            author: req.userId,
            content,
            type,
            attachments,
            linkedMatch,
            linkedEvent
        });
        
        await post.save();
        
        await Community.findByIdAndUpdate(communityId, { $inc: { 'stats.postCount': 1 } });
        
        await post.populate('author', 'name profileImage');
        
        res.status(201).json(post);
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await CommunityPost.findById(req.params.postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        
        const hasLiked = post.likes.includes(req.userId);
        
        if (hasLiked) {
            post.likes.pull(req.userId);
        } else {
            post.likes.push(req.userId);
        }
        
        await post.save();
        
        res.json({ likesCount: post.likes.length, hasLiked: !hasLiked });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getComments = async (req, res) => {
    try {
        const comments = await CommunityComment.find({ post: req.params.postId })
            .sort({ createdAt: 1 })
            .populate('author', 'name profileImage');
            
        res.json(comments);
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { content, parentComment } = req.body;
        
        const post = await CommunityPost.findById(req.params.postId);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        
        const member = await CommunityMember.findOne({ community: post.community, user: req.userId, status: 'active' });
        if (!member) return res.status(403).json({ error: 'You must be a member to comment' });
        
        const comment = new CommunityComment({
            post: post._id,
            author: req.userId,
            content,
            parentComment
        });
        
        await comment.save();
        
        post.commentsCount += 1;
        await post.save();
        
        await comment.populate('author', 'name profileImage');
        
        res.status(201).json(comment);
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

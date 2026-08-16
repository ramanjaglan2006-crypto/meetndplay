const Message = require('../models/Message');
const CommunityMember = require('../models/CommunityMember');

exports.getCommunityMessages = async (req, res) => {
    try {
        const { id: communityId } = req.params;
        const limit = parseInt(req.query.limit) || 50;
        const cursor = req.query.cursor; // Timestamp or Message ID for pagination

        // Ensure user is a member
        const member = await CommunityMember.findOne({ community: communityId, user: req.userId, status: 'active' });
        if (!member) {
            return res.status(403).json({ error: 'You must be an active member to view messages' });
        }

        let query = { community: communityId };
        if (cursor) {
            query.createdAt = { $lt: new Date(cursor) };
        }

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('sender', 'name profilePicture')
            .populate('replyTo', 'text sender'); // Can populate sender of replyTo if needed

        res.json(messages.reverse());
    } catch (error) {
        res.status(500).json({ error: 'Server error fetching messages' });
    }
};

exports.sendCommunityMessage = async (req, res) => {
    try {
        const { id: communityId } = req.params;
        const { text, replyTo } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Message cannot be empty' });
        }

        // Validate membership
        const member = await CommunityMember.findOne({ community: communityId, user: req.userId, status: 'active' });
        if (!member) {
            return res.status(403).json({ error: 'You must be an active member to send messages' });
        }

        const newMessage = new Message({
            community: communityId,
            type: 'community',
            sender: req.userId,
            text: text.trim(),
            replyTo: replyTo || null
        });

        await newMessage.save();

        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'name profilePicture')
            .populate('replyTo', 'text');

        // Broadcast via Socket.io to the community room
        if (req.io) {
            req.io.to(`community:${communityId}`).emit('new_community_message', populatedMessage);
        }

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ error: 'Server error sending message' });
    }
};

exports.deleteCommunityMessage = async (req, res) => {
    try {
        const { id: communityId, messageId } = req.params;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Validate ownership or moderator status
        const member = await CommunityMember.findOne({ community: communityId, user: req.userId });
        if (!member) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const isOwner = message.sender.toString() === req.userId;
        const isMod = member.role === 'admin' || member.role === 'moderator';

        if (!isOwner && !isMod) {
            return res.status(403).json({ error: 'Not authorized to delete this message' });
        }

        // Soft delete
        message.isDeleted = true;
        message.text = '';
        await message.save();

        if (req.io) {
            req.io.to(`community:${communityId}`).emit('delete_community_message', messageId);
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error deleting message' });
    }
};

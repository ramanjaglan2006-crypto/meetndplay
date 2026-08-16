const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ participants: req.userId })
            .populate('participants', 'name profileImage')
            .sort({ updatedAt: -1 });
        res.json(conversations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversation: conversationId })
            .populate('sender', 'name profileImage')
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { text, receiverId } = req.body;
        let convId = conversationId;

        // If no conversation ID, we create one (new direct message)
        if (!convId && receiverId) {
            let conv = await Conversation.findOne({
                participants: { $all: [req.userId, receiverId] }
            });
            if (!conv) {
                conv = new Conversation({
                    participants: [req.userId, receiverId],
                    lastMessage: text,
                    lastMessageAt: new Date()
                });
                await conv.save();
            }
            convId = conv._id;
        }

        const message = new Message({
            conversation: convId,
            sender: req.userId,
            text,
            readBy: [req.userId]
        });
        await message.save();

        await Conversation.findByIdAndUpdate(convId, {
            lastMessage: text,
            lastMessageAt: new Date()
        });

        res.status(201).json(message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getConversations, getMessages, sendMessage };

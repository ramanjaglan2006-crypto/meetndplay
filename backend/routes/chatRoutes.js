const express = require('express');
const { getConversations, getMessages, sendMessage } = require('../controllers/chatController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/conversations', requireAuth, getConversations);
router.get('/:conversationId/messages', requireAuth, getMessages);
router.post('/:conversationId/messages', requireAuth, sendMessage);
router.post('/messages', requireAuth, sendMessage); // For new conversations

module.exports = router;

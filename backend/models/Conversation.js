const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lastMessage: {
    type: String
  },
  lastMessageAt: {
    type: Date
  }
}, { timestamps: true });

// Ensure we can quickly find conversations for a user
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);

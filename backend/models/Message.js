const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
    // removed required: true to allow community messages
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  },
  type: {
    type: String,
    enum: ['direct', 'community', 'system'],
    default: 'direct'
  },
  systemData: {
    action: String,
    link: String
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  attachments: [{
    type: String
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

// Compound index for efficient chat retrieval
messageSchema.index({ conversation: 1, createdAt: 1 });
messageSchema.index({ community: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);

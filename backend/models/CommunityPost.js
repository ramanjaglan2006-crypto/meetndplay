const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true,
    index: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['General', 'Discussion', 'Question', 'Announcement', 'Match', 'Event', 'Poll', 'Achievement'],
    default: 'General'
  },
  content: {
    type: String,
    required: true
  },
  attachments: [{
    type: String // URLs to images/files
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  commentsCount: {
    type: Number,
    default: 0
  },
  visibility: {
    type: String,
    enum: ['public', 'members_only'],
    default: 'members_only'
  },
  pinned: {
    type: Boolean,
    default: false
  },
  // If type is 'Match' or 'Event', reference the actual entity
  linkedMatch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match'
  },
  linkedEvent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }
}, { timestamps: true });

communityPostSchema.set('toJSON', { virtuals: true });
communityPostSchema.set('toObject', { virtuals: true });

communityPostSchema.index({ community: 1, createdAt: -1 });

module.exports = mongoose.model('CommunityPost', communityPostSchema);

const mongoose = require('mongoose');

const communityMemberSchema = new mongoose.Schema({
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'moderator', 'member'],
    default: 'member'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'banned', 'left'],
    default: 'active'
  },
  mutedUntil: {
    type: Date
  },
  notificationPreference: {
    type: String,
    enum: ['all', 'mentions', 'none'],
    default: 'all'
  }
}, { timestamps: true });

// A user can only have one membership record per community
communityMemberSchema.index({ community: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('CommunityMember', communityMemberSchema);

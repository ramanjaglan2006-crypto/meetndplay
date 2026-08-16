const mongoose = require('mongoose');

const communityCommentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true,
    index: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityComment',
    default: null
  }
}, { timestamps: true });

communityCommentSchema.set('toJSON', { virtuals: true });
communityCommentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('CommunityComment', communityCommentSchema);

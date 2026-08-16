const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending'
  }
}, { timestamps: true });

// Prevent duplicate connection requests in either direction
connectionSchema.index({ requester: 1, receiver: 1 }, { unique: true });

module.exports = mongoose.model('Connection', connectionSchema);

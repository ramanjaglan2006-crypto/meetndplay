const mongoose = require('mongoose');

const matchParticipationSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: {
    type: String,
    enum: ['A', 'B'],
    required: true
  },
  position: {
    type: String,
    required: true,
    default: 'Player'
  },
  positionType: {
    type: String,
    default: 'primary'
  },
  openToOtherPositions: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound unique index to prevent duplicate joins & race condition capacity violations
matchParticipationSchema.index({ matchId: 1, userId: 1 }, { unique: true });
matchParticipationSchema.index({ matchId: 1, status: 1 });

module.exports = mongoose.model('MatchParticipation', matchParticipationSchema);

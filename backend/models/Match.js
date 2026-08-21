const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
}, { _id: false });

const matchSchema = new mongoose.Schema({
  title: {
    type: String
  },
  sport: {
    type: String,
    required: true
  },
  format: {
    type: String,
    enum: ['5-a-side', '7-a-side', '11-a-side'],
    default: '5-a-side'
  },
  playersPerTeam: {
    type: Number,
    default: 5
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  joinedPlayers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalPlayers: {
    type: Number,
    required: true,
    default: 10,
    min: 2
  },
  skillLevel: {
    type: Number,
    min: 1,
    max: 5
  },
  dateTime: {
    type: Date,
    required: true
  },
  locationName: {
    type: String,
    required: true
  },
  location: {
    type: pointSchema,
    index: '2dsphere'
  },
  description: {
    type: String
  },
  rules: {
    type: String
  },
  status: {
    type: String,
    enum: ['open', 'full', 'live', 'completed', 'cancelled'],
    default: 'open'
  },
  invites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  }
}, { timestamps: true });

matchSchema.index({ sport: 1, status: 1 });
matchSchema.index({ location: '2dsphere', sport: 1, status: 1 });

module.exports = mongoose.model('Match', matchSchema);

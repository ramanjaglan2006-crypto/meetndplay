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

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    maxLength: 1000
  },
  logo: {
    type: String
  },
  coverImage: {
    type: String
  },
  category: {
    type: String,
    enum: ['College', 'City', 'Sport', 'Club', 'Professional', 'Beginner', 'Competitive', 'Casual', 'Other'],
    default: 'Sport'
  },
  sports: [{
    type: String
  }],
  locationName: {
    type: String
  },
  location: {
    type: pointSchema,
    index: '2dsphere'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  privacy: {
    type: String,
    enum: ['public', 'private', 'hidden'],
    default: 'public'
  },
  rules: {
    type: String,
    maxLength: 2000
  },
  tags: [{
    type: String,
    trim: true
  }],
  verified: {
    type: Boolean,
    default: false
  },
  stats: {
    memberCount: { type: Number, default: 0 },
    postCount: { type: Number, default: 0 },
    matchCount: { type: Number, default: 0 },
    eventCount: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Ensure text search capabilities on name, description, sports
communitySchema.index({ name: 'text', description: 'text', sports: 'text', tags: 'text' });

// Add virtuals in toJSON
communitySchema.set('toJSON', { virtuals: true });
communitySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Community', communitySchema);

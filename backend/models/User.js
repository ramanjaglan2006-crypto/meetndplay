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

const athleteSportSchema = new mongoose.Schema({
  sport: { type: String, required: true },
  skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Competitive', 'Professional'], required: true },
  positions: [{ type: String }],
  experienceYears: { type: Number },
  playingStyle: [{ type: String }],
  competitiveLevel: { type: String }
});

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sport: { type: String },
  competition: { type: String },
  year: { type: Number },
  description: { type: String },
  proofUrl: { type: String },
  verified: { type: Boolean, default: false }
});

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  sport: { type: String },
  role: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String }
});

const photoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  thumbnailUrl: { type: String },
  type: { type: String, default: 'casual' }, // e.g. profile, action, casual
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  photos: [photoSchema],
  bio: {
    type: String,
    default: 'Ready to play!',
    maxLength: 500
  },
  age: {
    type: Number,
    min: 13,
    max: 120
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  sports: [athleteSportSchema],
  achievements: [achievementSchema],
  teams: [teamSchema],
  interests: [{ type: String }],
  availability: {
    monday: [{ type: String }], // e.g., 'Morning', 'Evening'
    tuesday: [{ type: String }],
    wednesday: [{ type: String }],
    thursday: [{ type: String }],
    friday: [{ type: String }],
    saturday: [{ type: String }],
    sunday: [{ type: String }]
  },
  preferences: {
    lookingFor: [{ type: String }], // 'Casual games', 'Competitive games'
    preferredRadiusKm: { type: Number, default: 10 }
  },
  privacy: {
    profileVisibility: { type: String, enum: ['Public', 'Matches only', 'Private'], default: 'Public' },
    ageVisibility: { type: String, enum: ['Public', 'Private'], default: 'Public' },
    locationVisibility: { type: String, enum: ['Public', 'Matches only', 'Private'], default: 'Public' }
  },
  reputation: {
    score: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 }
  },
  location: {
    type: pointSchema,
    index: '2dsphere' // Create a special 2dsphere index on this field
  },
  locationName: { type: String },
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

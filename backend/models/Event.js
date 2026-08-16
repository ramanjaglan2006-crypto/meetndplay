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

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  sport: {
    type: String,
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  registrationDeadline: {
    type: Date
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxParticipants: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  }
}, { timestamps: true });
eventSchema.index({ startDate: 1, sport: 1 });
eventSchema.index({ status: 1 });

module.exports = mongoose.model('Event', eventSchema);

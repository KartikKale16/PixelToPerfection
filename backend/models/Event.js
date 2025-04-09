const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  startDateTime: {
    type: Date,
    required: [true, 'Start date and time is required']
  },
  endDateTime: {
    type: Date,
    required: [true, 'End date and time is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  image: {
    type: String,
    default: 'https://placehold.co/600x400/3b82f6/ffffff?text=EventImage'
  },
  tags: {
    type: [String],
    default: []
  },
  attendees: {
    type: Number,
    default: 0
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema); 
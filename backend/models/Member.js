const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide member name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  position: {
    type: String,
    required: [true, 'Please provide member position'],
    trim: true,
    maxlength: [100, 'Position cannot be more than 100 characters']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  email: {
    type: String,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email'
    ]
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: '/uploads/default-profile.png'
  },
  socialLinks: {
    linkedin: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    }
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  priority: {
    type: Number,
    default: 999
  },
  active: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Member', MemberSchema); 
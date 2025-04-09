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
  photoUrl: {
    type: String,
    default: '/uploads/default-profile.png'
  },
  priority: {
    type: Number,
    default: 999
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Member', MemberSchema); 
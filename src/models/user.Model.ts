const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone : {
    type: String,
    required: true,
    unique: true
  },
  profilePIC: {
    type: Buffer,
  },
  role: {
    type: String,
    enum: ['student', 'instructor'],
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
},{timestamps:true});

const User = mongoose.model('User', userSchema);

export {User};
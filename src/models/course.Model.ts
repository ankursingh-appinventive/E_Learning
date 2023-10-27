const mongoose = require('mongoose');

const validCategories = [
  'Math',
  'Science',
  'History',
  'Literature',
  'Computer Science',
  'Art',
  'Music',
  'Physical Education',
  'Languages',
  'Business',
];

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: validCategories
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  courseFee : {
    type : String,
    required: true
  },
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  }],
  quizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  published:{
    type: Boolean,
    default: false
  }
},{timestamps:true});

const Course = mongoose.model('Course', courseSchema);

export {Course};


const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  questionNo: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  correctAnswers: [{
    type: String,
    required: true,
  }]
},{timestamps:true});

const Assignment = mongoose.model('Assignment', assignmentSchema);

export {Assignment};

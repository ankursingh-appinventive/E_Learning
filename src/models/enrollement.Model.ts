const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  tittle: { 
    type: String, 
    ref: 'Course',
  },
  enrollmentDate: { 
    type: Date, 
    required: true 
  },
  payment : {
    type : Boolean,
    default: false
  }
},{timestamps:true});

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);

export {Enrollment};

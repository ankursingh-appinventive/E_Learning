import mongoose, { Document } from 'mongoose';

interface IProgress extends Document {
  userId: object;
  courseId: object;
  score: number;
  totalModules: number;
}

const ProgressSchema = new mongoose.Schema<IProgress>({
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
  score: {
    type: Number,
    default: 0
  }
},{timestamps: true});

const ProgressModel = mongoose.model<IProgress>('Progress', ProgressSchema);

export {ProgressModel};

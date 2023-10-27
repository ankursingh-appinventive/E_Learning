import mongoose, { Document } from 'mongoose';

interface IPayment extends Document {
  userId: object;
  courseId: object;
  amount: string;
  paymentDate: Date;
}

const PaymentSchema = new mongoose.Schema<IPayment>({
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
  amount: { 
    type: String, 
    required: true 
  },
  paymentDate: { 
    type: Date, 
    required: true 
  },
});

const PaymentModel = mongoose.model<IPayment>('Payment', PaymentSchema);

export {PaymentModel};

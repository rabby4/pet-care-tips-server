import { model, Schema } from 'mongoose';
import { TPayment } from './payment.interface';

const paymentSchema = new Schema<TPayment>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  trxId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

export const Payment = model<TPayment>('Payment', paymentSchema);

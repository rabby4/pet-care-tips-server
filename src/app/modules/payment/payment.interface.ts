import { Types } from 'mongoose';

export interface TPayment {
  userId: Types.ObjectId;
  trxId: string;
  email: string;
  amount: number;
}

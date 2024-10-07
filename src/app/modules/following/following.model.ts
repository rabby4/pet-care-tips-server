import { model, Schema } from 'mongoose';
import { TFollowing } from './following.interface';

const followingSchema = new Schema<TFollowing>({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const Following = model<TFollowing>('Following', followingSchema);

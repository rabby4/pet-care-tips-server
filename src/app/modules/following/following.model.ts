import { model, Schema } from 'mongoose';
import { TFollowing } from './following.interface';

const followingSchema = new Schema<TFollowing>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
});

export const Following = model<TFollowing>('Following', followingSchema);

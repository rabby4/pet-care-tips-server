import { model, Schema } from 'mongoose';
import { TFollower } from './follower.interface';

const followerSchema = new Schema<TFollower>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
});

export const Follower = model<TFollower>('Follower', followerSchema);

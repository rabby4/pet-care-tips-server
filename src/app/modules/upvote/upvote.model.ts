import { model, Schema } from 'mongoose';
import { TUpvote } from './upvote.interface';

const upvoteSchema = new Schema<TUpvote>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
});

export const Upvote = model<TUpvote>('Upvote', upvoteSchema);

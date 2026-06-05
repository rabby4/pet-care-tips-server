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

// one upvote per user per post, enforced by the database
upvoteSchema.index({ user: 1, post: 1 }, { unique: true });

export const Upvote = model<TUpvote>('Upvote', upvoteSchema);

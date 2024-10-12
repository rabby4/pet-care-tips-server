import { model, Schema } from 'mongoose';
import { TDownvote } from './downvote.interface';

const downvoteSchema = new Schema<TDownvote>({
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

export const Downvote = model<TDownvote>('Downvote', downvoteSchema);

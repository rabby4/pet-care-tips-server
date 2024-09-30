import { model, Schema } from 'mongoose';
import { TDownvote } from './downvote.interface';

const downvoteSchema = new Schema<TDownvote>({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
});

export const Downvote = model<TDownvote>('Downvote', downvoteSchema);

import { Schema, model } from 'mongoose';
import { TComment, TPost } from './post.interface';

const commentSchema = new Schema<TComment>(
  {
    content: {
      type: String,
      required: true,
    },
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

export const Comment = model<TComment>('Comment', commentSchema);

const postSchema = new Schema<TPost>(
  {
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    upvote: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    downvote: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    premium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Post = model<TPost>('Post', postSchema);

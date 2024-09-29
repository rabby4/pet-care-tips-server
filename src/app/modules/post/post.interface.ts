import { Types } from 'mongoose';
import { TComment } from '../comments/comment.interface';

export type TPost = {
  user: Types.ObjectId;
  content: string;
  image: string;
  category: string;
  premium: boolean;
  upvote: Types.ObjectId[];
  downvote: Types.ObjectId[];
  comments: TComment[];
};

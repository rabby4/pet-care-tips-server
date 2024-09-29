import { Types } from 'mongoose';

export type TComment = {
  user: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
};

export type TPost = {
  user: Types.ObjectId;
  content: string;
  image: string;
  upvote: Types.ObjectId[];
  downvote: Types.ObjectId[];
  comments: TComment[];
};

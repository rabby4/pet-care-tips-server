import { Types } from 'mongoose';

export type TUpvote = {
  user: Types.ObjectId;
  post: Types.ObjectId;
};

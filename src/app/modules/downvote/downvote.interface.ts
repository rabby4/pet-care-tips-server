import { Types } from 'mongoose';

export type TDownvote = {
  user: Types.ObjectId;
  post: Types.ObjectId;
};

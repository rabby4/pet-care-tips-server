import { Types } from 'mongoose';

export type TFollowing = {
  user: Types.ObjectId;
  following: Types.ObjectId;
};

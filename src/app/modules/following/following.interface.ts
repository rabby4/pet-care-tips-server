import { Types } from 'mongoose';

export type TFollowing = {
  follower: Types.ObjectId;
  following: Types.ObjectId;
};

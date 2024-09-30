import { Types } from 'mongoose';

export type TFollower = {
  user: Types.ObjectId;
  follower: Types.ObjectId;
};

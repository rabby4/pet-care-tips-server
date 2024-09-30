import { TFollowing } from './following.interface';
import { Following } from './following.model';

const createFollowingIntoDB = async (payload: TFollowing) => {
  const result = await Following.create(payload);
  return result;
};

const getAllFollowingForUserFromDB = async (id: string) => {
  const result = await Following.find({ user: id });
  return result;
};

export const FollowingServices = {
  createFollowingIntoDB,
  getAllFollowingForUserFromDB,
};

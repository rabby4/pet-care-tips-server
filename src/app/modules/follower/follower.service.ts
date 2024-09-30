import { TFollower } from './follower.interface';
import { Follower } from './follower.model';

const createFollowerIntoDB = async (payload: TFollower) => {
  const result = await Follower.create(payload);
  return result;
};

const getAllFollowerForUserFromDB = async (id: string) => {
  const result = await Follower.find({ user: id });
  return result;
};

export const FollowerServices = {
  createFollowerIntoDB,
  getAllFollowerForUserFromDB,
};

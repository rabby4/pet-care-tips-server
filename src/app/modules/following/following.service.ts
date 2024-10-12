import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { User } from '../user/user.model';
import { TFollowing } from './following.interface';
import { Following } from './following.model';

const createFollowingIntoDB = async (payload: TFollowing) => {
  const user = await User.findById(payload.following);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const followRecord = await Following.findOne({
    follower: payload.follower,
    following: payload.following,
  });

  if (followRecord) {
    throw new AppError(httpStatus.CONFLICT, 'Already following this user');
  }

  const result = await Following.create(payload);
  return result;
};

const unFollowUserFromDB = async (id: string, payload: TFollowing) => {
  const result = await Following.deleteOne({
    follower: id,
    following: payload.following,
  });
  if (result.deletedCount === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'Follow relationship not found');
  }
  return result;
};

const getFollowingStatusFromDB = async (
  followerId: string,
  followingId: string,
) => {
  const followRecord = await Following.findOne({
    follower: followerId,
    following: followingId,
  });

 
  return !!followRecord;
};

const getAllFollowingForUserFromDB = async (id: string) => {
  const result = await Following.find({ follower: id })
    .populate('following')
    .populate('follower');
  return result;
};

const getAllFollowerForUserFromDB = async (id: string) => {
  const result = await Following.find({ following: id })
    .populate('following')
    .populate('follower');
  return result;
};

export const FollowingServices = {
  createFollowingIntoDB,
  unFollowUserFromDB,
  getFollowingStatusFromDB,
  getAllFollowingForUserFromDB,
  getAllFollowerForUserFromDB,
};

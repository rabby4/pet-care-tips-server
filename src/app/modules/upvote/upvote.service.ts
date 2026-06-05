import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import { Downvote } from '../downvote/downvote.model';
import { TUpvote } from './upvote.interface';
import { Upvote } from './upvote.model';

const createUpvoteIntoDB = async (payload: TUpvote) => {
  const isExitsUpVote = await Upvote.findOne({
    user: payload.user,
    post: payload.post,
  });

  const isExitsDownVote = await Downvote.findOne({
    user: payload.user,
    post: payload.post,
  });

  if (isExitsUpVote || isExitsDownVote) {
    throw new AppError(httpStatus.CONFLICT, 'You already voted on this post!');
  }

  const result = await Upvote.create(payload);
  return result;
};

const getAllUpvoteForPostFromDB = async (id: string) => {
  const result = await Upvote.find({ post: id });
  return result;
};

export const UpvoteServices = {
  createUpvoteIntoDB,
  getAllUpvoteForPostFromDB,
};

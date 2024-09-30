import { TUpvote } from './upvote.interface';
import { Upvote } from './upvote.model';

const createUpvoteIntoDB = async (payload: TUpvote) => {
  const result = await Upvote.create(payload);
  return result;
};

const getAllUpvoteForPostFromDB = async (id: string) => {
  const result = await Upvote.find({ post: id });
  return result;
};

export const UpvoteServices = {
  createUpvoteIntoDB,
  getAllUpvoteForPostFromDB
};

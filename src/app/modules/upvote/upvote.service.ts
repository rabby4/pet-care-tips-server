import { TUpvote } from './upvote.interface';
import { Upvote } from './upvote.model';

const createUpvoteIntoDB = async (payload: TUpvote) => {
  const result = await Upvote.create(payload);
  return result;
};

export const UpvoteServices = {
  createUpvoteIntoDB,
};

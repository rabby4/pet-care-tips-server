import { TDownvote } from './downvote.interface';
import { Downvote } from './downvote.model';

const createDownvoteIntoDB = async (payload: TDownvote) => {
  const result = await Downvote.create(payload);
  return result;
};

const getAllDownvoteForPostFromDB = async (id: string) => {
  const result = await Downvote.find({ post: id });
  return result;
};

export const DownvoteServices = {
  createDownvoteIntoDB,
  getAllDownvoteForPostFromDB,
};

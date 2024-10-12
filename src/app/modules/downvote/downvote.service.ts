import { Upvote } from '../upvote/upvote.model';
import { TDownvote } from './downvote.interface';
import { Downvote } from './downvote.model';

const createDownvoteIntoDB = async (payload: TDownvote) => {
  const isExitsDownVote = await Downvote.findOne({
    user: payload.user,
    post: payload.post,
  });

  const isExitsUpVote = await Upvote.findOne({
    user: payload.user,
    post: payload.post,
  });

  if (isExitsUpVote || isExitsDownVote) {
    throw new Error('You already upvoted this post');
  }
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

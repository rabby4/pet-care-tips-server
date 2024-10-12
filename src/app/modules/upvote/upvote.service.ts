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
    throw new Error('User already upvoted this post');
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

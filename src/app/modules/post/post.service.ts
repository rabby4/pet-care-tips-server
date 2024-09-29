import { TUser } from '../user/user.interface';
import { Post } from './post.model';

const createPostIntoDB = async (payload: TUser) => {
  const result = await Post.create(payload);
  return result;
};

export const PostServices = {
  createPostIntoDB,
};

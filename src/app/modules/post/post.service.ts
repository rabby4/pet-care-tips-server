import QueryBuilder from '../../builder/QueryBuilder';
import { TUser } from '../user/user.interface';
import { Post } from './post.model';

const createPostIntoDB = async (payload: TUser) => {
  const result = await Post.create(payload);
  return result;
};

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(Post.find(), query)
    .search(['content'])
    .filter()
    .sort()
    .fields();

  const result = await postQuery.modelQuery;
  return result;
};

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
};

import QueryBuilder from '../../builder/QueryBuilder';
import { TPost } from './post.interface';
import { Post } from './post.model';

const createPostIntoDB = async (payload: TPost) => {
  const result = await Post.create(payload);
  return result;
};

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  const postQuery = new QueryBuilder(
    Post.find()
      .populate('user')
      .populate({
        path: 'upvote',
        select: 'firstName lastName image',
      })
      .populate({
        path: 'downvote',
        select: 'firstName lastName image',
      }),
    query,
  )
    .search(['content'])
    .filter()
    .sort()
    .fields();

  const result = await postQuery.modelQuery;
  return result;
};

const getSinglePostsFromDB = async (id: string) => {
  const result = await Post.findById(id);
  return result;
};

const updatePostIntoDB = async (id: string, payload: Partial<TPost>) => {
  const result = await Post.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deletePostFromDB = async (id: string) => {
  const result = await Post.findByIdAndDelete(id);
  return result;
};

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getSinglePostsFromDB,
  updatePostIntoDB,
  deletePostFromDB,
};

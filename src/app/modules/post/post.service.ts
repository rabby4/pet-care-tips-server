import QueryBuilder from '../../builder/QueryBuilder';
import { TPost } from './post.interface';
import { Post } from './post.model';

const createPostIntoDB = async (payload: TPost) => {
  const result = await Post.create(payload);
  return result;
};

// const getAllPostsFromDB = async (query: Record<string, unknown>) => {
//   const postQuery = new QueryBuilder(
//     Post.find().populate('user'),
//     // .populate({
//     //   path: 'upvote',
//     //   select: 'firstName lastName image',
//     // })
//     // .populate({
//     //   path: 'downvote',
//     //   select: 'firstName lastName image',
//     // }),
//     query,
//   )
//     .search(['content'])
//     .filter()
//     .sort()
//     .fields();
//
//   const result = await postQuery.modelQuery;
//   return result;
// };

const getAllPostsFromDB = async (
  query: Record<string, unknown>,
  searchQuery: string,
) => {
  const postQuery = Post.aggregate([
    { $match: query },
    ...(searchQuery
      ? [
          {
            $match: {
              content: { $regex: searchQuery, $options: 'i' },
            },
          },
        ]
      : []),
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $lookup: {
        from: 'upvotes',
        localField: '_id',
        foreignField: 'post',
        as: 'upvotes',
      },
    },
    {
      $addFields: {
        upvoteCount: { $size: '$upvotes' },
      },
    },
    { $sort: { upvoteCount: -1 } },
  ]);

  const result = await postQuery;
  return result;
};

const getAllUserPostsFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const postQuery = new QueryBuilder(
    Post.find({ user: userId }).populate('user'),
    // .populate({
    //   path: 'upvote',
    //   select: 'firstName lastName image',
    // })
    // .populate({
    //   path: 'downvote',
    //   select: 'firstName lastName image',
    // }),
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
  const result = await Post.findById(id).populate('user');
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
  getAllUserPostsFromDB,
  getSinglePostsFromDB,
  updatePostIntoDB,
  deletePostFromDB,
};

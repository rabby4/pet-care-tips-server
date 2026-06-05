/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { isAdminRole } from '../../middleware/auth';
import { Comment } from '../comments/comment.model';
import { Downvote } from '../downvote/downvote.model';
import { Upvote } from '../upvote/upvote.model';
import { TPost } from './post.interface';
import { Post } from './post.model';

const createPostIntoDB = async (payload: TPost) => {
  const result = await Post.create(payload);
  return result;
};

// replace full premium content with a short teaser for non-premium viewers
const redactPremiumContent = (post: any, requester?: JwtPayload) => {
  if (!post?.premium) return post;

  const authorId = String(post.user?._id ?? post.user ?? '');
  const isOwner = requester && authorId === String(requester.id);
  const isAdmin = requester && isAdminRole(requester.role);

  if (requester?.premium || isOwner || isAdmin) return post;

  const text = String(post.content ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    ...post,
    content: `<p>${text.slice(0, 120)}${text.length > 120 ? '...' : ''}</p>`,
    isRedacted: true,
  };
};

// only allow known filter fields into the database query
const buildPostFilter = (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};
  if (typeof query.category === 'string' && query.category) {
    filter.category = query.category;
  }
  if (query.premium === 'true') filter.premium = true;
  if (query.premium === 'false') filter.premium = false;
  return filter;
};

// escape user input before using it inside a $regex
const escapeRegex = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getAllPostsFromDB = async (
  query: Record<string, unknown>,
  searchQuery: string,
  requester?: JwtPayload,
) => {
  const isAdmin = !!(requester && isAdminRole(requester.role));

  const match = buildPostFilter(query);

  // non-admins only ever see published posts
  if (!isAdmin) {
    match.publish = { $ne: false };
  }

  // $lookup bypasses the schema's select:0, so sensitive user fields must be
  // stripped here; admins keep the email for the dashboard tables.
  // the raw vote/comment arrays are dropped too - only the counts ship.
  const projection: Record<string, 0> = {
    upvotes: 0,
    downvotes: 0,
    comments: 0,
    'user.password': 0,
  };
  if (!isAdmin) {
    projection['user.email'] = 0;
    projection['user.phone'] = 0;
    projection['user.address'] = 0;
    projection['user.dateOfBirth'] = 0;
  }

  // the logged-in viewer's id, used to flag which posts they voted on
  const requesterId = requester?.id
    ? new mongoose.Types.ObjectId(String(requester.id))
    : null;

  // Base query for posts
  const postQuery = Post.aggregate([
    { $match: match },

    // If a searchQuery is provided, add a match stage to filter by content
    ...(searchQuery
      ? [
          {
            $match: {
              content: { $regex: escapeRegex(searchQuery), $options: 'i' }, // Case-insensitive search
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
      $lookup: {
        from: 'downvotes',
        localField: '_id',
        foreignField: 'post',
        as: 'downvotes',
      },
    },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'post',
        as: 'comments',
      },
    },
    {
      // compute all the counts the feed needs in one pass, plus whether the
      // current viewer up/down-voted this post (for the highlighted icon)
      $addFields: {
        upvoteCount: { $size: '$upvotes' },
        downvoteCount: { $size: '$downvotes' },
        commentCount: { $size: '$comments' },
        userVote: requesterId
          ? {
              $cond: [
                { $in: [requesterId, '$upvotes.user'] },
                'up',
                {
                  $cond: [
                    { $in: [requesterId, '$downvotes.user'] },
                    'down',
                    null,
                  ],
                },
              ],
            }
          : null,
      },
    },
    { $project: projection },
    { $sort: { upvoteCount: -1 } },
  ]);

  const result = await postQuery;
  return result.map((post) => redactPremiumContent(post, requester));
};

const getAllUserPostsFromDB = async (
  userId: string,
  query: Record<string, unknown>,
  requester?: JwtPayload,
) => {
  const isOwner = requester && String(requester.id) === String(userId);
  const isAdmin = requester && isAdminRole(requester.role);

  const baseFilter: Record<string, unknown> = { user: userId };

  // only the owner (or an admin) can see their unpublished posts
  if (!isOwner && !isAdmin) {
    baseFilter.publish = { $ne: false };
  }

  // only pass known keys through to QueryBuilder (filter() spreads the rest into find)
  const safeQuery: Record<string, unknown> = {};
  for (const key of ['searchTerm', 'sort', 'limit', 'page', 'fields']) {
    if (query[key] !== undefined) safeQuery[key] = query[key];
  }
  Object.assign(safeQuery, buildPostFilter(query));

  const postQuery = new QueryBuilder(
    Post.find(baseFilter).populate('user'),
    safeQuery,
  )
    .search(['content'])
    .filter()
    .sort()
    .fields();

  const result = await postQuery.modelQuery;
  return result.map((post: any) =>
    redactPremiumContent(post.toObject(), requester),
  );
};

const getSinglePostsFromDB = async (id: string, requester?: JwtPayload) => {
  const result = await Post.findById(id).populate('user');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
  }

  const post = result.toObject() as any;

  const isOwner = requester && String(post.user?._id) === String(requester.id);
  const isAdmin = requester && isAdminRole(requester.role);

  // unpublished posts are only visible to their owner or an admin
  if (post.publish === false && !isOwner && !isAdmin) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
  }

  // attach the same counts + viewer vote the feed exposes
  const [upvoteCount, downvoteCount, commentCount, myUpvote, myDownvote] =
    await Promise.all([
      Upvote.countDocuments({ post: id }),
      Downvote.countDocuments({ post: id }),
      Comment.countDocuments({ post: id }),
      requester?.id ? Upvote.exists({ post: id, user: requester.id }) : null,
      requester?.id ? Downvote.exists({ post: id, user: requester.id }) : null,
    ]);

  post.upvoteCount = upvoteCount;
  post.downvoteCount = downvoteCount;
  post.commentCount = commentCount;
  post.userVote = myUpvote ? 'up' : myDownvote ? 'down' : null;

  return redactPremiumContent(post, requester);
};

// raw lookup used by controllers for ownership checks
const getPostById = async (id: string) => {
  return await Post.findById(id);
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

  // clean up everything that belonged to the post
  if (result) {
    await Promise.all([
      Comment.deleteMany({ post: id }),
      Upvote.deleteMany({ post: id }),
      Downvote.deleteMany({ post: id }),
    ]);
  }

  return result;
};

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getAllUserPostsFromDB,
  getSinglePostsFromDB,
  getPostById,
  updatePostIntoDB,
  deletePostFromDB,
};

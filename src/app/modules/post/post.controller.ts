import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';
import AppError from '../../errors/appError';
import { isAdminRole } from '../../middleware/auth';
import { sanitizePostContent } from '../../utils/sanitizeContent';

// create post information
const createPost = catchAsync(async (req, res) => {
  const payload = {
    ...req.body,
    // the author always comes from the verified token, never from the client
    user: req.user.id,
    content: sanitizePostContent(req.body.content ?? ''),
    image: req.file?.path,
  };

  // only premium members (or admins) can publish premium posts
  if (payload.premium && !(req.user.premium || isAdminRole(req.user.role))) {
    payload.premium = false;
  }

  // new posts always start published; visibility is managed via update
  delete payload.publish;

  const result = await PostServices.createPostIntoDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Post created successfully',
    data: result,
  });
});

// get all posts from database
const getAllPosts = catchAsync(async (req, res) => {
  const { search, ...query } = req.query;
  const result = await PostServices.getAllPostsFromDB(
    query,
    search as string,
    req.user,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Posts retrieved successfully',
    data: result,
  });
});

// get all posts of one user from database
const getAllUserPosts = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await PostServices.getAllUserPostsFromDB(
    userId,
    req.query,
    req.user,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Posts retrieved successfully',
    data: result,
  });
});

const getSinglePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostServices.getSinglePostsFromDB(id, req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post retrieved successfully',
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  const post = await PostServices.getPostById(id);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
  }

  const isAdmin = isAdminRole(req.user.role);

  if (String(post.user) !== req.user.id && !isAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only update your own posts!',
    );
  }

  const payload: Record<string, unknown> = {
    ...req.body,
    image: req.file?.path,
  };

  if (!req.file?.path) {
    delete payload.image;
  }

  // the author can never be reassigned
  delete payload.user;

  // never wipe content/category with empty values
  if (!payload.content) {
    delete payload.content;
  } else if (typeof payload.content === 'string') {
    payload.content = sanitizePostContent(payload.content);
  }
  if (!payload.category) {
    delete payload.category;
  }

  // only premium members (or admins) can mark a post premium
  if (payload.premium && !(req.user.premium || isAdmin)) {
    delete payload.premium;
  }

  const result = await PostServices.updatePostIntoDB(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post updated successfully',
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  const post = await PostServices.getPostById(id);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
  }

  if (String(post.user) !== req.user.id && !isAdminRole(req.user.role)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only delete your own posts!',
    );
  }

  const result = await PostServices.deletePostFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post deleted successfully',
    data: result,
  });
});

export const PostController = {
  createPost,
  getAllPosts,
  getAllUserPosts,
  getSinglePost,
  updatePost,
  deletePost,
};

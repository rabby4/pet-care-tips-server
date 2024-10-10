import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';

// create post information
const createPost = catchAsync(async (req, res) => {
  // console.log(req.body.data);
  // console.log(req.file);
  const data = {
    ...JSON.parse(req.body.data),
    image: req.file?.path,
  };
  console.log(data);
  const result = await PostServices.createPostIntoDB(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post created successfully',
    data: result,
  });
});

// get all posts from database
const getAllPosts = catchAsync(async (req, res) => {
  const { search, ...query } = req.query;
  const result = await PostServices.getAllPostsFromDB(query, search as string);

  if (!result.length) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No Data Found',
      data: result,
    });
  }
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Posts retrieved successfully',
    data: result,
  });
});

// get all posts from database
const getAllUserPosts = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await PostServices.getAllUserPostsFromDB(userId, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Posts retrieved successfully',
    data: result,
  });
});

const getSinglePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostServices.getSinglePostsFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post retrieved successfully',
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostServices.updatePostIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post updated successfully',
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;
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

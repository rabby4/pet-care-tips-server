import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostServices } from './post.service';

// create post information
const createPost = catchAsync(async (req, res) => {
  const result = await PostServices.createPostIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post deleted successfully',
    data: result,
  });
});

export const PostController = {
  createPost,
};

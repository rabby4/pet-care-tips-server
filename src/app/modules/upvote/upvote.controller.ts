import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UpvoteServices } from './upvote.service';

const createUpvote = catchAsync(async (req, res) => {
  const result = await UpvoteServices.createUpvoteIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Upvote successfully',
    data: result,
  });
});

const getAllUpvoteForPost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const result = await UpvoteServices.getAllUpvoteForPostFromDB(postId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Upvote retrieved successfully',
    data: result,
  });
});

export const UpvoteController = {
  createUpvote,
  getAllUpvoteForPost,
};

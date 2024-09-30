import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DownvoteServices } from './downvote.service';

const createDownvote = catchAsync(async (req, res) => {
  const result = await DownvoteServices.createDownvoteIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Downvote successfully',
    data: result,
  });
});

const getAllDownvoteForPost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const result = await DownvoteServices.getAllDownvoteForPostFromDB(postId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Downvote retrieved successfully',
    data: result,
  });
});

export const DownvoteController = {
  createDownvote,
  getAllDownvoteForPost,
};

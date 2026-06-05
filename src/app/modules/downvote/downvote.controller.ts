import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DownvoteServices } from './downvote.service';
import AppError from '../../errors/appError';
import { TDownvote } from './downvote.interface';

const createDownvote = catchAsync(async (req, res) => {
  if (!req.body.post) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post id is required!');
  }

  // the voter always comes from the verified token
  const result = await DownvoteServices.createDownvoteIntoDB({
    user: req.user.id,
    post: req.body.post,
  } as unknown as TDownvote);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
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

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UpvoteServices } from './upvote.service';
import AppError from '../../errors/appError';
import { TUpvote } from './upvote.interface';

const createUpvote = catchAsync(async (req, res) => {
  if (!req.body.post) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Post id is required!');
  }

  // the voter always comes from the verified token
  const result = await UpvoteServices.createUpvoteIntoDB({
    user: req.user.id,
    post: req.body.post,
  } as unknown as TUpvote);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
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

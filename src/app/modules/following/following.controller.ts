import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FollowingServices } from './following.service';

const createFollowing = catchAsync(async (req, res) => {
  const result = await FollowingServices.createFollowingIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Following successfully',
    data: result,
  });
});

const getAllFollowingForPost = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await FollowingServices.getAllFollowingForUserFromDB(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Following retrieved successfully',
    data: result,
  });
});

export const FollowingController = {
  createFollowing,
  getAllFollowingForPost,
};

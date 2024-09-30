import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FollowerServices } from './follower.service';

const createFollower = catchAsync(async (req, res) => {
  const result = await FollowerServices.createFollowerIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Follower successfully',
    data: result,
  });
});

const getAllFollowerForUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await FollowerServices.getAllFollowerForUserFromDB(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Follower retrieved successfully',
    data: result,
  });
});

export const FollowerController = {
  createFollower,
  getAllFollowerForUser,
};

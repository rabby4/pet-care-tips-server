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

const unFollowUser = catchAsync(async (req, res) => {
  const followerId = req.params.followerId;
  const result = await FollowingServices.unFollowUserFromDB(
    followerId,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Following successfully unfollowed',
    data: result,
  });
});

const getFollowingStatusFromDB = catchAsync(async (req, res) => {
  const followerId = String(req.query.followerId);
  const followingId = String(req.query.followingId);

  const isFollowing = await FollowingServices.getFollowingStatusFromDB(
    followerId,
    followingId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Following status retrieved successfully',
    data: { isFollowing },
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

const getAllFollowerForPost = catchAsync(async (req, res) => {
  const { followerId } = req.params;
  const result =
    await FollowingServices.getAllFollowerForUserFromDB(followerId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Following retrieved successfully',
    data: result,
  });
});

export const FollowingController = {
  createFollowing,
  unFollowUser,
  getFollowingStatusFromDB,
  getAllFollowingForPost,
  getAllFollowerForPost,
};

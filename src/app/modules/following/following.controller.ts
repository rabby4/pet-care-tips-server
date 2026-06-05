import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FollowingServices } from './following.service';
import AppError from '../../errors/appError';
import { TFollowing } from './following.interface';

const createFollowing = catchAsync(async (req, res) => {
  if (!req.body.following) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Following user id is required!');
  }

  // the follower always comes from the verified token
  if (String(req.body.following) === req.user.id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow yourself!');
  }

  const result = await FollowingServices.createFollowingIntoDB({
    follower: req.user.id,
    following: req.body.following,
  } as unknown as TFollowing);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Following successfully',
    data: result,
  });
});

const unFollowUser = catchAsync(async (req, res) => {
  // unfollow on behalf of the logged-in user only; the target comes from
  // the body, falling back to the route param
  const following = req.body?.following ?? req.params.followerId;

  const result = await FollowingServices.unFollowUserFromDB(
    req.user.id as string,
    { following } as unknown as TFollowing,
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

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import config from '../../config';
import AppError from '../../errors/appError';
import { extractToken, isAdminRole } from '../../middleware/auth';

const register = catchAsync(async (req, res) => {
  const result = await UserServices.register({
    ...req.body,
    image: req.file?.path,
  });
  const { refreshToken, accessToken } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User registered successfully',
    data: { accessToken },
  });
});

const getAllUserFromDB = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB(req.user);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Retrieved All User successfully',
    data: result,
  });
});

// retrieved the logged-in user (req.user is set by the auth middleware)
const getUser = catchAsync(async (req, res) => {
  const result = await UserServices.getUserFromDB(req.user.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.loginUser(req.body);

  const { refreshToken, accessToken } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: { accessToken },
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email;
  const result = await UserServices.forgetPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link is generated successfully!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  const result = await UserServices.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully!',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const isAdmin = isAdminRole(req.user.role);

  // users may only edit their own profile
  if (req.user.id !== id && !isAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only update your own profile!',
    );
  }

  const payload: Record<string, unknown> = {
    ...req.body,
    image: req.file?.path,
  };

  if (!req.file?.path) {
    delete payload.image;
  }

  // privileged fields cannot be changed through profile updates
  delete payload.password;
  if (!isAdmin) {
    delete payload.role;
    delete payload.premium;
    delete payload.email;
  }

  const result = await UserServices.updateUserIntoDB(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User info updated successfully',
    data: result,
  });
});

// delete user from database
const deleteUser = catchAsync(async (req, res) => {
  const isAdmin = isAdminRole(req.user.role);

  if (req.user.id !== req.params.id && !isAdmin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only delete your own account!',
    );
  }

  const result = await UserServices.deleteUserFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User deleted successfully',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await UserServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access Token is retrieved successfully',
    data: result,
  });
});

export const UserController = {
  register,
  refreshToken,
  getAllUserFromDB,
  getUser,
  loginUser,
  forgetPassword,
  resetPassword,
  updateUser,
  deleteUser,
};

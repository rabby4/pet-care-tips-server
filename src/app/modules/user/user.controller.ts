import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const register = catchAsync(async (req, res) => {
  const result = await UserServices.register({
    ...JSON.parse(req.body.data),
    image: req.file?.path,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User registered successfully',
    data: result,
    token: result,
  });
});

const getAllUserFromDB = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Retrieved All User successfully',
    data: result,
  });
});

// retrieved the users
const getUser = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;
  const result = await UserServices.getUserFromDB(token);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.loginUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    token: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const email = req.body.email;
  console.log(req.body);
  const result = await UserServices.forgetPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link is generated successfully!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization as string;
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
  const result = await UserServices.updateUserIntoDB(id, {
    ...JSON.parse(req.body.data),
    image: req.file?.path,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User info updated successfully',
    data: result,
  });
});

// Update user information
const deleteUser = catchAsync(async (req, res) => {
  const result = await UserServices.deleteUserFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User deleted successfully',
    data: result,
  });
});

export const UserController = {
  register,
  getAllUserFromDB,
  getUser,
  loginUser,
  forgetPassword,
  resetPassword,
  updateUser,
  deleteUser,
};

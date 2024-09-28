import httpStatus from 'http-status';
import { TLoginUser, TUser } from './user.interface';
import AppError from '../../errors/appError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { User } from './user.model';
import { sendEmail } from '../../utils/sendEmail';

// create service function for create or register user
const createUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

// create service function for login user
const loginUser = async (payload: TLoginUser) => {
  console.log(payload.email, payload.password);
  // check if the user exists
  const isUserExists = await User.findOne(
    { email: payload.email },
    { createdAt: 0, updatedAt: 0, __v: 0 },
  );
  console.log('exist user', isUserExists);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not exist');
  }

  // checking if the password matched
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    isUserExists.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!');
  }
  // create access token
  const userData = {
    id: isUserExists._id,
    email: isUserExists.email,
    role: isUserExists.role,
  };

  const accessToken = jwt.sign(userData, config.jwt_access_token as string, {
    expiresIn: '10d',
  });
  return {
    accessToken,
    isUserExists,
  };
};

const forgetPassword = async (email: string) => {
  // checking if the user is exists
  const user = await User.findOne({ email });
  console.log(user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'The user not found!');
  }

  // create access token and send to client
  const userData = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const resetToken = jwt.sign(userData, config.jwt_access_token as string, {
    expiresIn: '10m',
  });

  const resetUILink = `${config.reset_password_ui_link}?id=${user._id}&token=${resetToken}`;

  sendEmail(user.email, resetUILink);

  console.log(resetUILink);
};

export const UserServices = {
  createUserIntoDB,
  loginUser,
  forgetPassword,
};

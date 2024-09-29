import httpStatus from 'http-status';
import { TLoginUser, TUser } from './user.interface';
import AppError from '../../errors/appError';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { User } from './user.model';
import { sendEmail } from '../../utils/sendEmail';

// create service function for create or register user
const createUserIntoDB = async (payload: TUser) => {
  const userData: Partial<TUser> = {
    ...payload,
    role: 'user',
  };
  const result = await User.create(userData);
  return result;
};

const getAllUserFromDB = async () => {
  const result = await User.find();
  return result;
};

const getUserFromDB = async (token: string) => {
  // check if the token is valid or not
  const decoded = jwt.verify(
    token,
    config.jwt_access_token as string,
  ) as JwtPayload;

  const result = await User.findOne({ _id: decoded.id });
  return result;
};

// create service function for login user
const loginUser = async (payload: TLoginUser) => {
  console.log(payload.email, payload.password);
  // check if the user exists
  const isUserExists = await User.isUserExists(
    payload.email,
    // { email: payload.email },
    // { createdAt: 0, updatedAt: 0, __v: 0 },
  );

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
    id: isUserExists.id,
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
};

const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  // checking if the user is exists
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'The user not found!');
  }

  // check if the token is valid or not
  const decoded = jwt.verify(
    token,
    config.jwt_access_token as string,
  ) as JwtPayload;

  if (payload.email !== decoded.email) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      email: decoded.email,
    },
    {
      password: newHashedPassword,
    },
  );
};

const updateUserIntoDB = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndDelete({ _id: id });
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUserFromDB,
  getUserFromDB,
  loginUser,
  forgetPassword,
  resetPassword,
  updateUserIntoDB,
  deleteUserFromDB,
};

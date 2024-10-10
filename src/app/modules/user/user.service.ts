import httpStatus from 'http-status';
import { TLoginUser, TUser } from './user.interface';
import AppError from '../../errors/appError';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { User } from './user.model';
import { sendEmail } from '../../utils/sendEmail';

// create service function for create or register user
const register = async (payload: TUser) => {
  // payload.image = image;
  // checking if the user is exist
  const user = await User.isUserExists(payload?.email);

  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is already exist!');
  }

  const newUser = await User.create(payload);

  // create access token
  const userData = {
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    phone: newUser.phone,
    address: newUser.address,
    occupation: newUser.occupation,
    about: newUser.about,
    image: newUser.image,
    role: newUser.role,
    premium: newUser.premium,
  };

  const accessToken = jwt.sign(userData, config.jwt_access_token as string, {
    expiresIn: '30d',
  });
  const refreshToken = jwt.sign(userData, config.jwt_refresh_token as string, {
    expiresIn: '365d',
  });

  return { accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
  // check if the token is valid or not
  const decoded = jwt.verify(token, config.jwt_refresh_token as string);

  const { _id } = decoded as JwtPayload;

  // checking if the user is exists
  const user = await User.isUserExists(_id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'The user not found!');
  }

  // create access token
  const userData = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    occupation: user.occupation,
    about: user.about,
    image: user.image,
    role: user.role,
    premium: user.premium,
  };

  const accessToken = jwt.sign(userData, config.jwt_access_token as string, {
    expiresIn: '30d',
  });

  return { accessToken };
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
  // check if the user exists
  const user = await User.isUserExists(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not exist');
  }

  // checking if the password matched
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!');
  }
  // create access token
  const userData = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    occupation: user.occupation,
    about: user.about,
    image: user.image,
    role: user.role,
    premium: user.premium,
  };

  const accessToken = jwt.sign(userData, config.jwt_access_token as string, {
    expiresIn: '10d',
  });
  const refreshToken = jwt.sign(userData, config.jwt_refresh_token as string, {
    expiresIn: '365d',
  });
  return { accessToken, refreshToken };
};

const forgetPassword = async (email: string) => {
  // checking if the user is exists
  const user = await User.findOne({ email });

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

  const resetUILink = `${config.reset_password_ui_link}/reset-password?email=${user.email}&token=${resetToken}`;

  await sendEmail(user.email, resetUILink);
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
  register,
  refreshToken,
  getAllUserFromDB,
  getUserFromDB,
  loginUser,
  forgetPassword,
  resetPassword,
  updateUserIntoDB,
  deleteUserFromDB,
};

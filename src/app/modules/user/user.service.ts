import httpStatus from 'http-status';
import { TLoginUser, TUser } from './user.interface';
import AppError from '../../errors/appError';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { User } from './user.model';
import { sendEmail } from '../../utils/sendEmail';
import { isAdminRole } from '../../middleware/auth';

const ACCESS_TOKEN_EXPIRES = '7d';
const REFRESH_TOKEN_EXPIRES = '30d';

// the data embedded in access/refresh tokens
const buildTokenPayload = (user: {
  id: unknown;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  occupation?: string;
  about?: string;
  image?: string;
  role: string;
  premium: boolean;
}) => ({
  id: String(user.id),
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
});

// create service function for create or register user
const register = async (payload: TUser) => {
  // checking if the user is exist
  const user = await User.isUserExists(payload?.email);

  if (user) {
    throw new AppError(httpStatus.CONFLICT, 'This user is already exist!');
  }

  // new accounts always start as ordinary users
  payload.role = 'user';
  payload.premium = false;

  const newUser = await User.create(payload);

  const userData = buildTokenPayload(newUser);

  const accessToken = jwt.sign(userData, config.jwt_access_token as string, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
  const refreshToken = jwt.sign(userData, config.jwt_refresh_token as string, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });

  return { accessToken, refreshToken };
};

const refreshToken = async (token: string) => {
  // check if the token is valid or not
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_token as string,
  ) as JwtPayload;

  // tokens are signed with the user id under the `id` key
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'The user not found!');
  }

  const userData = buildTokenPayload(user);

  const accessToken = jwt.sign(userData, config.jwt_access_token as string, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });

  return { accessToken };
};

const getAllUserFromDB = async (requester?: JwtPayload) => {
  // admins see everything; everyone else gets a short list of safe public fields
  if (requester && isAdminRole(requester.role)) {
    return await User.find();
  }

  return await User.find()
    .select('firstName lastName image premium occupation createdAt')
    .limit(20);
};

const getUserFromDB = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

// create service function for login user
const loginUser = async (payload: TLoginUser) => {
  // check if the user exists
  const user = await User.isUserExists(payload.email);

  if (!user) {
    // generic message so attackers can't probe which emails exist
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password!');
  }

  // checking if the password matched
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password!');
  }

  const userData = buildTokenPayload(user);

  const accessToken = jwt.sign(userData, config.jwt_access_token as string, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
  const refreshToken = jwt.sign(userData, config.jwt_refresh_token as string, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });
  return { accessToken, refreshToken };
};

const forgetPassword = async (email: string) => {
  // checking if the user is exists
  const user = await User.findOne({ email });

  // respond the same way whether or not the account exists
  if (!user) {
    return;
  }

  // short-lived token marked as a reset token so access tokens can't be reused here
  const userData = {
    id: user._id,
    email: user.email,
    role: user.role,
    type: 'reset',
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

  // only tokens created by forget-password may reset a password
  if (decoded.type !== 'reset') {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

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

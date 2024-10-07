import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  occupation: string;
  about: string;
  image: string;
  role: 'superAdmin' | 'admin' | 'user';
  premium: boolean;
  dateOfBirth: string;
}
export type TLoginUser = {
  email: string;
  password: string;
};

export interface UserModel extends Model<TUser> {
  // myStaticMethod(): number;
  // isUserExists(email: string): Promise<TUser>;
  isUserExists(email: string): Promise<TUser | null>;
  // isPasswordMatched(
  //   plainTextPassword: string,
  //   hashedPassword: string,
  // ): Promise<boolean>;
  // isJWTIssuedBeforePasswordChange(
  //   passwordChangedTimestamp: Date,
  //   jwtIssuedTimestamp: number,
  // ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;

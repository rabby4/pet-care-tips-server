import { TUser } from './user.interface';
import { User } from './user.model';

// create service function for create or register user
const createUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const UserService = {
  createUserIntoDB,
  changeStatus,
};

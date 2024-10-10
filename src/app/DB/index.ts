import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';

const superUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'firstadmin@gmail.com',
  password: config.admin_password,
  role: USER_ROLE.admin,
};
const seedAdmin = async () => {
  // when database is connect, we will check is there any user who is super admin
  const isSuperAdmin = await User.findOne({ role: USER_ROLE.admin });

  if (!isSuperAdmin) {
    await User.create(superUser);
  }
};

export default seedAdmin;

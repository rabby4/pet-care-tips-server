import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';
import { Payment } from '../modules/payment/payment.model';
import { Upvote } from '../modules/upvote/upvote.model';
import { Downvote } from '../modules/downvote/downvote.model';
import { Following } from '../modules/following/following.model';

const superUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'firstadmin@gmail.com',
  password: config.admin_password,
  role: USER_ROLE.admin,
};

const seedAdmin = async () => {
  // check by email so an existing admin is never duplicated
  const adminExists = await User.findOne({ email: superUser.email });

  if (!adminExists) {
    await User.create(superUser);
  }
};

// keep MongoDB indexes in line with the schemas:
// - adds the unique vote/follow indexes
// - drops the old unique index on Payment.email so users can pay again
export const syncIndexes = async () => {
  try {
    await Promise.all([
      Payment.syncIndexes(),
      Upvote.syncIndexes(),
      Downvote.syncIndexes(),
      Following.syncIndexes(),
    ]);
  } catch (error) {
    // duplicate legacy data can make a unique index build fail; log and continue
    console.error('Index sync failed:', error);
  }
};

export default seedAdmin;

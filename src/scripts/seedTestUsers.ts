/* eslint-disable no-console */
// One-off helper to create a known test account for each role.
// Run with: npx ts-node src/scripts/seedTestUsers.ts
import mongoose from 'mongoose';
import config from '../app/config';
import { User } from '../app/modules/user/user.model';

const PASSWORD = 'Pet@12345';

const testUsers = [
  {
    firstName: 'Test',
    lastName: 'User',
    email: 'user@petcare.com',
    role: 'user',
    premium: false,
  },
  {
    firstName: 'Test',
    lastName: 'Premium',
    email: 'premium@petcare.com',
    role: 'user',
    premium: true,
  },
  {
    firstName: 'Test',
    lastName: 'Admin',
    email: 'admin@petcare.com',
    role: 'admin',
    premium: true,
  },
  {
    firstName: 'Test',
    lastName: 'SuperAdmin',
    email: 'superadmin@petcare.com',
    role: 'superAdmin',
    premium: true,
  },
];

async function main() {
  await mongoose.connect(config.database_uri as string);
  console.log('Connected.');

  for (const u of testUsers) {
    // remove any previous copy so the password is reset to a known value
    await User.deleteOne({ email: u.email });
    // User.create runs the pre-save hook which hashes the password
    await User.create({ ...u, password: PASSWORD });
    console.log(`created ${u.role.padEnd(11)} -> ${u.email}`);
  }

  await mongoose.disconnect();
  console.log('Done. Password for all of the above:', PASSWORD);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

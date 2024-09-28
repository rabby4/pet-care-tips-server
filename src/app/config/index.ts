import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  path: process.env.PORT,
  database_uri: process.env.DATABASE_URI,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  jwt_access_token: process.env.JWT_ACCESS_TOKEN,
};

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  path: process.env.PORT,
  database_uri: process.env.DATABASE_URI,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  jwt_access_token: process.env.JWT_ACCESS_TOKEN,
  jwt_refresh_token: process.env.JWT_REFRESH_TOKEN,
  reset_password_ui_link: process.env.RESET_PASS_UI_LINK,
  smtp_auth_user: process.env.SMTP_AUTH_USER,
  smtp_auth_pass: process.env.SMTP_AUTH_PASS,
  admin_password: process.env.ADMIN_PASSWORD,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  payment_url: process.env.PAYMENT_URL,
  store_id: process.env.STORE_ID,
  signature_key: process.env.SIGNATURE_KEY,
  payment_verify_url: process.env.PAYMENT_VERIFY_URL,
  client_url: process.env.CLIENT_URL,
};

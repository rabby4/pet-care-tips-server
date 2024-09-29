import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser, UserModel>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    occupation: {
      type: String,
    },
    about: {
      type: String,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'user'],
    },
    followers: {
      type: Schema.Types.ObjectId,
    },
    following: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
);

// virtual
userSchema.virtual('fullName').get(function () {
  return `${this?.firstName} ${this?.lastName}`;
});

// pre save middleware/hook: will work on create(), save()
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  // hashing password and save into database
  user.password = await bcrypt.hash(
    user.password as string,
    Number(config.bcrypt_salt_round),
  );
  next();
});

// set "" after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});
userSchema.statics.isUserExists = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};
//
// userSchema.statics.isPasswordMatched = async function (
//   plainTextPassword,
//   hashedPassword,
// ) {
//   return await bcrypt.compare(plainTextPassword, hashedPassword);
// };

export const User = model<TUser, UserModel>('users', userSchema);

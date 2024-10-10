import { Types } from 'mongoose';

export type TPost = {
  user: Types.ObjectId;
  content: string;
  image?: string;
  category?: string;
  premium?: boolean;
  publish?: boolean;
};

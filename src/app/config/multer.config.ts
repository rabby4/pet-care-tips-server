import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from './cloudinary.config';
import AppError from '../errors/appError';
import httpStatus from 'http-status';

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
});

export const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    // only accept real image uploads
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(
        new AppError(httpStatus.BAD_REQUEST, 'Only image files are allowed!'),
      );
    }
  },
});

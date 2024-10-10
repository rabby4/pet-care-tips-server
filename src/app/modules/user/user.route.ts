import express from 'express';
import { UserValidation } from './user.validation';
import validationRequest from '../../middleware/validationRequest';
import { UserController } from './user.controller';
import { multerUpload } from '../../config/multer.config';
const router = express.Router();

// sign up user route
router.post(
  '/signup',
  multerUpload.single('image'),
  // validationRequest(UserValidation.createUserValidationSchema),
  UserController.register,
);

// sign up user route
router.post(
  '/login',
  validationRequest(UserValidation.loginValidationSchema),
  UserController.loginUser,
);

// get all user data
router.get('/', UserController.getAllUserFromDB);

// get all user data
router.get('/me', UserController.getUser);

router.post(
  '/forget-password',
  validationRequest(UserValidation.forgetPasswordValidationSchema),
  UserController.forgetPassword,
);

router.post(
  '/reset-password',
  // validationRequest(UserValidation.resetPasswordValidationSchema),
  UserController.resetPassword,
);

router.patch(
  '/:id',
  multerUpload.single('image'),
  // validationRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUser,
);

// delete user from database
router.delete('/:id', UserController.deleteUser);

router.post('/refresh-token', UserController.refreshToken);

export const UserRoutes = router;

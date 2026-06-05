import express from 'express';
import { UserValidation } from './user.validation';
import validationRequest from '../../middleware/validationRequest';
import { UserController } from './user.controller';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middleware/bodyParser';
import auth, { optionalAuth } from '../../middleware/auth';
const router = express.Router();

// sign up user route
router.post(
  '/signup',
  multerUpload.single('image'),
  parseBody,
  validationRequest(UserValidation.createUserValidationSchema),
  UserController.register,
);

// login user route
router.post(
  '/login',
  validationRequest(UserValidation.loginValidationSchema),
  UserController.loginUser,
);

// get all user data (public list is limited to safe fields; admins get full data)
router.get('/', optionalAuth, UserController.getAllUserFromDB);

// get the logged-in user's own profile
router.get('/me', auth(), UserController.getUser);

router.post(
  '/forget-password',
  validationRequest(UserValidation.forgetPasswordValidationSchema),
  UserController.forgetPassword,
);

router.post(
  '/reset-password',
  validationRequest(UserValidation.resetPasswordValidationSchema),
  UserController.resetPassword,
);

// update own profile (admins can update anyone)
router.patch(
  '/:id',
  auth(),
  multerUpload.single('image'),
  parseBody,
  validationRequest(UserValidation.updateUserValidationSchema),
  UserController.updateUser,
);

// delete own account (admins can delete anyone)
router.delete('/:id', auth(), UserController.deleteUser);

router.post('/refresh-token', UserController.refreshToken);

export const UserRoutes = router;

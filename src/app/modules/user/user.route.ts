import express from 'express';
import { UserValidation } from './user.validation';
import validationRequest from '../../middleware/validationRequest';
import { UserController } from './user.controller';
const router = express.Router();

// sign up user route
router.post(
  '/signup',
  validationRequest(UserValidation.createUserValidationSchema),
  UserController.createUser,
);

// sign up user route
router.post(
  '/login',
  validationRequest(UserValidation.loginValidationSchema),
  UserController.loginUser,
);

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

export const UserRoutes = router;

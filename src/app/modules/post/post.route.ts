import express from 'express';
import validateRequest from '../../middleware/validationRequest';
import { PostController } from './post.controller';
import { BikeValidation } from './post.validation';
const router = express.Router();

router.post(
  '/',
  validateRequest(BikeValidation.createPostValidationSchema),
  PostController.createPost,
);

export const PostRoutes = router;

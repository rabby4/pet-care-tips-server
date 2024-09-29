import express from 'express';
import validateRequest from '../../middleware/validationRequest';
import { PostController } from './post.controller';
import { postValidation } from './post.validation';
const router = express.Router();

router.post(
  '/',
  validateRequest(postValidation.createPostValidationSchema),
  PostController.createPost,
);
router.get('/', PostController.getAllPosts);

export const PostRoutes = router;

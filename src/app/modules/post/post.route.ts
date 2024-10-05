import express from 'express';
import { PostController } from './post.controller';
import { postValidation } from './post.validation';
import validationRequest from '../../middleware/validationRequest';
const router = express.Router();

router.post(
  '/',
  validationRequest(postValidation.createPostValidationSchema),
  PostController.createPost,
);
router.get('/', PostController.getAllPosts);
router.get('/:userId', PostController.getAllUserPosts);
router.get('/:id', PostController.getSinglePost);
router.patch(
  '/:id',
  validationRequest(postValidation.updatePostValidationSchema),
  PostController.updatePost,
);

export const PostRoutes = router;

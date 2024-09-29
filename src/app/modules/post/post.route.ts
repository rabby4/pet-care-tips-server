import express from 'express';
import { PostController } from './post.controller';
import { postValidation } from './post.validation';
import validationRequest from '../../middleware/validationRequest';
import { CommentController } from '../comments/comment.controller';
const router = express.Router();

router.post(
  '/',
  validationRequest(postValidation.createPostValidationSchema),
  PostController.createPost,
);
router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getSinglePost);
// router.get('/:postId/comments', CommentController.getAllCommentsForPost);
router.patch(
  '/:id',
  validationRequest(postValidation.updatePostValidationSchema),
  PostController.updatePost,
);

export const PostRoutes = router;

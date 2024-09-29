import express from 'express';
import validationRequest from '../../middleware/validationRequest';
import { commentValidation } from './comment.validation';
import { CommentController } from './comment.controller';
const router = express.Router();

router.post(
  '/',
  validationRequest(commentValidation.createCommentValidationSchema),
  CommentController.createComment,
);

// get route for comment based on post id
router.get('/:postId', CommentController.getAllCommentsForPost);

router.patch(
  '/:id',
  validationRequest(commentValidation.updateCommentValidationSchema),
  CommentController.updateComment,
);

router.delete('/:id', CommentController.deleteComment);

export const CommentRoutes = router;

import express from 'express';
import validationRequest from '../../middleware/validationRequest';
import { commentValidation } from './comment.validation';
import { CommentController } from './comment.controller';
import auth from '../../middleware/auth';
const router = express.Router();

// only logged-in users can comment
router.post(
  '/',
  auth(),
  validationRequest(commentValidation.createCommentValidationSchema),
  CommentController.createComment,
);

// get route for comment based on post id (public)
router.get('/:postId', CommentController.getAllCommentsForPost);

// only the comment owner (or an admin) can edit/delete
router.patch(
  '/:id',
  auth(),
  validationRequest(commentValidation.updateCommentValidationSchema),
  CommentController.updateComment,
);

router.delete('/:id', auth(), CommentController.deleteComment);

export const CommentRoutes = router;

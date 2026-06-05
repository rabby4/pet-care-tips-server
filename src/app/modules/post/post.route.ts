import express from 'express';
import { PostController } from './post.controller';
import { postValidation } from './post.validation';
import validationRequest from '../../middleware/validationRequest';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middleware/bodyParser';
import auth, { optionalAuth } from '../../middleware/auth';
const router = express.Router();

// only logged-in users can create posts
router.post(
  '/',
  auth(),
  multerUpload.single('image'),
  parseBody,
  validationRequest(postValidation.createPostValidationSchema),
  PostController.createPost,
);

// reading posts is public; optionalAuth identifies the viewer for premium gating
router.get('/', optionalAuth, PostController.getAllPosts);
router.get('/:userId', optionalAuth, PostController.getAllUserPosts);
router.get('/post/:id', optionalAuth, PostController.getSinglePost);

// only the author (or an admin) can update/delete a post
router.patch(
  '/:id',
  auth(),
  multerUpload.single('image'),
  parseBody,
  validationRequest(postValidation.updatePostValidationSchema),
  PostController.updatePost,
);
router.delete('/:id', auth(), PostController.deletePost);

export const PostRoutes = router;

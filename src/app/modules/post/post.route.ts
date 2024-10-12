import express from 'express';
import { PostController } from './post.controller';
import { postValidation } from './post.validation';
import validationRequest from '../../middleware/validationRequest';
import { multerUpload } from '../../config/multer.config';
const router = express.Router();

router.post(
  '/',
  multerUpload.single('image'),
  // validationRequest(postValidation.createPostValidationSchema),
  PostController.createPost,
);
router.get('/', PostController.getAllPosts);
router.get('/:userId', PostController.getAllUserPosts);
router.get('/post/:id', PostController.getSinglePost);
router.patch(
  '/:id',
  multerUpload.single('image'),
  // validationRequest(postValidation.updatePostValidationSchema),
  PostController.updatePost,
);
router.delete('/:id', PostController.deletePost);

export const PostRoutes = router;

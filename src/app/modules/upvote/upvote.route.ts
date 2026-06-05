import express from 'express';
import { UpvoteController } from './upvote.controller';
import auth from '../../middleware/auth';
const router = express.Router();

// voting requires login
router.post('/', auth(), UpvoteController.createUpvote);

// get route for upvotes based on post id (public)
router.get('/:postId', UpvoteController.getAllUpvoteForPost);

export const UpvoteRoutes = router;

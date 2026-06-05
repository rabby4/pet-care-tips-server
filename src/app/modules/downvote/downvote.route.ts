import express from 'express';
import { DownvoteController } from './downvote.controller';
import auth from '../../middleware/auth';
const router = express.Router();

// voting requires login
router.post('/', auth(), DownvoteController.createDownvote);

// get route for downvotes based on post id (public)
router.get('/:postId', DownvoteController.getAllDownvoteForPost);

export const DownvoteRoutes = router;

import express from 'express';
import { DownvoteController } from './downvote.controller';
const router = express.Router();

router.post('/', DownvoteController.createDownvote);

// get route for comment based on post id
router.get('/:postId', DownvoteController.getAllDownvoteForPost);

export const DownvoteRoutes = router;

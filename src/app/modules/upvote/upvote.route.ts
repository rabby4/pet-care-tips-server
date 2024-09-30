import express from 'express';
import { UpvoteController } from './upvote.controller';
const router = express.Router();

router.post('/', UpvoteController.createUpvote);

// get route for comment based on post id
router.get('/:postId', UpvoteController.getAllUpvoteForPost);

export const UpvoteRoutes = router;

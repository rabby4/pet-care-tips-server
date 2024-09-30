import express from 'express';
import { FollowingController } from './following.controller';
const router = express.Router();

router.post('/', FollowingController.createFollowing);

// get route for comment based on post id
router.get('/:userId', FollowingController.getAllFollowingForPost);

export const FollowingRoutes = router;

import express from 'express';
import { FollowingController } from './following.controller';
const router = express.Router();

router.post('/', FollowingController.createFollowing);

// get route for user based on post id
router.get('/:userId', FollowingController.getAllFollowingForPost);
router.get('/follower/:userId', FollowingController.getAllFollowerForPost);

export const FollowingRoutes = router;

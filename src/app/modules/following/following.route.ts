import express from 'express';
import { FollowingController } from './following.controller';
const router = express.Router();

router.get('/status', FollowingController.getFollowingStatusFromDB);
router.post('/', FollowingController.createFollowing);
// get route for user based on post id
router.get('/:userId', FollowingController.getAllFollowingForPost);
router.get('/follower/:followerId', FollowingController.getAllFollowerForPost);
router.delete('/:followerId', FollowingController.unFollowUser);

export const FollowingRoutes = router;

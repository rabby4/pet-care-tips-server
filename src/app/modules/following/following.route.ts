import express from 'express';
import { FollowingController } from './following.controller';
import auth from '../../middleware/auth';
const router = express.Router();

router.get('/status', FollowingController.getFollowingStatusFromDB);

// following/unfollowing requires login
router.post('/', auth(), FollowingController.createFollowing);

// get route for user based on user id (public)
router.get('/:userId', FollowingController.getAllFollowingForPost);
router.get('/follower/:followerId', FollowingController.getAllFollowerForPost);

router.delete('/:followerId', auth(), FollowingController.unFollowUser);

export const FollowingRoutes = router;

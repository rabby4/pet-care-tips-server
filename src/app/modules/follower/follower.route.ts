import express from 'express';
import { FollowerController } from './follower.controller';

const router = express.Router();

router.post('/', FollowerController.createFollower);

// get route for user based on post id
router.get('/:userId', FollowerController.getAllFollowerForUser);

export const FollowerRoutes = router;

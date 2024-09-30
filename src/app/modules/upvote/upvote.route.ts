import express from 'express';
import { UpvoteController } from './upvote.controller';
const router = express.Router();

router.post('/', UpvoteController.createUpvote);

export const UpvoteRoutes = router;

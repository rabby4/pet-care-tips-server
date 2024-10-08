import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { PostRoutes } from '../modules/post/post.route';
import { CommentRoutes } from '../modules/comments/comment.route';
import { UpvoteRoutes } from '../modules/upvote/upvote.route';
import { DownvoteRoutes } from '../modules/downvote/downvote.route';
import { FollowingRoutes } from '../modules/following/following.route';
import { FollowerRoutes } from '../modules/follower/follower.route';
import { PaymentRoutes } from '../modules/payment/payment.route';

const router = Router();

const allRoutes = [
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/posts',
    route: PostRoutes,
  },
  {
    path: '/comments',
    route: CommentRoutes,
  },
  {
    path: '/upvote',
    route: UpvoteRoutes,
  },
  {
    path: '/downvote',
    route: DownvoteRoutes,
  },
  {
    path: '/following',
    route: FollowingRoutes,
  },
  {
    path: '/follower',
    route: FollowerRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
];

allRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

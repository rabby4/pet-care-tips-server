import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { PostRoutes } from '../modules/post/post.route';
import { CommentRoutes } from '../modules/comments/comment.route';
import { UpvoteRoutes } from '../modules/upvote/upvote.route';

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
];

allRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

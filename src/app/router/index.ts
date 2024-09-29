import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { PostRoutes } from '../modules/post/post.route';

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
];

allRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

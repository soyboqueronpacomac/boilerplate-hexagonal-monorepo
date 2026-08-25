import { Router } from 'express';
import { ApiRouter } from './api/api.route.js';

export class AppRouter {
  static get routes(): Router {
    const router = Router();
    router.use('/api', ApiRouter.routes);
    return router;
  }
}

import { Router } from 'express';
import { checkSystemState } from '../../../application/use-cases/check-system-state.js';
import { systemStateProvider } from '../../system-state/system-state-provider-in-memory.js';

export class ApiRouter {
  static get routes(): Router {
    const router = Router();
    router.get('/state', async (_req, res) => {
      const response = await checkSystemState(systemStateProvider);
      res.json(response);
    });
    return router;
  }
}

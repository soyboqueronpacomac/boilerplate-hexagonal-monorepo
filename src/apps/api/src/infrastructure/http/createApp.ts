import express, { type Express } from 'express';
import { checkSystemState } from '../../application/use-cases/check-system-state.js';
import { SystemStateProviderInMemory } from '../system-state/system-state-provider-in-memory.js';

export const createApp = (): Express => {
  const app = express();
  app.use(express.json());

  const systemStateProvider = new SystemStateProviderInMemory();

  app.get('/api/state', async (_req, res) => {
    const response = await checkSystemState(systemStateProvider);
    res.json(response);
  });

  return app;
};

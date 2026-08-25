import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { AppRouter } from '../routes/app.route.js';
import { ServerExpress } from './createApp.js';

describe('GET /api/state', () => {
  it('responde con el estado del sistema en formato JSON', async () => {
    const server = new ServerExpress({ port: 0 }, AppRouter.routes);

    const response = await request(server.app).get('/api/state');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ state: 'ready' });
  });
});

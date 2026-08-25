import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './createApp.js';

describe('GET /api/state', () => {
  it('responde con el estado del sistema en formato JSON', async () => {
    const app = createApp();

    const response = await request(app).get('/api/state');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ state: 'ready' });
  });
});

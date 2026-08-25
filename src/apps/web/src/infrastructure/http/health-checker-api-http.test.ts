import { afterEach, describe, expect, it, vi } from 'vitest';
import { HealthCheckerApiHttp } from './health-checker-api-http';

describe('HealthCheckerApiHttp', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('devuelve el estado cuando la API responde correctamente', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ state: 'ready' }), { status: 200 }),
      ),
    );

    const checker = new HealthCheckerApiHttp();
    const response = await checker.checkStatus();

    expect(response).toEqual({ state: 'ready' });
  });

  it('lanza un error cuando la API responde con un fallo', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 500 })),
    );

    const checker = new HealthCheckerApiHttp();

    await expect(checker.checkStatus()).rejects.toThrow(
      'Failed to fetch API state',
    );
  });
});

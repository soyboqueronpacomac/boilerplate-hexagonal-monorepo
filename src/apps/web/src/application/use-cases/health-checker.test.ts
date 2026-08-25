import type { StateApiResponse } from '@boilerplate-hexagonal-monorepo/api-contracts';
import { describe, expect, it } from 'vitest';
import type { ApiStatusChecker } from '../ports/health-checker-api';
import { createHealthChecker } from './health-checker';

class FakeApiStatusChecker implements ApiStatusChecker {
  constructor(private readonly response: StateApiResponse) {}

  async checkStatus(): Promise<StateApiResponse> {
    return this.response;
  }
}

describe('createHealthChecker', () => {
  it('delega la consulta de estado en el comprobador inyectado', async () => {
    const checker = new FakeApiStatusChecker({ state: 'ready' });

    const response = await createHealthChecker(checker);

    expect(response).toEqual({ state: 'ready' });
  });
});

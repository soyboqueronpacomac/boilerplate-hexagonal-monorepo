import type { StateApiResponse } from '@boilerplate-hexagonal-monorepo/api-contracts';
import type { ApiStatusChecker } from '../../application/ports/health-checker-api';

export class HealthCheckerApiHttp implements ApiStatusChecker {
  async checkStatus(): Promise<StateApiResponse> {
    const response = await fetch('/api/state');
    if (!response.ok) {
      throw new Error('Failed to fetch API state');
    }
    return response.json() as Promise<StateApiResponse>;
  }
}

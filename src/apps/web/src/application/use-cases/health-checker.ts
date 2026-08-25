import type { StateApiResponse } from '@boilerplate-hexagonal-monorepo/api-contracts';
import type { ApiStatusChecker } from '../ports/health-checker-api';

export const createHealthChecker = (
  apiStatusChecker: ApiStatusChecker,
): Promise<StateApiResponse> => apiStatusChecker.checkStatus();

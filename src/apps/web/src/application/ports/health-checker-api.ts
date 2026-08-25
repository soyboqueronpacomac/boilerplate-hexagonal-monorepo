import type { StateApiResponse } from '@boilerplate-hexagonal-monorepo/api-contracts';

export interface ApiStatusChecker {
  checkStatus(): Promise<StateApiResponse>;
}

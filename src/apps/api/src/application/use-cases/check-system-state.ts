import type { StateApiResponse } from '@boilerplate-hexagonal-monorepo/api-contracts';
import type { SystemStateProvider } from '../ports/system-state-provider.js';

export const checkSystemState = async (
  systemStateProvider: SystemStateProvider,
): Promise<StateApiResponse> => {
  const systemState = await systemStateProvider.getState();
  return { state: systemState.status };
};

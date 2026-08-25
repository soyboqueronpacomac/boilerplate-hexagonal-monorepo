import type { SystemState } from '@boilerplate-hexagonal-monorepo/domain';
import type { SystemStateProvider } from '../../application/ports/system-state-provider.js';

export class SystemStateProviderInMemory implements SystemStateProvider {
  async getState(): Promise<SystemState> {
    return { status: 'ready' };
  }
}

export const systemStateProvider = new SystemStateProviderInMemory();

import type { SystemState } from '@boilerplate-hexagonal-monorepo/domain';
import { describe, expect, it } from 'vitest';
import type { SystemStateProvider } from '../ports/system-state-provider.js';
import { checkSystemState } from './check-system-state.js';

class FakeSystemStateProvider implements SystemStateProvider {
  constructor(private readonly state: SystemState) {}

  async getState(): Promise<SystemState> {
    return this.state;
  }
}

describe('checkSystemState', () => {
  it('traduce el estado del dominio al contrato de la API', async () => {
    const provider = new FakeSystemStateProvider({ status: 'ready' });

    const response = await checkSystemState(provider);

    expect(response).toEqual({ state: 'ready' });
  });
});

import { describe, expect, it } from 'vitest';
import { SystemStateProviderInMemory } from './system-state-provider-in-memory.js';

describe('SystemStateProviderInMemory', () => {
  it('siempre reporta el sistema como listo', async () => {
    const provider = new SystemStateProviderInMemory();

    const state = await provider.getState();

    expect(state).toEqual({ status: 'ready' });
  });
});

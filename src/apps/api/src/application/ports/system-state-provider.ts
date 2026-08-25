import type { SystemState } from '@boilerplate-hexagonal-monorepo/domain';

export interface SystemStateProvider {
  getState(): Promise<SystemState>;
}

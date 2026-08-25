import type { StateApiResponse } from '@boilerplate-hexagonal-monorepo/api-contracts';
import { describe, expect, it, vi } from 'vitest';
// biome-ignore lint/style/useImportType: registra el custom element <state-api> al importarse
import { StateApi } from './state-api';

describe('StateApi', () => {
  it('avisa cuando no se ha configurado la consulta de estado', () => {
    const component = document.createElement('state-api') as StateApi;

    document.body.append(component);

    expect(component.innerHTML).toContain(
      'No se ha Configurado la consulta de la API.',
    );
  });

  it('muestra el estado devuelto por loadingState', async () => {
    const component = document.createElement('state-api') as StateApi;
    component.loadingState = async (): Promise<StateApiResponse> => ({
      state: 'ready',
    });

    document.body.append(component);

    await vi.waitFor(() => {
      expect(component.innerHTML).toContain(
        'API está disponible. Estado: ready',
      );
    });
  });
});

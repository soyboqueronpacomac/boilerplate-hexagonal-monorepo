import type { StateApiResponse } from '@boilerplate-hexagonal-monorepo/api-contracts';
export class StateApi extends HTMLElement {
  loadingState?: () => Promise<StateApiResponse>;

  connectedCallback(): void {
    this.innerHTML = '<p>Comprobando la API...</p>';
    void this.showState();
  }

  private async showState(): Promise<void> {
    if (this.loadingState === undefined) {
      this.innerHTML = '<p>No se ha Configurado la consulta de la API.</p>';
      return;
    }

    try {
      const response = await this.loadingState();
      this.innerHTML = `<p>API está disponible. Estado: ${response.state}</p>`;
    } catch (error) {
      this.innerHTML = `<p>Error al consultar la API: ${error}</p>`;
    }
  }
}

customElements.define('state-api', StateApi);

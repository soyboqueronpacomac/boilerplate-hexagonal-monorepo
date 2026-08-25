import { createHealthChecker } from './application/use-cases/health-checker.js';
// biome-ignore lint/style/useImportType: registra el custom element <state-api> al importarse
import { StateApi } from './infrastructure/components/state-api.js';
import { HealthCheckerApiHttp } from './infrastructure/http/health-checker-api-http.js';
export const initApp = (): void => {
  const healthCheckerApi = new HealthCheckerApiHttp();
  const componentStateApi = document.createElement('state-api') as StateApi;
  componentStateApi.loadingState = () => createHealthChecker(healthCheckerApi);
  document.querySelector('#app')?.append(componentStateApi);
};

import 'dotenv/config';

import { envConfigProvider } from './infrastructure/config/env-config-provider.js';
import { ServerExpress } from './infrastructure/http/createApp.js';
import { AppRouter } from './infrastructure/routes/app.route.js';

main().catch((error: unknown) => {
  console.error('No se pudo arrancar el servidor:', error);
  process.exit(1);
});

async function main() {
  const server = new ServerExpress(
    { port: envConfigProvider.PORT },
    AppRouter.routes,
  );
  await server.start();
}

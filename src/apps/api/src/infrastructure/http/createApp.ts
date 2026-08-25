import express, { type Application, type Router } from 'express';
import type { ServerConfig } from '../../application/ports/config-provider.js';

export class ServerExpress {
  public app: Application = express();
  private readonly port: number;

  constructor(config: ServerConfig, routes: Router) {
    this.port = config.port;
    this.app.use(routes);
  }

  async start(): Promise<void> {
    this.app.listen(this.port, () => {
      console.log(`API server is running on http://localhost:${this.port}`);
    });
  }
}

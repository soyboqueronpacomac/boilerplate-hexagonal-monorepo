import { createApp } from './infrastructure/http/createApp.js';

const port = Number(process.env.PORT ?? 3000);
const app = createApp();
app.listen(port, () => {
  console.log(`API disponible en http://localhost:${port}/api/state`);
});

import { env } from './config/env.js';
import { getAllowedOrigins } from './config/env.js';
import { connectMongo } from './config/mongo.js';
import { createApp } from './app.js';
import { initSocket } from './infrastructure/socket/socket.js';

async function main() {
  await connectMongo();
  const app = createApp();
  const server = app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on port ${env.PORT}`);
  });

  initSocket(server, getAllowedOrigins());

  function shutdown() {
    server.close(() => process.exit(0));
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});


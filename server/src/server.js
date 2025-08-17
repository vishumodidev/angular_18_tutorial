import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { connectToDatabase } from './config/db.js';
import { initRedis } from './config/redis.js';
import { initKafka, startConsumers } from './config/kafka.js';
import { initSocket } from './services/socket.service.js';
import { seedDefaultAdmin } from './services/seed.service.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  await connectToDatabase();
  await seedDefaultAdmin();

  const server = http.createServer(app);
  initSocket(server);

  if (process.env.ENABLE_REDIS === 'true') {
    await initRedis();
  }

  if (process.env.ENABLE_KAFKA === 'true') {
    await initKafka();
    await startConsumers();
  }

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch(err => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
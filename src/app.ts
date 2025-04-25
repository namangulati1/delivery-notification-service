// src/app.ts
import express, { Express } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/db';
import { initKafka } from './config/kafka';
import { initRedis } from './config/redis';
import { initSocketIO } from './socket';
import { startConsumer } from './kafka/consumer';
import notificationRoutes from './routes/notification.route';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

// Init express app
const app: Express = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Connect to services
const initServices = async () => {
  await connectDb();
  await initRedis();
  await initKafka();
  await startConsumer();
};

initServices().catch(err => {
  logger.error('Failed to init services:', err);
  process.exit(1);
});

// Initialize Socket.IO
initSocketIO(server);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notifications', notificationRoutes);

// Health check route
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
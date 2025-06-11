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
import logger from './config/logger';

// Load environment variables
dotenv.config();

// Init express app
const app: Express = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Connect to services
const initServices = async () => {
  try {
    await connectDb();
  } catch (error) {
    logger.error('Failed to initialize MongoDB:', error);
    throw error; // Re-throw to be caught by the caller
  }
  try {
    await initRedis();
  } catch (error) {
    logger.error('Failed to initialize Redis:', error);
    throw error;
  }
  try {
    await initKafka();
  } catch (error) {
    logger.error('Failed to initialize Kafka:', error);
    throw error;
  }
  try {
    await startConsumer(); // Assuming startConsumer is critical like other initializations
  } catch (error) {
    logger.error('Failed to start Kafka consumer:', error);
    throw error;
  }
};

// Initialize services and server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  initServices()
    .then(() => {
      logger.info('All services initialized successfully.');
      // Initialize Socket.IO after other services, if it depends on them
      initSocketIO(server); // Socket.IO needs the server instance

      // Start server
      server.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
      });
    })
    .catch(err => {
      // Specific error should have been logged by initServices
      logger.error('Service initialization failed. Exiting application.');
      process.exit(1);
    });

  // Initialize Socket.IO is now called within the .then() block of initServices()
  // initSocketIO(server); // This line is redundant and removed.

  // Start server
  // server.listen(PORT, () => { // This was also moved into the .then() block
    logger.info(`Server running on port ${PORT}`);
  });
} else {
  // In test environment, we might still need Socket.IO initialized
  // if routes depend on it, but without starting the main HTTP server.
  // Supertest handles server lifecycle for tests.
  initSocketIO(server);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notifications', notificationRoutes);

// Health check route
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

// Centralized Error Handling Middleware
// This should be AFTER all other middleware and routes
import errorHandler from './middleware/errorHandler.middleware';
app.use(errorHandler);

// The server.listen call is already inside the NODE_ENV !== 'test' block.
// No need for a duplicate one here.

export { app, server };
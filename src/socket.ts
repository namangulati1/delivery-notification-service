// src/socket.ts
import { Server } from 'socket.io';
import http from 'http';
import logger from './config/logger';
import { redisClient } from './config/redis';

let io: Server;

export const initSocketIO = (server: http.Server): void => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    logger.info('A user connected', socket.id);

    // Authenticate and store user info in socket
    socket.on('authenticate', async (userId: string) => {
      try {
        socket.data.userId = userId;
        // Add user to Redis for tracking online users
        await redisClient.set(`user:online:${userId}`, socket.id, { EX: 3600 });
        logger.info(`User ${userId} authenticated with socket ${socket.id}`);
      } catch (error) {
        logger.error(`Error authenticating user ${userId}:`, error);
      }
    });

    socket.on('disconnect', async () => {
      try {
        if (socket.data.userId) {
          await redisClient.del(`user:online:${socket.data.userId}`);
          logger.info(`User ${socket.data.userId} disconnected`);
        }
      } catch (error) {
        logger.error('Error handling socket disconnect:', error);
      }
    });
  });

  logger.info('Socket.IO initialized');
};

export { io };
import { io } from '../socket';
import { redisClient } from '../config/redis';
import logger from '../utils/logger';

export const emitToUser = async (userId: string, event: string, data: any): Promise<void> => {
  try {
    // Get user's socket ID from Redis
    const socketId = await redisClient.get(`user:online:${userId}`);
    
    if (socketId) {
      // User is online, send directly via socket
      io.to(socketId).emit(event, data);
      logger.info(`Emitted ${event} to user ${userId} via socket`);
    } else {
      logger.info(`User ${userId} is not online, notification will be seen on next login`);
    }
  } catch (error) {
    logger.error(`Error emitting ${event} to user ${userId}:`, error);
  }
};
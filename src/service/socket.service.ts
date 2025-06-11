import { io } from '../socket';
import { redisClient } from '../config/redis';
import logger from '../config/logger';

export const emitToUser = async (userId: string, event: string, data: any): Promise<void> => {
  try {
    // Convert userId to string if it's not already
    const userIdStr = userId.toString();
    
    // Get user's socket ID from Redis
    const socketId = await redisClient.get(`user:online:${userIdStr}`);
    
    if (socketId) {
      // User is online, send directly via socket
      io.to(socketId).emit(event, data);
      logger.info(`Emitted ${event} to user ${userIdStr} via socket ${socketId}`);
    } else {
      logger.info(`User ${userIdStr} is not online, notification will be seen on next login`);
    }
  } catch (error) {
    logger.error(`Error emitting ${event} to user ${userId}:`, error);
  }
};
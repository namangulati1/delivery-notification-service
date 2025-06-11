import { createClient } from 'redis';
import logger from './logger';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis:6379',
  socket: {
    reconnectStrategy: (retries) => {
      logger.info(`Redis reconnect attempt ${retries}`);
      return Math.min(retries * 100, 3000);
    }
  }
});

redisClient.on('error', (err) => logger.error('Redis error:', err));
redisClient.on('connect', () => logger.info('Redis connected'));
redisClient.on('reconnecting', () => logger.info('Redis reconnecting'));

const initRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error('Redis connection error:', error);
    logger.info('Retrying Redis connection in 5 seconds...');
    setTimeout(() => {
      initRedis().catch(err => {
        logger.error('Failed to reconnect to Redis:', err);
      });
    }, 5000);
  }
};

export { redisClient, initRedis };
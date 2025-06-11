import { consumer } from '../config/kafka';
import { redisClient } from '../config/redis';
import logger from '../config/logger';
import { createNotification } from '../service/notification.service';
import { INotification, INotificationCreate } from '../types/notification.types';
import { emitToUser } from '../service/socket.service';

export const startConsumer = async (): Promise<void> => {
  try {
    // Subscribe to notifications topic
    await consumer.subscribe({
      topic: process.env.KAFKA_TOPIC || "notification-topic",
      fromBeginning: true,
    });
    logger.info('Kafka consumer subscribed to "notifications" topic');

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          if (!message.value) {
            logger.warn('Received message with no value');
            return;
          }

          const notification: INotificationCreate = JSON.parse(message.value.toString());
          logger.info(`Processing notification for user: ${notification.userId}`);
          
          // Store in database
          const savedNotification = await createNotification(notification);
          
          // Make sure we have a valid ID and convert to string if it's an ObjectId
          const notificationId = savedNotification.id?.toString() || 
                               (savedNotification.id ? savedNotification.id.toString() : null);
          
          // if (!notificationId) {
          //   logger.error(`Failed to get valid notification ID for user: ${notification.userId}`);
          //   return;
          // }
          // Convert to a plain object
          const notificationData = savedNotification as INotification;
          
          // Make sure we're storing a valid string in Redis
          const dataForRedis = JSON.stringify(notificationData);
          
          // Cache in Redis with 7-day expiration
          await redisClient.set(
            `notification:${notificationId}`, 
            dataForRedis,
            { EX: 60 * 60 * 24 * 7 }
          );
          
          logger.info(`Notification cached in Redis with key: notification:${notificationId}`);
          
          // Emit to connected user via Socket.io
          emitToUser(notification.userId, 'notification', notificationData);
          
        } catch (error) {
          logger.error('Error processing notification message:', error);
        }
      },
    });
  } catch (error) {
    logger.error('Error starting Kafka consumer:', error);
    throw error;
  }
};
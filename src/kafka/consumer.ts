import { consumer } from "../config/kafka";
import { redisClient } from "../config/redis";
import logger from "../utils/logger";
import { INotificationCreate } from "../types/notification.types";
import { createNotification } from "../service/notification.service";
import { emitToUser } from "../service/socket.service";

export const startConsumer = async (): Promise<void> => {
  await consumer.subscribe({
    topic: process.env.KAFKA_TOPIC || "notification-topic",
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        if (!message.value) return;

        const notification: INotificationCreate = JSON.parse(
          message.value.toString()
        );
        logger.info(`Received notification for user: ${notification.userId}`);

        const savedNotification = await createNotification(notification);

        await redisClient.set(
          `notification:${savedNotification.id}`,
          JSON.stringify(savedNotification),
          { EX: 60 * 60 * 24 * 7 }
        );

        emitToUser(notification.userId, "notification", savedNotification);
      } catch (error) {
        logger.error("Error processing notification message:", error);
      }
    },
  });
};

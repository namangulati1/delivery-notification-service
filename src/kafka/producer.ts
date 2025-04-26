import { producer } from "../config/kafka";
import logger from "../utils/logger";

import { INotificationCreate } from "../types/notification.types";

export const sendNotification = async (notification: INotificationCreate): Promise<void> => {
    try {
        await producer.send({
            topic: process.env.KAFKA_TOPIC || "notification-topic",
            messages: [
                {
                    key: notification.userId.toString(),
                    value: JSON.stringify(notification),
                },
            ],
        });
        logger.info(`Notification sent to Kafka for user: ${notification.userId}`);
    } catch (error) {
        logger.error("Error sending notification to Kafka:", error);
        throw new Error("Failed to send notification");
    }
}
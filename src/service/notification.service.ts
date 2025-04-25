import notificationModel from "../model/notification.model";
import {
  INotification,
  INotificationCreate,
} from "../types/notification.types";
import { redisClient } from "../config/redis";
import { sendNotification } from "../kafka/producer";

export const createNotification = async (
  data: INotificationCreate
): Promise<INotification> => {
  const notification = new notificationModel(data);
  await notification.save();
  return notification.toObject();
};

export const getUserNotifications = async (
  userId: string
): Promise<INotification[]> => {
  return await notificationModel.find({ userId }).sort({ createdAt: -1 });
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<INotification | null> => {
  const notification = await notificationModel.findByIdAndUpdate(
    notificationId,
    { read: true },
    { new: true }
  );
  if (notification) {
    await redisClient.set(
      `notification:${notificationId}`,
      JSON.stringify(notification),
      { EX: 60 * 60 * 24 * 7 }
    );
  }
  return notification?.toObject() || null;
};

export const queueNotification = async (
  data: INotificationCreate
): Promise<void> => {
  await sendNotification(data);
};

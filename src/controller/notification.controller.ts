import { Request, Response, NextFunction } from "express";
import * as notificationService from "../service/notification.service";
import { NotificationType } from "../types/notification.types";
import { NotFoundError } from "../middleware/errorHandler.middleware"; // Import custom error

export const getUserNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.userId;
        const notifications = await notificationService.getUserNotifications(userId);

        res.status(200).json({
            status: "true", // Consider changing to boolean true
            data: notifications,
        });
    } catch (error) {
        next(error); // Forward to the error handler
    }
}

export const markNotificationAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const notificationId = req.params.id;
        const notification = await notificationService.markNotificationAsRead(notificationId);

        if(!notification) {
            // Use the custom NotFoundError
            return next(new NotFoundError("Notification not found"));
        }
        res.status(200).json({
            status: "true", // Consider changing to boolean true
            data: notification,
        });
    } catch (error) {
        next(error); // Forward to the error handler
    }
};

export const sendNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, title, message, type = NotificationType.INFO} = req.body;

        await notificationService.queueNotification({
            userId,
            title,
            message,
            type,
        });

        res.status(202).json({
            status: "true",
            message: "Notification queued successfully",
        });
    } catch (error) {
        res.status(400).json({
            status: "false",
            message: "Error queuing notification",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
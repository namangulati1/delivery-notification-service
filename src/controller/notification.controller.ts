import { Request, Response } from "express";
import * as notificationService from "../service/notification.service";
import { NotificationType } from "../types/notification.types";

export const getUserNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const notifications = await notificationService.getUserNotifications(userId);

        res.status(200).json({
            status: "true",
            data: notifications,
        });
    } catch (error) {
        res.status(400).json({
            status: "false",
            message: "Error fetching notifications",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}

export const markNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const notificationId = req.params.id;
        const notification = await notificationService.markNotificationAsRead(notificationId);

        if(!notification) {
            res.status(404).json({
                status: "false",
                message: "Notification not found",
            });
            return;
        }
        res.status(200).json({
            status: "true",
            data: notification,
        });
    } catch (error) {
        res.status(400).json({
            status: "false",
            message: "Error marking notification as read",
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

export const sendNotification = async (req: Request, res: Response): Promise<void> => {
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
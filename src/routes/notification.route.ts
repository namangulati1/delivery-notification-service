import { Router } from "express";
import * as notificationController from "../controller/notification.controller";
import { protect } from "../middleware/auth.middleware";

const notificationRoutes = Router();

notificationRoutes.get("/:userId", protect, notificationController.getUserNotifications);
notificationRoutes.put("/:id", protect, notificationController.markNotificationAsRead);
notificationRoutes.post("/", protect, notificationController.sendNotification);

export default notificationRoutes;
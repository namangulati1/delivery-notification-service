// src/models/notificationModel.ts
import mongoose, { Schema, Document } from "mongoose";
import { INotification, NotificationType } from "../types/notification.types";

export interface INotificationDocument
  extends Omit<INotification, "id">,
    Document {}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.INFO,
    },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INotificationDocument>(
  "Notification",
  NotificationSchema
);

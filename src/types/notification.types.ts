export enum NotificationType {
    INFO = 'INFO',
    WARNING = 'WARNING',
    ALERT = 'ALERT'
}

export interface INotification {
    id?: string;
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    read: boolean;
    createdAt?: Date;
}

export interface INotificationCreate {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
}
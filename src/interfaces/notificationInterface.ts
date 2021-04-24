export interface NotificationJsonI {
    id: string;
    userId: string;
    title: string;
    message: string;
    seen: boolean;
    category: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

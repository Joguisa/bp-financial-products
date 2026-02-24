import { NotificationType } from "@core/models/notification.model";

export const NOTIFICATION_DURATION: Record<NotificationType, number> = {
  success: 5000,
  error: 7000,
  warning: 5000,
  info: 5000
};

export const DEFAULT_NOTIFICATION_DURATION = 5000;
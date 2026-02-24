import { computed, Injectable, signal } from '@angular/core';
import { Notification, NotificationType } from '@core/models/notification.model';
import { DEFAULT_NOTIFICATION_DURATION, NOTIFICATION_DURATION } from '@core/constants/notification-duration.constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly _notifications = signal<Notification[]>([]);
  private _nextId = 1;

  readonly notifications = this._notifications.asReadonly();
  readonly hasNotifications = computed(() => this._notifications().length > 0);

  show(
    message: string,
    type: NotificationType = 'info',
    duration?: number
  ): void {

    const finalDuration = duration ?? NOTIFICATION_DURATION[type] ?? DEFAULT_NOTIFICATION_DURATION;

    const notification: Notification = {
      id: this._nextId++,
      type,
      message,
      duration: finalDuration
    };

    this._notifications.update(list => [...list, notification]);

    if (finalDuration > 0) {
      setTimeout(() => this.dismiss(notification.id), finalDuration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  dismiss(id: number): void {
    this._notifications.update(list =>
      list.filter(n => n.id !== id)
    );
  }

  dismissAll(): void {
    this._notifications.set([]);
  }
}
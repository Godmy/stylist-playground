import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number; // в миллисекундах, null = не исчезает автоматически
}

// Store для уведомлений
export const notifications: Writable<Notification[]> = writable([]);

// Счётчик для генерации уникальных ID
let notificationIdCounter = 0;

// Действия
export const notificationActions = {
  add: (message: string, type: NotificationType = 'info', duration: number = 3000) => {
    const id = `notification-${Date.now()}-${notificationIdCounter++}`;

    const notification: Notification = {
      id,
      message,
      type,
      duration
    };

    notifications.update(items => [...items, notification]);

    // Автоматически удаляем через duration
    if (duration > 0) {
      setTimeout(() => {
        notificationActions.remove(id);
      }, duration);
    }

    return id;
  },

  remove: (id: string) => {
    notifications.update(items => items.filter(item => item.id !== id));
  },

  clear: () => {
    notifications.set([]);
  },

  success: (message: string, duration?: number) => {
    return notificationActions.add(message, 'success', duration);
  },

  error: (message: string, duration?: number) => {
    return notificationActions.add(message, 'error', duration);
  },

  warning: (message: string, duration?: number) => {
    return notificationActions.add(message, 'warning', duration);
  },

  info: (message: string, duration?: number) => {
    return notificationActions.add(message, 'info', duration);
  }
};

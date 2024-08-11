    // src/services/NotificationService.js
import Notification from '../models/Notification.js';

class NotificationService {
  static async sendNotification(userId, message) {
    // console.log("userId", userId + ": " + message);
    const notification = await Notification.create({
      user: userId,
      message
    });
    console.log(`Notification envoyée à l'utilisateur ${userId}: ${message}`);
  }

  static async getNotifications(userId) {
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    return notifications;
  }

  static async markAsRead(notificationId, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  }
}

export default NotificationService;

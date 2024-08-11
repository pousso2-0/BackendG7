// src/controllers/NotificationController.js
import  NotificationService from '../services/notificationService.js';

class NotificationController {
  static async getNotifications(req, res) {
    try {
      const userId = req.userId;
      const notifications = await NotificationService.getNotifications(userId);
      res.status(200).json(notifications);
    } catch (error) {
      res.status(400).json({ message: `Failed to get notifications: ${error.message}` });
    }
  }
  static async markAsRead(req, res) {
    try {
      const notificationId = req.params.id;
      const userId = req.userId;
      const notification = await NotificationService.markAsRead(notificationId, userId);
      res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
      res.status(400).json({ message: `Failed to mark notification as read: ${error.message}` });
    }
  }
  static async sendNotification(req, res) {
    try {
      const { userId, message } = req.body;

      // Validation simple
      if (!userId || !message) {
        return res.status(400).json({ message: 'User ID and message are required' });
      }

      await NotificationService.sendNotification(userId, message);

      res.status(201).json({ message: 'Notification sent successfully' });
    } catch (error) {
      res.status(400).json({ message: `Failed to send notification: ${error.message}` });
    }
  }
}

export default NotificationController;

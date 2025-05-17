import { Notification } from '../models/notificationModel.js';
import { getChannel } from '../config/rabbitmq.js';
import { NOTIFICATION_QUEUE } from '../config/rabbitmq.js'; // Now imported here

/*
 * POST /notifications
 */
export const sendNotification = async (req, res) => {
  try {
    const { userId, type, message } = req.body;

    if (!userId || !type || !message) {
      return res.status(400).json({ error: 'userId, type, and message are required' });
    }

    const notificationData = {
      userId,
      type,
      message,
      status: 'pending',
      createdAt: new Date(),
    };

    const saved = await Notification.create(notificationData);

    const channel = getChannel();
    channel.sendToQueue(
      NOTIFICATION_QUEUE,
      Buffer.from(JSON.stringify({ notificationId: saved._id })),
      { persistent: true }
    );

    return res.status(201).json({
      message: 'Notification queued for delivery',
      notificationId: saved._id,
    });

  } catch (error) {
    console.error('Error in sendNotification:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/*
 * GET /users/:id/notifications
 */
export const getUserNotifications = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ error: 'Failed to retrieve notifications' });
  }
};

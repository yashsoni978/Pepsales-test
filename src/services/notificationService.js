import { Notification } from '../models/notification.model.js';
import { sendNotificationMessage } from '../queues/producer.js';

export const createAndQueueNotification = async ({ userId, type, message }) => {
  const notification = await Notification.create({
    userId,
    type,
    message,
    status: 'pending',
    createdAt: new Date(),
  });

  await sendNotificationMessage({ notificationId: notification._id });

  return notification;
};

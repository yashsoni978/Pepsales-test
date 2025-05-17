import express from 'express';
import { Notification } from '../models/notificationModel.js';
import { getChannel, NOTIFICATION_QUEUE } from '../config/rabbitmq.js';
import { sendNotification, getUserNotifications } from '../controllers/notificationController.js';

const router = express.Router();


router.post('/notifications', async (req, res) => {
  try {

    const notification = await Notification.create(req.body);


    const channel = getChannel();
    channel.sendToQueue(
      NOTIFICATION_QUEUE,
      Buffer.from(JSON.stringify({ notificationId: notification._id })),
      { persistent: true }
    );

   
    res.status(201).json({ message: 'Notification queued successfully', notificationId: notification._id });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

router.get('/users/:id/notifications', getUserNotifications);

export const notificationRoute = router;

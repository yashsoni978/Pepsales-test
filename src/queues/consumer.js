import { connectRabbitMQ, getChannel, NOTIFICATION_QUEUE } from '../config/rabbitmq.js';
import { Notification } from '../models/notificationModel.js';
import { sendEmail } from '../handlers/emailHandler.js';
import { sendSMS } from '../handlers/smsHandler.js';
import { sendInApp } from '../handlers/inAppHandler.js';

const MAX_RETRIES = 3;

export const startConsumer = async () => {
  const channel = await connectRabbitMQ();

  channel.consume(
    NOTIFICATION_QUEUE,
    async (msg) => {
      if (msg === null) return;

      try {
        const content = JSON.parse(msg.content.toString());
        const { notificationId } = content;

        const notification = await Notification.findById(notificationId);
        if (!notification) {
          console.warn(`Notification not found: ${notificationId}`);
          channel.ack(msg);
          return;
        }

        const retryCount = msg.properties.headers['x-retry-count'] || 0;

        try {
          switch (notification.type) {
            case 'email':
              await sendEmail(notification);
              break;
            case 'sms':
              await sendSMS(notification);
              break;
            case 'in-app':
              await sendInApp(notification);
              break;
            default:
              throw new Error(`Unknown notification type: ${notification.type}`);
          }
          channel.ack(msg);
        } catch (handlerError) {
          if (retryCount < MAX_RETRIES) {
            const delayMs = 2000 * (retryCount + 1);
            setTimeout(() => {
              channel.sendToQueue(
                NOTIFICATION_QUEUE,
                Buffer.from(JSON.stringify({ notificationId })),
                {
                  persistent: true,
                  headers: { 'x-retry-count': retryCount + 1 },
                }
              );
              channel.ack(msg);
            }, delayMs);
          } else {
            notification.status = 'failed';
            notification.error = handlerError.message;
            await notification.save();
            channel.ack(msg);
          }
        }
      } catch (error) {
        console.error('Unexpected error in consumer:', error);
        channel.nack(msg, false, true);
      }
    },
    { noAck: false }
  );

  console.log('RabbitMQ consumer started');
};

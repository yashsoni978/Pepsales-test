import { connectRabbitMQ, NOTIFICATION_QUEUE } from '../config/rabbitmq.js';

let channel;

async function initChannel() {
  if (!channel) {
    channel = await connectRabbitMQ();
  }
  return channel;
}

export const sendNotificationMessage = async (payload) => {
  try {
    const ch = await initChannel();

    ch.sendToQueue(
      NOTIFICATION_QUEUE,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true }
    );

    console.log(`Message sent to queue: ${JSON.stringify(payload)}`);
  } catch (error) {
    console.error('Failed to send message to queue:', error);
    throw error;
  }
};

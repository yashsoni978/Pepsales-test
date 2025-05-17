import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const NOTIFICATION_QUEUE = process.env.NOTIFICATION_QUEUE || 'notification_queue';

let connection;
let channel;

export const connectRabbitMQ = async () => {
  if (!connection) {
    connection = await amqp.connect(RABBITMQ_URL);
  }
  if (!channel) {
    channel = await connection.createChannel();
    await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });
  }
  return channel;
};

export const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  return channel;
};

export { NOTIFICATION_QUEUE };

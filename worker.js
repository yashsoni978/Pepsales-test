import 'dotenv/config';

import connectDB  from './src/config/db.js';
import { startConsumer } from './src/queues/consumer.js';

(async () => {
  try {
    await connectDB();
    await startConsumer();
    console.log('🐇 Notification worker started and consuming messages...');
  } catch (error) {
    console.error('Worker failed to start:', error);
    process.exit(1);
  }
})();

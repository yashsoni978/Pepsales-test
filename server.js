import 'dotenv/config';

import { app } from './src/app.js';
import connectDB from './src/config/db.js';
import { connectRabbitMQ } from './src/config/rabbitmq.js';

const PORT = process.env.PORT || 3000;

(async () => {
  try {

    await connectDB();


    await connectRabbitMQ();


    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

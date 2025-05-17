import express from 'express';
import {notificationRoute} from './routes/notificationRoute.js';

const app = express();

app.use(express.json());


app.use('/api', notificationRoute);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export { app };

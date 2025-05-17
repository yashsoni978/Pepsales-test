import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['email', 'sms', 'in-app'],
    required: true,
  },
  message: {
    type: mongoose.Schema.Types.Mixed, 
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
  },
  error: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  sentAt: {
    type: Date,
    default: null,
  },
});

export const Notification = mongoose.model('Notification', notificationSchema);

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: true,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'error', 'success', 'reminder'],
    default: 'info'
  },
  channel: {
    type: String,
    enum: ['in_app', 'email', 'sms', 'push'],
    default: 'in_app'
  },
  reference: {
    type: String,
    refType: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  sentAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
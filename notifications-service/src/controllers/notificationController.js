const Notification = require('../models/Notification');
const axios = require('axios');
const nodemailer = require('nodemailer');

const validateToken = async (token) => {
  try {
    const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/api/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: process.env.EMAIL_PORT || 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text: message
    });
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, channel, reference } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    await validateToken(token);

    const notification = new Notification({
      userId,
      title,
      message,
      type: type || 'info',
      channel: channel || 'in_app',
      reference
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notification created',
      data: notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const { userId, email, title, message, type, channel, reference } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    await validateToken(token);

    const notification = new Notification({
      userId,
      title,
      message,
      type: type || 'info',
      channel: channel || 'in_app',
      reference,
      sentAt: new Date()
    });

    await notification.save();

    if (channel === 'email' && email) {
      await sendEmail(email, title, message);
    }

    res.status(201).json({
      success: true,
      message: 'Notification sent',
      data: notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { userId, isRead, type, startDate, endDate } = req.query;
    
    const filter = {};
    if (userId) filter.userId = userId;
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const notifications = await Notification.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('userId', 'name email');

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.isRead = true;
    notification.readAt = new Date();

    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;
    
    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
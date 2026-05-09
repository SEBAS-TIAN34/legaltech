const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');
// const auditLogger = require('../middleware/auditLogger');

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: process.env.EMAIL_PORT || 587,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to, subject, text: message
    });
  } catch (error) {
    console.error('Email failed:', error.message);
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, channel } = req.body;
    if (!userId || !title || !message) {
      return res.status(400).json({ success: false, message: 'Please provide userId, title, and message' });
    }

    const notification = await Notification.create({ userId, title, message, type: type || 'info', channel: channel || 'in_app' });

    if (channel === 'email') {
      await sendEmail(userId, title, message);
    }

    // await auditLogger.create({
    //   entity: 'Notification',
    //   entityId: notification.id,
    //   description: `Notificación creada: ${title}`,
    //   newValues: { userId, title, type: type || 'info', channel: channel || 'in_app' },
    //   user: req.user,
    //   req
    // });

    res.status(201).json({ success: true, message: 'Notification created', data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const { userId, isRead } = req.query;
    const where = {};
    if (userId) where.userId = userId;
    if (isRead !== undefined) where.isRead = isRead === 'true';

    const notifications = await Notification.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: notifications, count: notifications.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await notification.update({ isRead: true, readAt: new Date() });

    // await auditLogger.update({
    //   entity: 'Notification',
    //   entityId: notification.id,
    //   description: `Notificación marcada como leída: ${notification.title}`,
    //   oldValues: { isRead: false },
    //   newValues: { isRead: true, readAt: new Date() },
    //   user: req.user,
    //   req
    // });

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    const oldValues = { userId: notification.userId, title: notification.title, type: notification.type };
    await notification.destroy();

    // await auditLogger.delete({
    //   entity: 'Notification',
    //   entityId: req.params.id,
    //   description: `Notificación eliminada: ${oldValues.title}`,
    //   oldValues,
    //   user: req.user,
    //   req
    // });

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { userId, isRead } = req.query;
    const where = {};
    if (userId) where.userId = userId;
    if (isRead !== undefined) where.isRead = isRead === 'true';
    const notifications = await Notification.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: notifications, count: notifications.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const { userId, title, message, type, channel, email } = req.body;
    if (!userId || !title || !message) {
      return res.status(400).json({ success: false, message: 'userId, title, and message required' });
    }
    const notification = await Notification.create({ userId, title, message, type: type || 'info', channel: channel || 'in_app' });
    if (channel === 'email' || email) {
      await sendEmail(userId, title, message);
    }

    // await auditLogger.create({
    //   entity: 'Notification',
    //   entityId: notification.id,
    //   description: `Notificación enviada: ${title} (${channel || 'in_app'})`,
    //   newValues: { userId, title, type: type || 'info', channel: channel || 'in_app', sentVia: channel === 'email' ? 'email' : 'in_app' },
    //   user: req.user,
    //   req
    // });

    res.status(201).json({ success: true, message: 'Notification sent', data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const unreadCount = await Notification.count({ where: { isRead: false } });
    await Notification.update({ isRead: true, readAt: new Date() }, { where: { isRead: false } });

    // await auditLogger.update({
    //   entity: 'Notification',
    //   entityId: 'bulk',
    //   description: `${unreadCount} notificaciones marcadas como leídas`,
    //   oldValues: { isRead: false },
    //   newValues: { isRead: true, readAt: new Date(), count: unreadCount },
    //   user: req.user,
    //   req
    // });

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
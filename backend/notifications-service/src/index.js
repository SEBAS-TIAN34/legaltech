require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const notificationsRoutes = require('./routes/notifications');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/notifications', notificationsRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Notifications Service is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 3007;

app.listen(PORT, () => {
  console.log(`🚀 Notifications Service running on port ${PORT}`);
});
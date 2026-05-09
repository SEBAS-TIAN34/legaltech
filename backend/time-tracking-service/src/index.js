require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const timeEntriesRoutes = require('./routes/timeEntries');

const app = express();

connectDB();

// CORS configuration - Allow all origins for production
const corsOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/time-entries', timeEntriesRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Time Tracking Service is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`🚀 Time Tracking Service running on port ${PORT}`);
});
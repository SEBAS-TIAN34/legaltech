require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const documentsRoutes = require('./routes/documents');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/documents', documentsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Documents Service is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`🚀 Documents Service running on port ${PORT}`);
});

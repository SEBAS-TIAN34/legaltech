require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const invoicesRoutes = require('./routes/invoices');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/invoices', invoicesRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Billing Service is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
  console.log(`🚀 Billing Service running on port ${PORT}`);
});
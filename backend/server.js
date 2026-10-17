const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const seedDatabase = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS setup: permits Vercel deployments, Render, local dev, or custom CORS_ORIGIN
const rawOrigins = process.env.CORS_ORIGIN || '*';
const allowedList = rawOrigins.split(',').map(s => s.trim().replace(/\/$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, server-to-server, curl)
    if (!origin) return callback(null, true);

    // If wildcard or explicitly in CORS_ORIGIN list
    if (rawOrigins === '*' || allowedList.includes('*') || allowedList.includes(origin)) {
      return callback(null, origin);
    }

    // Automatically allow any Vercel deployment (*.vercel.app) or localhost
    if (origin.endsWith('.vercel.app') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, origin);
    }

    // Fallback: permit origin
    return callback(null, origin);
  },
  credentials: true
}));

app.use(express.json());

// MongoDB Connection URI via environment variable
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ CRITICAL: MONGO_URI is not defined in environment variables.');
  console.error('Please configure MONGO_URI in your .env file or Render dashboard.');
} else {
  // Connect to MongoDB Atlas
  mongoose
    .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(async () => {
      console.log('✅ Successfully connected to MongoDB Atlas (gebeta_qr)');
      // Auto-seed initial data if collections are empty
      await seedDatabase();
    })
    .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
    });
}

// Root route for Render service healthcheck
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'GebetaQR Backend API',
    version: '1.0.0',
    documentation: '/api/health',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/categories', require('./routes/categories'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/settings', require('./routes/settings'));

// Detailed Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'GebetaQR Backend API',
    mongoConnected: mongoose.connection.readyState === 1,
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 GebetaQR Backend Server running on port ${PORT}`);
});

module.exports = app;


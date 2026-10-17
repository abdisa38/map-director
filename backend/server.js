const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const seedDatabase = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI provided by user
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://abdisaawel313_db_user:PnnmIMzD3fZjjgBq@cluster0.nyu4si0.mongodb.net/gebeta_qr?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log(' Successfully connected to MongoDB Atlas (gebeta_qr)');
    // Auto-seed initial data if collections are empty
    await seedDatabase();
  })
  .catch((err) => {
    console.error(' MongoDB Connection Error:', err.message);
  });

// API Routes
app.use('/api/categories', require('./routes/categories'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/tables', require('./routes/tables'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/settings', require('./routes/settings'));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'GebetaQR Backend API',
    mongoConnected: mongoose.connection.readyState === 1,
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(` GebetaQR Backend Server running on http://localhost:${PORT}`);
});

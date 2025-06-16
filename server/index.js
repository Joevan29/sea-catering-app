const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Import semua rute Anda
const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Daftarkan semua rute di bawah satu awalan /api
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admin', adminRoutes);

// Rute dasar untuk mengecek apakah API berjalan
app.get('/api', (req, res) => {
  res.send('API SEA Catering Berjalan!');
});

// Ekspor aplikasi untuk digunakan oleh Vercel
module.exports = app;

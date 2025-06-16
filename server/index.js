const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db'); // Pastikan path ini benar

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173"
}));
app.use(express.json());

// Pendaftaran Semua Rute
const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admin', adminRoutes);

// Rute dasar untuk tes
app.get('/api', (req, res) => { // Ubah path agar tidak konflik
  res.send('API SEA Catering Berjalan dengan Sukses!');
});

// SERAHKAN APLIKASI KE VERCEL UNTUK DIJALANKAN
module.exports = app;

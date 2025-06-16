const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

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
app.get('/', (req, res) => {
  res.send('API SEA Catering Berjalan dengan Sukses!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});

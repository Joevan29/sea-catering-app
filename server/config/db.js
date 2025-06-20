const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// Tes koneksi ini akan berjalan saat server start
pool.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal!', err.stack);
  } else {
    console.log('Berhasil terhubung ke database PostgreSQL.');
  }
});

module.exports = pool;

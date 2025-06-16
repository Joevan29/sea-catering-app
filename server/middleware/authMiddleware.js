const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Ambil data user dari DB dan sematkan di request (tanpa password)
      const userResult = await pool.query('SELECT id, full_name, email, role FROM users WHERE id = $1', [decoded.id]);
      if (userResult.rows.length === 0) {
        return res.status(401).json({ message: 'User tidak ditemukan' });
      }
      req.user = userResult.rows[0];
      next();
    } catch (error) {
      res.status(401).json({ message: 'Tidak terotorisasi, token tidak valid' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Tidak terotorisasi, tidak ada token' });
  }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Akses ditolak, butuh role admin' });
    }
}

module.exports = { protect, admin };
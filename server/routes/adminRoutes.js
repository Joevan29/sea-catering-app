const express = require('express');
const router = express.Router();
const { getAllSubscriptions, getAllUsers, getAnalyticsData } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Rute ini terproteksi, HANYA BISA DIAKSES OLEH ADMIN YANG SUDAH LOGIN
router.get('/analytics', protect, admin, getAnalyticsData); // <-- RUTE BARU
router.get('/subscriptions', protect, admin, getAllSubscriptions);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
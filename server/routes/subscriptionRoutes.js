const express = require('express');
const router = express.Router();
const { createSubscription, getMySubscriptions } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

// Rute untuk membuat langganan baru (terproteksi)
router.post('/', protect, createSubscription);

// Rute untuk mengambil data langganan milikku (terproteksi)
router.get('/mine', protect, getMySubscriptions);

module.exports = router;
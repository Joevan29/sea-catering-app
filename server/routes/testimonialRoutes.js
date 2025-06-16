// server/routes/testimonialRoutes.js
const express = require('express');
const router = express.Router();
const { getTestimonials, createTestimonial } = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getTestimonials); // Rute publik untuk mengambil data
router.post('/', protect, createTestimonial); // Rute terproteksi untuk membuat data

module.exports = router;
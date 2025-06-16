const pool = require('../config/db');

// Mengambil semua testimoni yang sudah disetujui
exports.getTestimonials = async (req, res) => {
    try {
        const testimonials = await pool.query(
            "SELECT * FROM testimonials WHERE is_approved = true ORDER BY created_at DESC"
        );
        res.status(200).json(testimonials.rows);
    } catch (err) {
        console.error("Error di getTestimonials:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

// Membuat testimoni baru (hanya untuk user yang login)
exports.createTestimonial = async (req, res) => {
    try {
        const { reviewMessage, rating } = req.body;
        const { id: userId, full_name: customerName } = req.user;

        if (!reviewMessage || !rating) {
            return res.status(400).json({ message: "Review dan rating wajib diisi." });
        }

        // --- PERBAIKAN ADA DI SINI ---
        const ratingInt = parseInt(rating, 10); // Ubah rating dari string menjadi integer
        // -----------------------------

        // Validasi tambahan
        if (isNaN(ratingInt) || ratingInt < 1 || ratingInt > 5) {
            return res.status(400).json({ message: "Rating harus berupa angka antara 1 dan 5." });
        }

        const newTestimonial = await pool.query(
            "INSERT INTO testimonials (user_id, customer_name, review_message, rating) VALUES ($1, $2, $3, $4) RETURNING *",
            [userId, customerName, reviewMessage, ratingInt] // Gunakan ratingInt yang sudah diubah
        );

        res.status(201).json(newTestimonial.rows[0]);
    } catch (err) {
        console.error("Error di createTestimonial:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
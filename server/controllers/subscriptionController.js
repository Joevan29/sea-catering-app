const pool = require('../config/db');

// @desc    Membuat langganan baru
// @route   POST /api/subscriptions
// @access  Private
exports.createSubscription = async (req, res) => {
  try {
    // Kita tidak lagi butuh fullName dari form, karena sudah ada di data user
    const { phoneNumber, plan, mealTypes, deliveryDays, allergies } = req.body;

    // req.user didapatkan dari middleware 'protect'
    const userId = req.user.id; 

    // Validasi dasar
    if (!userId || !phoneNumber || !plan || !mealTypes || mealTypes.length === 0 || !deliveryDays || deliveryDays.length === 0) {
      return res.status(400).json({ message: 'Harap isi semua field yang wajib diisi.' });
    }

    // Kalkulasi harga di sisi server
    const planPrices = { 'Diet Plan': 30000, 'Protein Plan': 40000, 'Royal Plan': 60000 };
    const planPrice = planPrices[plan];
    if (!planPrice) {
      return res.status(400).json({ message: 'Paket yang dipilih tidak valid.' });
    }
    const totalPrice = planPrice * mealTypes.length * deliveryDays.length * 4.3;

    // Query INSERT yang sudah benar (tanpa fullName)
    const newSubscription = await pool.query(
      "INSERT INTO subscriptions (user_id, phone_number, plan_name, meal_types, delivery_days, allergies, total_price) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [userId, phoneNumber, plan, mealTypes, deliveryDays, allergies || null, totalPrice]
    );

    res.status(201).json(newSubscription.rows[0]);
  } catch (err) {
    console.error("ERROR SAAT MEMBUAT LANGGANAN:", err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mendapatkan semua langganan milik user yang login
// @route   GET /api/subscriptions/mine
// @access  Private
exports.getMySubscriptions = async (req, res) => {
    try {
        // req.user.id juga didapatkan dari middleware 'protect'
        const subscriptions = await pool.query(
            "SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC",
            [req.user.id]
        );

        res.status(200).json(subscriptions.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};
const pool = require('../config/db');

// @desc    Admin mendapatkan SEMUA data langganan
// @route   GET /api/admin/subscriptions
exports.getAllSubscriptions = async (req, res) => {
    try {
        // Query ini menggunakan JOIN untuk mengambil nama user dari tabel 'users'
        // dan memastikan semua kolom yang dibutuhkan ada
        const allSubscriptions = await pool.query(
            `SELECT 
                s.id, 
                s.plan_name, 
                s.status, 
                s.total_price, 
                s.created_at, 
                u.full_name, -- Mengambil nama dari tabel users
                u.email      -- Mengambil email dari tabel users
             FROM 
                subscriptions s 
             JOIN 
                users u ON s.user_id = u.id
             ORDER BY 
                s.created_at DESC`
        );
        res.status(200).json(allSubscriptions.rows);
    } catch (err) {
        console.error("Error di getAllSubscriptions:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Admin mendapatkan SEMUA data pengguna
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        // Query ini sudah benar, kita pastikan lagi
        const allUsers = await pool.query(
            "SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC"
        );
        res.status(200).json(allUsers.rows);
    } catch (err) {
        console.error("Error di getAllUsers:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Admin mendapatkan data statistik untuk dashboard analytics
// @route   GET /api/admin/analytics
exports.getAnalyticsData = async (req, res) => {
    // Fungsi ini sudah bekerja dengan baik, kita biarkan saja.
    try {
        const [kpiResult] = await Promise.all([
            pool.query(`
                SELECT
                    (SELECT SUM(total_price) FROM subscriptions WHERE status = 'Active') as "totalRevenue",
                    (SELECT COUNT(*) FROM subscriptions WHERE created_at > NOW() - interval '30 day') as "newSubscriptions",
                    (SELECT COUNT(DISTINCT user_id) FROM subscriptions WHERE status = 'Active') as "subscriptionGrowth",
                    (SELECT COUNT(*) FROM users WHERE created_at > NOW() - interval '30 day') as "newUsersThisMonth"
            `),
            // ... query lain bisa ditambahkan di sini jika perlu ...
        ]);
        const kpis = kpiResult.rows[0] || {};
        res.status(200).json({
            kpi: {
                totalRevenue: parseFloat(kpis.totalRevenue) || 0,
                newSubscriptions: parseInt(kpis.newSubscriptions) || 0,
                subscriptionGrowth: parseInt(kpis.subscriptionGrowth) || 0,
                newUsersThisMonth: parseInt(kpis.newUsersThisMonth) || 0,
            },
            // Anda bisa tambahkan data dummy untuk chart jika query-nya kompleks
            revenueChartData: [], 
            topPlansData: [],
            recentActivityData: []
        });
    } catch (err) {
        console.error("Error di getAnalyticsData:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


// ... (Fungsi updateUserRole dan deleteUser tetap sama)
exports.updateUserRole = async (req, res) => { /* ... */ };
exports.deleteUser = async (req, res) => { /* ... */ };

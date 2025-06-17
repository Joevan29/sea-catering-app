const pool = require('../config/db');

// Fungsi ini bisa Anda biarkan seperti semula
exports.getAllSubscriptions = async (req, res) => {
    try {
        const allSubscriptions = await pool.query(
            `SELECT s.id, s.plan_name, s.status, u.full_name
             FROM subscriptions s JOIN users u ON s.user_id = u.id
             ORDER BY s.created_at DESC`
        );
        res.status(200).json(allSubscriptions.rows);
    } catch (err) {
        console.error("Error di getAllSubscriptions:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Fungsi ini juga bisa Anda biarkan seperti semula
exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await pool.query("SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC");
        res.status(200).json(allUsers.rows);
    } catch (err) {
        console.error("Error di getAllUsers:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


// ==========================================================
// KODE LENGKAP UNTUK FUNGSI getAnalyticsData YANG BARU
// ==========================================================
exports.getAnalyticsData = async (req, res) => {
    try {
        // Menjalankan semua query secara paralel untuk efisiensi
        const [
            kpiCurrentResult,
            kpiPreviousResult,
            revenueChartResult,
            topPlansResult,
            recentActivityResult
        ] = await Promise.all([
            // Query untuk 30 hari terakhir (Periode Saat Ini)
            pool.query(`
                SELECT
                    (SELECT SUM(total_price) FROM subscriptions WHERE status = 'Active' AND created_at BETWEEN NOW() - interval '30 day' AND NOW()) as "totalRevenue",
                    (SELECT COUNT(*) FROM subscriptions WHERE created_at BETWEEN NOW() - interval '30 day' AND NOW()) as "newSubscriptions",
                    (SELECT COUNT(*) FROM users WHERE created_at BETWEEN NOW() - interval '30 day' AND NOW()) as "newUsers"
            `),
            // Query untuk 30-60 hari yang lalu (Periode Sebelumnya untuk perbandingan)
            pool.query(`
                SELECT
                    (SELECT SUM(total_price) FROM subscriptions WHERE status = 'Active' AND created_at BETWEEN NOW() - interval '60 day' AND NOW() - interval '30 day') as "totalRevenue",
                    (SELECT COUNT(*) FROM subscriptions WHERE created_at BETWEEN NOW() - interval '60 day' AND NOW() - interval '30 day') as "newSubscriptions",
                    (SELECT COUNT(*) FROM users WHERE created_at BETWEEN NOW() - interval '60 day' AND NOW() - interval '30 day') as "newUsers"
            `),
            // Query grafik pendapatan harian untuk 30 hari terakhir
            // Menggunakan generate_series untuk memastikan semua hari ada, bahkan yang pendapatannya nol
            pool.query(`
                WITH days AS (
                    SELECT generate_series(
                        CURRENT_DATE - interval '29 day', 
                        CURRENT_DATE, 
                        '1 day'
                    )::date AS day
                )
                SELECT 
                    TO_CHAR(d.day, 'DD Mon') AS name,
                    COALESCE(SUM(s.total_price), 0) AS "Pendapatan"
                FROM days d
                LEFT JOIN subscriptions s ON DATE(s.created_at) = d.day AND s.status = 'Active'
                GROUP BY d.day
                ORDER BY d.day;
            `),
            // Query untuk 3 paket terlaris
            pool.query(`
                SELECT plan_name, COUNT(*) as count FROM subscriptions WHERE status = 'Active'
                GROUP BY plan_name ORDER BY count DESC LIMIT 3;
            `),
            // Query untuk 4 aktivitas langganan terbaru
            pool.query(`
                SELECT u.full_name, s.plan_name, s.created_at
                FROM subscriptions s JOIN users u ON s.user_id = u.id
                ORDER BY s.created_at DESC LIMIT 4;
            `)
        ]);

        // Fungsi helper untuk menghitung persentase perubahan
        const calculateChange = (current, previous) => {
            const currentVal = parseFloat(current) || 0;
            const previousVal = parseFloat(previous) || 0;
            if (previousVal === 0) return currentVal > 0 ? 100 : 0; // Hindari pembagian dengan nol
            return Math.round(((currentVal - previousVal) / previousVal) * 100);
        };

        const currentKpi = kpiCurrentResult.rows[0] || {};
        const previousKpi = kpiPreviousResult.rows[0] || {};

        // Memformat data KPI dengan nilai dan data perubahannya
        const kpis = {
            totalRevenue: {
                value: parseFloat(currentKpi.totalRevenue) || 0,
                change: calculateChange(currentKpi.totalRevenue, previousKpi.totalRevenue)
            },
            newSubscriptions: {
                value: parseInt(currentKpi.newSubscriptions) || 0,
                change: calculateChange(currentKpi.newSubscriptions, previousKpi.newSubscriptions)
            },
            newUsers: {
                value: parseInt(currentKpi.newUsers) || 0,
                change: calculateChange(currentKpi.newUsers, previousKpi.newUsers)
            }
        };

        // Menghitung total langganan aktif untuk persentase "Paket Terlaris"
        const totalActiveSubsResult = await pool.query("SELECT COUNT(*) FROM subscriptions WHERE status = 'Active'");
        const totalActiveSubs = parseInt(totalActiveSubsResult.rows[0].count) || 1; // default 1 untuk hindari pembagian dgn 0

        const topPlansWithPercentage = topPlansResult.rows.map(plan => ({
            name: plan.plan_name,
            percentage: Math.round((plan.count / totalActiveSubs) * 100)
        }));
        
        // Memformat data aktivitas terbaru
        const recentActivity = recentActivityResult.rows.map((act, index) => ({
            id: index,
            user: act.full_name,
            action: `memulai langganan ${act.plan_name}.`,
            time: act.created_at // Biarkan frontend yang format waktunya
        }));

        // Menggabungkan semua hasil menjadi satu object JSON untuk dikirim ke frontend
        res.status(200).json({
            kpi: kpis,
            revenueChartData: revenueChartResult.rows.map(r => ({ ...r, Pendapatan: parseFloat(r.Pendapatan) })),
            topPlansData: topPlansWithPercentage,
            recentActivityData: recentActivity
        });

    } catch (err) {
        console.error("Error di getAnalyticsData:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

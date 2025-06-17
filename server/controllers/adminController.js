// server/controllers/adminController.js
const pool = require('../config/db');

// ... (fungsi getAllSubscriptions dan getAllUsers tetap sama)

exports.getAllSubscriptions = async (req, res) => { /* ... */ };
exports.getAllUsers = async (req, res) => { /* ... */ };

exports.getAnalyticsData = async (req, res) => {
    try {
        const [
            kpiResult,
            revenueChartResult, // Ini yang akan kita ubah query-nya
            topPlansResult,
            recentActivityResult
        ] = await Promise.all([
            pool.query(`
                SELECT
                    (SELECT SUM(total_price) FROM subscriptions WHERE status = 'Active') as "totalRevenue",
                    (SELECT COUNT(*) FROM subscriptions WHERE created_at > NOW() - interval '30 day') as "newSubscriptions",
                    (SELECT COUNT(DISTINCT user_id) FROM subscriptions WHERE status = 'Active') as "activeUsers",
                    (SELECT COUNT(*) FROM users WHERE created_at > NOW() - interval '30 day') as "newUsersThisMonth"
            `),
            // INI ADALAH QUERY BARU UNTUK GRAFIK HARIAN
            pool.query(`
                SELECT 
                    TO_CHAR(DATE_TRUNC('day', created_at), 'DD Mon') AS name,
                    SUM(total_price) AS "Pendapatan"
                FROM subscriptions
                WHERE created_at > NOW() - interval '30 day'
                GROUP BY DATE_TRUNC('day', created_at) 
                ORDER BY DATE_TRUNC('day', created_at);
            `),
            pool.query(`
                SELECT plan_name, COUNT(*) as count FROM subscriptions
                GROUP BY plan_name ORDER BY count DESC LIMIT 3;
            `),
            pool.query(`
                SELECT u.full_name, s.plan_name, s.created_at
                FROM subscriptions s JOIN users u ON s.user_id = u.id
                ORDER BY s.created_at DESC LIMIT 4;
            `)
        ]);

        const kpiRow = kpiResult.rows[0] || {};
        const kpis = {
            totalRevenue: parseFloat(kpiRow.totalRevenue) || 0,
            newSubscriptions: parseInt(kpiRow.newSubscriptions) || 0,
            activeUsers: parseInt(kpiRow.activeUsers) || 0,
            newUsersThisMonth: parseInt(kpiRow.newUsersThisMonth) || 0,
        };

        const totalSubsResult = await pool.query("SELECT COUNT(*) FROM subscriptions");
        const totalSubs = parseInt(totalSubsResult.rows[0].count) || 0;
        const topPlansWithPercentage = topPlansResult.rows.map(plan => ({
            name: plan.plan_name,
            percentage: totalSubs > 0 ? Math.round((plan.count / totalSubs) * 100) : 0
        }));

        const recentActivity = recentActivityResult.rows.map((act, index) => ({
            id: index,
            user: act.full_name,
            action: `memulai langganan ${act.plan_name}.`,
            time: new Date(act.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})
        }));

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

// ... (fungsi updateUserRole dan deleteUser tetap sama)
exports.updateUserRole = async (req, res) => { /* ... */ };
exports.deleteUser = async (req, res) => { /* ... */ };

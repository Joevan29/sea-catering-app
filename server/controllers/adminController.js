const pool = require('../config/db');

// ==========================================================
// UNTUK HALAMAN: KELOLA LANGGANAN
// ==========================================================
exports.getAllSubscriptions = async (req, res) => {
    try {
        const queryText = `
            SELECT 
                s.id, 
                s.plan_name, 
                s.status,
                u.full_name
            FROM 
                subscriptions s
            JOIN 
                users u ON s.user_id = u.id
            ORDER BY 
                s.created_at DESC`;
        
        const allSubscriptions = await pool.query(queryText);
        res.status(200).json(allSubscriptions.rows);
    } catch (err) {
        console.error("Error di getAllSubscriptions:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ==========================================================
// UNTUK HALAMAN: KELOLA USER
// ==========================================================
exports.getAllUsers = async (req, res) => {
    try {
        const queryText = "SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC";
        const allUsers = await pool.query(queryText);
        res.status(200).json(allUsers.rows);
    } catch (err) {
        console.error("Error di getAllUsers:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ==========================================================
// UNTUK HALAMAN: ANALYTICS (DENGAN GRAFIK HARIAN)
// ==========================================================
exports.getAnalyticsData = async (req, res) => {
    try {
        const [
            kpiResult,
            revenueChartResult,
            topPlansResult,
            recentActivityResult
        ] = await Promise.all([
            pool.query(`
                SELECT
                    (SELECT SUM(total_price) FROM subscriptions WHERE status = 'Active') as "totalRevenue",
                    (SELECT COUNT(*) FROM subscriptions WHERE created_at > NOW() - interval '30 day') as "newSubscriptions",
                    (SELECT COUNT(DISTINCT user_id) FROM subscriptions WHERE status = 'Active') as "subscriptionGrowth",
                    (SELECT COUNT(*) FROM users WHERE created_at > NOW() - interval '30 day') as "newUsersThisMonth"
            `),
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
            subscriptionGrowth: parseInt(kpiRow.subscriptionGrowth) || 0,
            newUsersThisMonth: parseInt(kpiRow.newUsersThisMonth) || 0,
        };

        const totalSubsResult = await pool.query("SELECT COUNT(*) FROM subscriptions");
        const totalSubs = parseInt(totalSubsResult.rows[0].count) || 0;
        const topPlansWithPercentage = topPlansResult.rows.map(plan => ({
            name: plan.plan_name,
            percentage: totalSubs > 0 ? Math.round((plan.count / totalSubs) * 100) : 0
        }));

        const recentActivity = recentActivityResult.rows.map((act, index) => ({
            id: act.created_at, // Menggunakan timestamp sebagai key unik
            user: act.full_name,
            action: `memulai langganan ${act.plan_name}.`,
            time: new Date(act.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})
        }));
        
        res.status(200).json({
            kpi: kpis,
            revenueChartData: revenueChartResult.rows.map(r => ({ ...r, name: r.name.trim(), Pendapatan: parseFloat(r.Pendapatan) })),
            topPlansData: topPlansWithPercentage,
            recentActivityData: recentActivity
        });

    } catch (err) {
        console.error("Error di getAnalyticsData:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ==========================================================
// FUNGSI UNTUK AKSI ADMIN (UBAH ROLE & HAPUS)
// ==========================================================
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const { id } = req.params;
        if (!role || (role !== 'admin' && role !== 'user')) {
            return res.status(400).json({ message: 'Role tidak valid.' });
        }
        const updatedUser = await pool.query("UPDATE users SET role = $1 WHERE id = $2 RETURNING id, full_name, email, role", [role, id]);
        if (updatedUser.rows.length === 0) return res.status(404).json({ message: 'User tidak ditemukan.' });
        res.status(200).json(updatedUser.rows[0]);
    } catch (err) {
        console.error("Error di updateUserRole:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ message: 'Anda tidak dapat menghapus akun Anda sendiri.' });
        }
        await pool.query("DELETE FROM users WHERE id = $1", [id]);
        res.status(200).json({ message: `User dengan ID ${id} berhasil dihapus.` });
    } catch (err) {
        console.error("Error di deleteUser:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

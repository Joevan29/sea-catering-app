import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { FaUsers, FaDollarSign, FaShoppingCart, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

// CATATAN PENTING: Pastikan Anda sudah menginstal library ini
// Jalankan di terminal Anda: npm install date-fns

// Komponen KpiCard yang lebih aman
const KpiCard = ({ title, value, icon, change }) => {
    // Pemeriksaan keamanan: jika change tidak ada, anggap 0
    const changeValue = change ?? 0;
    const isIncrease = changeValue >= 0;
    const changeIcon = isIncrease ? <FaArrowUp /> : <FaArrowDown />;
    const changeClass = isIncrease ? 'increase' : 'decrease';

    return (
        <div className="card kpi-card">
            <div className="kpi-card__icon-wrapper">{icon}</div>
            <div className="kpi-card__info">
                <p className="kpi-card__title">{title}</p>
                <p className="kpi-card__value">{value}</p>
                <span className={`kpi-card__change ${changeClass}`}>
                    {changeIcon}
                    {Math.abs(changeValue)}% vs 30 hari sebelumnya
                </span>
            </div>
        </div>
    );
};

// Komponen RecentActivity yang lebih aman
const RecentActivity = ({ activities = [] }) => ( // Default ke array kosong
    <div className="card">
        <h3 className="heading heading--tertiary">Aktivitas Terbaru</h3>
        <ul className="activity-feed">
            {activities.length > 0 ? activities.map((act, index) => {
                // Pemeriksaan keamanan untuk setiap properti
                const userName = act?.user || "Pengguna Anonim";
                const userInitials = userName ? userName.substring(0, 2).toUpperCase() : '??';
                const actionText = act?.action || "melakukan aksi.";
                const timeAgo = act?.time ? 
                                formatDistanceToNow(new Date(act.time), { addSuffix: true, locale: id }) :
                                "beberapa waktu lalu";
                
                return (
                    <li key={act?.id || index} className="activity-item">
                        <div className="activity-item__avatar">{userInitials}</div>
                        <div className="activity-item__content">
                            <p><strong>{userName}</strong> {actionText}</p>
                            <span className="activity-item__timestamp">{timeAgo}</span>
                        </div>
                    </li>
                );
            }) : <p>Tidak ada aktivitas terbaru.</p>}
        </ul>
    </div>
);

// Komponen utama Analytics
const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State baru untuk menyimpan pesan error

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            setError(null); // Reset error setiap kali fetch
            try {
                const response = await api.get('/admin/analytics');
                setData(response.data);
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message || "Gagal memuat data analitik.";
                console.error("Gagal memuat data analitik:", errorMessage);
                toast.error(errorMessage);
                setError(errorMessage); // Simpan pesan error
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                <div className="spinner"></div>
            </div>
        );
    }
    
    // Jika ada error setelah loading selesai, tampilkan pesan error
    if (error && !data) {
        return <div className="card"><p>Terjadi kesalahan: {error}</p></div>;
    }

    // Pemeriksaan keamanan utama: jika data tetap null, jangan coba render
    if (!data) {
        return <div className="card"><p>Data analitik tidak dapat ditampilkan.</p></div>;
    }
    
    // Menggunakan object kosong sebagai fallback untuk mencegah error
    const kpi = data.kpi || {};
    const kpiData = [
        { title: 'Total Revenue (30d)', value: `Rp ${(kpi.totalRevenue?.value || 0).toLocaleString('id-ID')}`, icon: <FaDollarSign />, change: kpi.totalRevenue?.change },
        { title: 'New Subscriptions (30d)', value: kpi.newSubscriptions?.value || 0, icon: <FaShoppingCart />, change: kpi.newSubscriptions?.change },
        { title: 'New Users (30d)', value: kpi.newUsers?.value || 0, icon: <FaUsers />, change: kpi.newUsers?.change },
    ];

    return (
        <div className="analytics-container">
            <h1 className="heading heading--primary">Analytics Overview</h1>
            <div className="kpi-grid">
                {kpiData.map((item, index) => ( <KpiCard key={index} {...item} /> ))}
            </div>
            <div className="dashboard-main-grid">
                <div className="card chart-card">
                    <h3 className="heading heading--tertiary">Tren Pendapatan (30 Hari Terakhir)</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={data.revenueChartData || []} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(value) => value > 0 ? `${value / 1000}k` : '0'} tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                                <Legend />
                                <Area type="monotone" dataKey="Pendapatan" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="dashboard-sidebar">
                    <div className="card">
                        <h3 className="heading heading--tertiary">Paket Terlaris</h3>
                        <ul className="progress-list">
                            {(data.topPlansData || []).map((plan, index) => (
                                <li key={plan?.name || index}>
                                    <div className="progress-list__label">
                                        <span>{plan?.name || 'N/A'}</span>
                                        <span>{plan?.percentage || 0}%</span>
                                    </div>
                                    <div className="progress-bar"><div className="progress-bar__inner" style={{ width: `${plan?.percentage || 0}%` }}></div></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <RecentActivity activities={data.recentActivityData} />
                </div>
            </div>
        </div>
    );
};

export default Analytics;

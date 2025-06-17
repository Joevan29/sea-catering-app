import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
// Impor ikon dan helper baru
import { FaUsers, FaDollarSign, FaShoppingCart, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

// Komponen KpiCard yang sudah di-upgrade
const KpiCard = ({ title, value, icon, change }) => {
    const isIncrease = change >= 0;
    const changeIcon = isIncrease ? <FaArrowUp /> : <FaArrowDown />;
    const changeClass = isIncrease ? 'increase' : 'decrease';

    return (
        <div className="card kpi-card">
            <div className="kpi-card__icon-wrapper">{icon}</div>
            <div className="kpi-card__info">
                <p className="kpi-card__title">{title}</p>
                <p className="kpi-card__value">{value}</p>
                {/* Tampilkan data perbandingan */}
                <span className={`kpi-card__change ${changeClass}`}>
                    {changeIcon}
                    {Math.abs(change)}% vs 30 hari sebelumnya
                </span>
            </div>
        </div>
    );
};

// Komponen baru untuk Aktivitas Terbaru
const RecentActivity = ({ activities }) => (
    <div className="card">
        <h3 className="heading heading--tertiary">Aktivitas Terbaru</h3>
        <ul className="activity-feed">
            {activities.length > 0 ? activities.map(act => (
                <li key={act.id} className="activity-item">
                    <div className="activity-item__avatar">{act.user ? act.user.substring(0, 2) : '??'}</div>
                    <div className="activity-item__content">
                        <p><strong>{act.user}</strong> {act.action}</p>
                        <span className="activity-item__timestamp">
                            {formatDistanceToNow(new Date(act.time), { addSuffix: true, locale: id })}
                        </span>
                    </div>
                </li>
            )) : <p>Tidak ada aktivitas terbaru.</p>}
        </ul>
    </div>
);

// Komponen utama Analytics
const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const response = await api.get('/admin/analytics');
                setData(response.data);
            } catch (error) {
                console.error("Gagal memuat data analitik", error);
                toast.error("Gagal memuat data analitik.");
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
    
    if (!data) {
        return <div className="card"><p>Data analitik tidak tersedia atau gagal dimuat.</p></div>;
    }
    
    // Menyesuaikan data KPI dengan struktur baru dari backend
    const kpi = data.kpi || {};
    const kpiData = [
        { title: 'Total Revenue (30d)', value: `Rp ${(kpi.totalRevenue?.value || 0).toLocaleString('id-ID')}`, icon: <FaDollarSign />, change: kpi.totalRevenue?.change ?? 0 },
        { title: 'New Subscriptions (30d)', value: kpi.newSubscriptions?.value || 0, icon: <FaShoppingCart />, change: kpi.newSubscriptions?.change ?? 0 },
        { title: 'New Users (30d)', value: kpi.newUsers?.value || 0, icon: <FaUsers />, change: kpi.newUsers?.change ?? 0 },
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
                            {/* Menggunakan AreaChart untuk visualisasi yang lebih baik */}
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
                            {(data.topPlansData || []).map(plan => (
                                <li key={plan.name}>
                                    <div className="progress-list__label">
                                        <span>{plan.name}</span>
                                        <span>{plan.percentage}%</span>
                                    </div>
                                    <div className="progress-bar"><div className="progress-bar__inner" style={{ width: `${plan.percentage}%` }}></div></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Menampilkan komponen Aktivitas Terbaru */}
                    <RecentActivity activities={data.recentActivityData || []} />
                </div>
            </div>
        </div>
    );
};

export default Analytics;

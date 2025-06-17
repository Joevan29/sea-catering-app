// client/src/components/admin/pages/Analytics.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import { FaUsers, FaDollarSign, FaShoppingCart, FaUserPlus } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const KpiCard = ({ title, value, icon }) => (
    <div className="card kpi-card">
        <div className="kpi-card__icon-wrapper">{icon}</div>
        <div className="kpi-card__info">
            <p className="kpi-card__title">{title}</p>
            <p className="kpi-card__value">{value}</p>
        </div>
    </div>
);

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
    
    const kpi = data.kpi || {};
    const kpiData = [
      { title: 'Total Revenue', value: `Rp ${(kpi.totalRevenue || 0).toLocaleString('id-ID')}`, icon: <FaDollarSign /> },
      { title: 'New Subscriptions (30 hari)', value: kpi.newSubscriptions || 0, icon: <FaShoppingCart /> },
      { title: 'Subscription Growth', value: kpi.subscriptionGrowth || 0, icon: <FaUsers /> },
      { title: 'New Users This Month', value: kpi.newUsersThisMonth || 0, icon: <FaUserPlus /> },
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
                            <LineChart data={data.revenueChartData || []} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                {/* PERBAIKAN ADA DI SINI */}
                                <XAxis 
                                    dataKey="name" 
                                    angle={-45} // Memiringkan label tanggal
                                    textAnchor="end"
                                    height={60}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                                <Legend />
                                <Line type="monotone" dataKey="Pendapatan" stroke="var(--color-primary)" strokeWidth={2} />
                            </LineChart>
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
                    {/* ... (bagian aktivitas terbaru) ... */}
                </div>
            </div>
        </div>
    );
};

export default Analytics;

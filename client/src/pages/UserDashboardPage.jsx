import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await api.get('/subscriptions/mine');
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Gagal memuat data langganan", error);
        toast.error("Tidak dapat memuat data langganan Anda.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h1 className="heading heading--secondary">Selamat Datang, {user?.fullName}!</h1>
        <p>Kelola informasi langganan dan preferensi Anda di bawah ini.</p>
      </div>

      {loading ? (
        <div className="card" style={{textAlign: 'center'}}>Memuat data langganan...</div>
      ) : subscriptions.length === 0 ? (
        <div className="card" style={{textAlign: 'center'}}>
            <h2 className="heading heading--tertiary">Anda Belum Berlangganan</h2>
            <p>Sepertinya Anda belum memiliki paket aktif. Mulai hidup sehat Anda sekarang!</p>
        </div>
      ) : (
        subscriptions.map(sub => (
          <div key={sub.id} className="card">
            <h2 className="heading heading--tertiary">Langganan Aktif Anda (ID: {sub.id})</h2>
            <div className="subscription-details">
              <div className="detail-item">
                <span>Status</span>
                <strong className={`status-badge status--${sub.status.toLowerCase()}`}>{sub.status}</strong>
              </div>
              <div className="detail-item">
                <span>Paket</span>
                <strong>{sub.plan_name}</strong>
              </div>
              <div className="detail-item">
                <span>Tipe Makanan</span>
                <strong>{sub.meal_types.join(', ')}</strong>
              </div>
              <div className="detail-item">
                <span>Hari Pengiriman</span>
                <strong>{sub.delivery_days.join(', ')}</strong>
              </div>
              <div className="detail-item">
                <span>Total Harga Bulanan</span>
                <strong style={{ color: 'var(--color-primary)' }}>Rp {parseFloat(sub.total_price).toLocaleString('id-ID')}</strong>
              </div>
            </div>
            <div className="subscription-actions">
              <button className="btn btn--secondary">Pause Subscription</button>
              <button className="btn btn--danger">Cancel Subscription</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserDashboardPage;
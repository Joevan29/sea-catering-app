import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const response = await api.get('/admin/subscriptions');
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Gagal memuat data langganan", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="card">
      <h2 className="heading heading--tertiary">Manajemen Semua Langganan</h2>
      {subscriptions.length === 0 ? (
        <p>Belum ada data langganan yang masuk.</p>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Pelanggan</th>
                <th>Paket</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map(sub => (
                <tr key={sub.id}>
                  <td>{sub.id}</td>
                  <td>{sub.full_name}</td>
                  <td>{sub.plan_name}</td>
                  <td><span className={`status-badge status--${sub.status.toLowerCase()}`}>{sub.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default SubscriptionManagement;
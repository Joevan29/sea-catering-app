import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboardPage from './AdminDashboardPage';
import UserDashboardPage from './UserDashboardPage';

// Komponen untuk menampilkan loading spinner
const LoadingComponent = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
    <div className="spinner"></div>
  </div>
);

const DashboardPage = () => {
  // Kita asumsikan AuthContext akan menyediakan state `user` dan `loading`
  const { user, loading } = useAuth();

  // Jika masih loading atau user belum terdefinisi, tampilkan spinner
  if (loading || !user) {
    return <LoadingComponent />;
  }

  // Ini adalah logika pintar Anda:
  // Tampilkan komponen yang sesuai berdasarkan role user.
  return user.role === 'admin' ? <AdminDashboardPage /> : <UserDashboardPage />;
};

export default DashboardPage;
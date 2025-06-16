import React, { useState } from 'react';
import AdminSidebar from '../components/admin/pages/AdminSidebar';
import Analytics from '../components/admin/pages/Analytics';
import SubscriptionManagement from '../components/admin/pages/SubscriptionManagement';
import UserManagement from '../components/admin/pages/UserManagement';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  // State untuk menentukan halaman aktif mana yang ditampilkan
  const [activePage, setActivePage] = useState('analytics');

  // Fungsi untuk merender komponen halaman berdasarkan state activePage
  const renderContent = () => {
    switch (activePage) {
      case 'analytics':
        return <Analytics />;
      case 'subscriptions':
        return <SubscriptionManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <Analytics />;
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="heading heading--secondary">Admin Control Panel</h1>
        <p>Selamat datang kembali, {user?.fullName}.</p>
      </div>

      <div className="admin-layout">
        <AdminSidebar activePage={activePage} setActivePage={setActivePage} />
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
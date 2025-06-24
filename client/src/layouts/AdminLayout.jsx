// client/src/layouts/AdminLayout.jsx

import React, { useState } from 'react'; // 1. Import useState
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 2. Tambahkan state untuk mengontrol menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { path: '/admin', label: 'Analytics' },
    { path: '/admin/subscriptions', label: 'Langganan' },
    { path: '/admin/users', label: 'User' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 3. Fungsi untuk toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="admin-layout--final">
      <header className="admin-topbar">
        <div className="admin-topbar__left">
          <span className="admin-topbar__brand">SEA CATERING ADMIN</span>
        </div>

        {/* 4. Ini tombol hamburger baru kita */}
        <button
          className={`admin-topbar__toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        
        {/* 5. Ini pembungkus menu yang akan disembunyikan/ditampilkan */}
        <div className={`admin-topbar__menu ${isMenuOpen ? 'open' : ''}`}>
          <nav className="admin-topbar__nav">
            {menuItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => `admin-topbar__link ${isActive ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)} // Tutup menu saat link diklik
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="admin-topbar__right">
            {/* Sapaan "Hi, Admin" telah dihapus sesuai permintaan */}
            <button onClick={handleLogout} className="btn btn--danger btn--sm">
              <FaSignOutAlt style={{ marginRight: '8px' }}/>
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="admin-main-content">
        <div className="admin-page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

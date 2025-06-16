// client/src/layouts/AdminLayout.jsx

import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', label: 'Analytics' },
    { path: '/admin/subscriptions', label: 'Langganan' },
    { path: '/admin/users', label: 'User' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-layout--final">
      <header className="admin-topbar">
        <div className="admin-topbar__left">
          <span className="admin-topbar__brand">SEA CATERING ADMIN</span>
          <nav className="admin-topbar__nav">
            {menuItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => `admin-topbar__link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="admin-topbar__right">
          <span className="navbar__user-greeting">Hi, {user?.fullName}!</span>
          <button onClick={handleLogout} className="btn btn--danger btn--sm">
            <FaSignOutAlt style={{ marginRight: '8px' }}/>
            Logout
          </button>
        </div>
      </header>

      {/* Perubahan utama ada di sini */}
      <main className="admin-main-content">
        <div className="admin-page-container">
          <Outlet /> {/* Outlet sekarang di dalam container ber-padding */}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
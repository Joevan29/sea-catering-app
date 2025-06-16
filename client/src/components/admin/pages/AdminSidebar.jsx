import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaChartBar, FaFileInvoiceDollar, FaUsers } from 'react-icons/fa';

const AdminSidebar = () => {
  const menuItems = [
    { path: '/admin', label: 'Analytics' },
    { path: '/admin/subscriptions', label: 'Langganan' },
    { path: '/admin/users', label: 'User' },
  ];

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-sidebar__brand">
          <Link to="/" style={{ textDecoration: 'none' }}>
             <h3>SEA Catering</h3>
             <span>Admin Panel</span>
          </Link>
        </div>
        <nav>
          <ul className="admin-sidebar__menu">
            {menuItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) => `admin-sidebar__button ${isActive ? 'active' : ''}`}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
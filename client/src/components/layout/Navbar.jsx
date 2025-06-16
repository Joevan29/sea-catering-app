// client/src/components/layout/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Ini adalah fungsi pembantu untuk merender link yang benar
  const renderNavLinks = () => {
    // Link yang selalu ada untuk semua orang
    const publicLinks = (
      <>
        <li><NavLink to="/" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>Home</NavLink></li>
        <li><NavLink to="/menu" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>Meal Plans</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>Contact Us</NavLink></li>
      </>
    );

    // Jika tidak login, hanya tampilkan link publik
    if (!isAuthenticated) {
      return publicLinks;
    }

    // Jika login, tampilkan link publik ditambah link sesuai role
    if (user.role === 'admin') {
      return (
        <>
          {publicLinks}
          <li><NavLink to="/admin" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>Admin</NavLink></li>
        </>
      );
    }

    if (user.role === 'user') {
      return (
        <>
          {publicLinks}
          <li><NavLink to="/subscribe" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>Subscription</NavLink></li>
          <li><NavLink to="/dashboard" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>Dashboard</NavLink></li>
        </>
      );
    }

    // Default (jika role tidak terdefinisi, dll)
    return publicLinks;
  };

  return (
    <nav className="navbar">
      <div className="navbar__container container">
        <NavLink to="/" className="navbar__brand">
          SEA Catering
        </NavLink>

        <div className="navbar__toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </div>

        <div className={`navbar__menu ${isMenuOpen ? 'navbar__menu--open' : ''}`}>
          <ul className="navbar__links">
            {renderNavLinks()}
          </ul>

          <div className="navbar__auth">
            {isAuthenticated ? (
              <>
                <span className="navbar__user-greeting">Hi, {user?.fullName}!</span>
                <button onClick={handleLogout} className="btn btn--danger">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn-login">Login</NavLink>
                <NavLink to="/register" className="btn btn--primary">Register</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
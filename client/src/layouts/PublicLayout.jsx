import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PublicLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="container">
        <Outlet /> {/* Ini adalah tempat halaman publik (Home, Menu, dll) akan muncul */}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
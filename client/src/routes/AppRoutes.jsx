// client/src/routes/AppRoutes.jsx

import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardPage from '../pages/DashboardPage'; // <-- IMPORT HALAMAN BARU

// --- Buat komponen loading untuk Suspense ---
const LoadingComponent = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
    <div className="spinner"></div>
  </div>
);

// Lazy load untuk halaman lain
const HomePage = lazy(() => import('../pages/HomePage'));
const MenuPage = lazy(() => import('../pages/MenuPage'));
const SubscriptionPage = lazy(() => import('../pages/SubscriptionPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- PERUBAHAN UTAMA DI SINI --- */}
        {/* Semua rute yang butuh login sekarang mengarah ke satu pintu */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/subscribe" 
          element={
            <ProtectedRoute>
              <SubscriptionPage />
            </ProtectedRoute>
          } 
        />
        {/* ------------------------------------ */}
        
        <Route path="*" element={<div className="container card"><h2>404: Halaman Tidak Ditemukan</h2></div>} />
      </Routes>
    </Suspense>
  );
};
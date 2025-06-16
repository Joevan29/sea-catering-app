// client/src/App.jsx

import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Proteksi Rute
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Halaman-halaman
const HomePage = lazy(() => import('./pages/HomePage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const UserDashboardPage = lazy(() => import('./pages/UserDashboardPage'));
const Analytics = lazy(() => import('./components/admin/pages/Analytics'));
const SubscriptionManagement = lazy(() => import('./components/admin/pages/SubscriptionManagement'));
const UserManagement = lazy(() => import('./components/admin/pages/UserManagement'));

const LoadingComponent = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
    </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ToastContainer position="bottom-right" autoClose={4000} hideProgressBar={false} theme="colored" />
      <Routes>
        {/* Dunia Publik & User */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
          <Route path="/subscribe" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
        </Route>

        {/* Dunia Khusus Admin */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin" element={<Analytics />} />
          <Route path="/admin/subscriptions" element={<SubscriptionManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
        </Route>
        
        <Route path="*" element={<div className="container card" style={{textAlign: 'center'}}><h2>404: Halaman Tidak Ditemukan</h2></div>} />
      </Routes>
    </Suspense>
  );
}

export default App;
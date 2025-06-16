import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Ambil state awal langsung dari localStorage
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('userToken') || null);
  // Loading tidak lagi dibutuhkan untuk verifikasi awal
  const [loading, setLoading] = useState(false); 

  // Fungsi register tetap sama, hanya memanggil API
  const register = async (fullName, email, password) => {
    return api.post('/auth/register', { fullName, email, password });
  };

  // Fungsi login yang sudah disempurnakan
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data) {
        const { token, ...userData } = response.data;
        
        // 1. Simpan token DAN data user ke localStorage
        localStorage.setItem('userToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 2. Update header default axios untuk request selanjutnya
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // 3. Update state di React
        setToken(token);
        setUser(userData);
        
        toast.success(`Selamat datang kembali, ${userData.fullName}!`);
        return userData; // Kembalikan data untuk redirect
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Hapus semua data sesi
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    toast.info("Anda telah logout.");
  };

  // Kirim state dan fungsi ke seluruh aplikasi
  const value = { user, token, loading, isAuthenticated: !!user, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
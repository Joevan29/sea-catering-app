import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Pastikan port backend Anda benar
});

// Interceptor untuk MENEMPELKAN token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk MENANGANI error secara global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tampilkan notifikasi error yang informatif
    const message = error.response?.data?.message || error.message || 'Terjadi kesalahan jaringan';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
import axios from 'axios';
import { toast } from 'react-toastify';

// Membuat instance axios
const api = axios.create({
  // ==========================================================
  // INI PERBAIKANNYA: Menggunakan Environment Variable
  // ==========================================================
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
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
    const message = error.response?.data?.message || error.message || 'Terjadi kesalahan jaringan';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;

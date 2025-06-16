import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // State loading lokal untuk tombol
    try {
      const userData = await login(email, password); // Panggil fungsi login dari context
      
      // Redirect berdasarkan role dari data yang dikembalikan backend
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      // Error message sudah dihandle oleh interceptor axios, 
      // kita hanya perlu log di console jika perlu
      console.error("Login attempt failed:", error);
    } finally {
      setLoading(false);
    }
};

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 className="heading heading--secondary" style={{ textAlign: 'center' }}>Selamat Datang Kembali</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__group">
            <label htmlFor="email" className="form__label">Alamat Email</label>
            <input id="email" type="email" className="form__input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form__group">
            <label htmlFor="password" className="form__label">Password</label>
            <input id="password" type="password" className="form__input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>Belum punya akun? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>Daftar di sini</Link></p>
      </div>
    </div>
  );
};
export default LoginPage;
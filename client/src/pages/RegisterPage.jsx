import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser(data.fullName, data.email, data.password);
      toast.success('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (error) {
      // Error sudah ditangani interceptor, jadi tidak perlu toast lagi di sini
      console.error(error);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 className="heading heading--secondary" style={{ textAlign: 'center' }}>Buat Akun Baru Anda</h2>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form__group">
            <label htmlFor="fullName" className="form__label">Nama Lengkap</label>
            <input id="fullName" type="text" className={`form__input ${errors.fullName ? 'form__input--error' : ''}`} {...register('fullName', { required: 'Nama lengkap wajib diisi' })} />
            {errors.fullName && <p className="form__error-message">{errors.fullName.message}</p>}
          </div>
          <div className="form__group">
            <label htmlFor="email" className="form__label">Email</label>
            <input id="email" type="email" className={`form__input ${errors.email ? 'form__input--error' : ''}`} {...register('email', { required: 'Email wajib diisi', pattern: { value: /^\S+@\S+$/i, message: 'Format email tidak valid' } })} />
            {errors.email && <p className="form__error-message">{errors.email.message}</p>}
          </div>
          <div className="form__group">
            <label htmlFor="password" className="form__label">Password</label>
            <input id="password" type="password" className={`form__input ${errors.password ? 'form__input--error' : ''}`} {...register('password', { required: 'Password wajib diisi', minLength: { value: 8, message: 'Password minimal 8 karakter' } })} />
            {errors.password && <p className="form__error-message">{errors.password.message}</p>}
          </div>
          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Mendaftar...' : 'Register'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>Sudah punya akun? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>Login di sini</Link></p>
      </div>
    </div>
  );
};
export default RegisterPage;
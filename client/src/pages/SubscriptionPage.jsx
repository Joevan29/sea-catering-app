// client/src/pages/SubscriptionPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const planPrices = { 'Diet Plan': 30000, 'Protein Plan': 40000, 'Royal Plan': 60000 };
const mealOptions = ['Breakfast', 'Lunch', 'Dinner'];
const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SubscriptionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phoneNumber: '',
    plan: 'Diet Plan',
    mealTypes: [],
    deliveryDays: [],
    allergies: '',
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { plan, mealTypes, deliveryDays } = formData;
    if (plan && mealTypes.length > 0 && deliveryDays.length > 0) {
      const price = planPrices[plan] * mealTypes.length * deliveryDays.length * 4.3;
      setTotalPrice(price);
    } else {
      setTotalPrice(0);
    }
  }, [formData]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.mealTypes.length === 0 || formData.deliveryDays.length === 0) {
      toast.error('Harap pilih Tipe Makanan dan Hari Pengiriman.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/subscriptions', formData);
      toast.success('Langganan Anda berhasil dibuat!');
      navigate('/dashboard');
    } catch (error) {
      console.error("Subscription failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form id="subscriptionForm" className="subscription-layout" onSubmit={handleSubmit}>
        <div className="form-column">
          <div className="card">
            <h1 className="heading heading--secondary">Formulir Berlangganan</h1>
            <p>Lengkapi data di bawah ini untuk memulai hidup sehat Anda.</p>
          </div>

          <div className="card">
            <h2 className="heading heading--tertiary">Langkah 1: Informasi Pribadi</h2>
            <div className="form__group">
              <label htmlFor="fullName" className="form__label">Nama Lengkap *</label>
              <input id="fullName" name="fullName" type="text" className="form__input" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className="form__group">
              <label htmlFor="phoneNumber" className="form__label">Nomor Telepon Aktif *</label>
              <input id="phoneNumber" name="phoneNumber" type="tel" className="form__input" value={formData.phoneNumber} onChange={handleChange} required />
            </div>
          </div>

          <div className="card">
            <h2 className="heading heading--tertiary">Langkah 2: Kustomisasi Paket</h2>
            <div className="form__group">
              <label htmlFor="plan" className="form__label">Pilihan Paket *</label>
              <select id="plan" name="plan" className="form__select" value={formData.plan} onChange={handleChange}>
                <option value="Diet Plan">Diet Plan - Rp 30.000/meal</option>
                <option value="Protein Plan">Protein Plan - Rp 40.000/meal</option>
                <option value="Royal Plan">Royal Plan - Rp 60.000/meal</option>
              </select>
            </div>
            <div className="form__group">
              <label className="form__label">Pilih Tipe Makanan (minimal 1) *</label>
              <div className="checkbox-grid">
                {mealOptions.map(meal => (
                  <label key={meal} className="custom-checkbox"> {meal}
                    <input type="checkbox" value={meal} checked={formData.mealTypes.includes(meal)} onChange={(e) => handleCheckboxChange(e, 'mealTypes')} />
                    <span className="checkmark"></span>
                  </label>
                ))}
              </div>
            </div>
             <div className="form__group">
              <label className="form__label">Pilih Hari Pengiriman (minimal 1) *</label>
              <div className="checkbox-grid">
                {dayOptions.map(day => (
                  <label key={day} className="custom-checkbox"> {day}
                    <input type="checkbox" value={day} checked={formData.deliveryDays.includes(day)} onChange={(e) => handleCheckboxChange(e, 'deliveryDays')} />
                    <span className="checkmark"></span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form__group">
              <label htmlFor="allergies" className="form__label">Alergi atau pantangan makanan (jika ada)</label>
              <textarea id="allergies" name="allergies" className="form__textarea" rows="3" placeholder="Contoh: alergi udang, tidak suka pedas" value={formData.allergies} onChange={handleChange}></textarea>
            </div>
          </div>
        </div>

        <div className="summary-column">
          <div className="card summary-card">
            <h2 className="heading heading--tertiary">Ringkasan Pesanan</h2>
            <div className="summary-item">
              <span>Paket:</span>
              <strong>{formData.plan}</strong>
            </div>
            <div className="summary-item">
              <span>Tipe Makanan:</span>
              <span>{formData.mealTypes.length > 0 ? formData.mealTypes.join(', ') : '-'}</span>
            </div>
            <div className="summary-item">
              <span>Hari Pengiriman:</span>
              <span>{formData.deliveryDays.length > 0 ? formData.deliveryDays.length + ' hari' : '-'}</span>
            </div>
            <hr className="summary-divider"/>
            <div className="summary-item summary-total">
              <span>Total Harga Bulanan</span>
              <strong>Rp {totalPrice.toLocaleString('id-ID')}</strong>
            </div>
            <button type="submit" className="btn btn--accent" style={{width: '100%', marginTop: '1rem'}} disabled={loading || totalPrice === 0}>
              {loading ? 'Memproses...' : 'Konfirmasi & Berlangganan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionPage;
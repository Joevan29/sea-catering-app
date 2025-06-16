// client/src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaLeaf, FaTruck, FaChartBar, FaShieldAlt } from 'react-icons/fa';

const features = [
    { icon: <FaLeaf size={30} className="feature-card__icon" />, title: 'Kustomisasi Menu', description: 'Pilih menu sesuai selera dan kebutuhan kalori harian Anda.'},
    { icon: <FaTruck size={30} className="feature-card__icon" />, title: 'Pengiriman Luas', description: 'Kami menjangkau semua kota besar di Indonesia, tepat waktu.'},
    { icon: <FaChartBar size={30} className="feature-card__icon" />, title: 'Informasi Nutrisi', description: 'Setiap menu dilengkapi data makro & mikro nutrisi yang akurat.'},
    { icon: <FaShieldAlt size={30} className="feature-card__icon" />, title: 'Higienis & Aman', description: 'Diproses di dapur berstandar tinggi untuk menjamin kebersihan.'},
];

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoadingTestimonials(true);
      try {
        const response = await api.get('/testimonials');
        setTestimonials(response.data);
      } catch (error) {
        console.error("Gagal memuat testimoni", error);
        toast.error("Gagal memuat testimoni.");
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
  }, []);

  const onReviewSubmit = async (data) => {
    try {
      const response = await api.post('/testimonials', data);
      setTestimonials(prevTestimonials => [response.data, ...prevTestimonials]);
      toast.success("Terima kasih! Review Anda berhasil dikirim.");
      reset();
    } catch (error) {
      console.error("Gagal mengirim review:", error);
      // Toast error sudah otomatis dari interceptor api.js
    }
  };

  return (
    <div className="homepage-container">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section homepage-section">
        <div className="hero-section__content">
          <h1 className="heading heading--primary">
            Makanan Sehat, Hidup Lebih Mudah.
          </h1>
          <p className="hero-section__subtitle">
            Lupakan repotnya memasak. SEA Catering mengantarkan makanan sehat dan lezat yang dirancang khusus untuk Anda, langsung ke depan pintu Anda.
          </p>
          <div className="hero-section__actions">
            <Link to="/menu" className="btn btn--accent">Lihat Paket Menu</Link>
            <Link to="/subscribe" className="btn btn--primary">Berlangganan Sekarang</Link>
          </div>
        </div>
        <div className="hero-section__image-container">
          <img 
            src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Makanan sehat dalam mangkuk" 
            className="hero-section__image"
          />
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features-section homepage-section">
        <h2 className="heading heading--secondary text-center">Kenapa Memilih SEA Catering?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              {feature.icon}
              <h3 className="heading--tertiary">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* ===== TESTIMONIAL & FORM SECTION ===== */}
      <section className="testimonial-form-section homepage-section">
        <div className="testimonial-wrapper">
          <h2 className="heading heading--secondary">Apa Kata Mereka?</h2>
          {loadingTestimonials ? (
            <div className="card"><p>Loading testimoni...</p></div>
          ) : testimonials.length === 0 ? (
            <div className="card"><p>Jadilah yang pertama memberikan review!</p></div>
          ) : (
            <div className="testimonial-list" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="card">
                  <p style={{ fontStyle: 'italic' }}>"{testimonial.review_message}"</p>
                  <p style={{ marginTop: '1rem' }}>
                    <strong>- {testimonial.customer_name}</strong> ({'⭐️'.repeat(testimonial.rating)})
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="form-wrapper">
          <h2 className="heading heading--secondary">Bagikan Pengalaman Anda</h2>
          {isAuthenticated ? (
            <form className="form card" onSubmit={handleSubmit(onReviewSubmit)}>
              <div className="form__group">
                <p>Anda akan mereview sebagai: <strong>{user?.fullName}</strong></p>
              </div>
              <div className="form__group">
                <label htmlFor="reviewMessage" className="form__label">Review Anda</label>
                <textarea id="reviewMessage" className="form__textarea" rows="4" placeholder="Tulis pengalaman Anda di sini..." {...register('reviewMessage', { required: "Review tidak boleh kosong" })} />
                {errors.reviewMessage && <p className="form__error-message">{errors.reviewMessage.message}</p>}
              </div>
              <div className="form__group">
                <label htmlFor="rating" className="form__label">Rating (1-5)</label>
                <input id="rating" type="number" className="form__input" min="1" max="5" {...register('rating', { required: "Rating wajib diisi", min: 1, max: 5 })} />
                {errors.rating && <p className="form__error-message">{errors.rating.message}</p>}
              </div>
              <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim...' : 'Kirim Review'}
              </button>
            </form>
          ) : (
            <div className="card">
              <p>Anda harus <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>login</Link> terlebih dahulu untuk memberikan review.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
// client/src/pages/MenuPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const mealPlansData = [
  {
    id: 1,
    name: 'Diet Plan',
    price: '30.000',
    shortDesc: 'Rendah kalori dan tinggi serat untuk membantu program diet Anda.',
    fullDesc: 'Paket Diet Plan dirancang oleh ahli gizi kami untuk memastikan asupan kalori yang terkontrol tanpa mengorbankan rasa. Menu bervariasi setiap hari dengan bahan-bahan segar pilihan.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80',
  },
  {
    id: 2,
    name: 'Protein Plan',
    price: '40.000',
    shortDesc: 'Tinggi protein untuk mendukung pembentukan massa otot.',
    fullDesc: 'Sangat cocok untuk Anda yang aktif berolahraga. Setiap porsi Protein Plan kaya akan protein berkualitas tinggi dari sumber hewani dan nabati untuk memaksimalkan hasil latihan Anda.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',
  },
  {
    id: 3,
    name: 'Royal Plan',
    price: '60.000',
    shortDesc: 'Menu premium dengan bahan-bahan organik dan impor terbaik.',
    fullDesc: 'Rasakan kemewahan dalam setiap gigitan. Royal Plan menggunakan bahan-bahan eksklusif seperti Salmon Norwegia, Wagyu, dan sayuran organik untuk pengalaman kuliner sehat yang tak terlupakan.',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80',
  },
];

const MenuPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    document.body.id = 'menu-page';
    return () => {
      document.body.id = '';
    };
  }, []);

  return (
    // Container utama untuk menjaga padding dan lebar halaman
    <div className="container">
      {/* KITA MENGHAPUS <div className="card"> YANG MEMBUNGKUS SEMUANYA.
        Ini adalah perbaikan utamanya. Header dan Grid sekarang langsung di dalam container.
      */}
      <div className="section-header">
        <h1 className="heading heading--secondary">Pilihan Paket Makanan Sehat Kami</h1>
        <p className="section-subtitle">Pilih paket yang paling sesuai dengan tujuan dan gaya hidup Anda.</p>
      </div>

      <div className="features-grid">
        {mealPlansData.map((plan) => (
          // Setiap item di dalam grid adalah sebuah .card
          <div key={plan.id} className="card">
            <img src={plan.image} alt={plan.name} className="card__image" />
            <div className="card__content">
              <h3 className="heading heading--tertiary">{plan.name}</h3>
              {/* Menggunakan className agar mudah di-style oleh CSS */}
              <p className="card__price">Rp {plan.price}/meal</p>
              <p className="card__description">{plan.shortDesc}</p>
              <button onClick={() => setSelectedPlan(plan)} className="btn btn--primary">
                Lihat Detail
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal akan muncul jika selectedPlan memiliki data */}
      {selectedPlan && (
        <div className="modal">
          <div className="modal__content">
            <button className="modal__close" onClick={() => setSelectedPlan(null)}>&times;</button>
            <img src={selectedPlan.image} alt={selectedPlan.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--border-radius)', marginBottom: 'var(--space-lg)' }}/>
            <h2 className="heading heading--secondary">{selectedPlan.name}</h2>
            <h3 className="heading heading--tertiary" style={{ color: 'var(--color-primary)' }}>
              Rp {selectedPlan.price}/meal
            </h3>
            <p style={{ marginTop: 'var(--space-md)' }}>{selectedPlan.fullDesc}</p>
            <Link to="/subscribe" className="btn btn--accent" style={{ width: '100%', marginTop: 'var(--space-lg)' }}>Pilih Paket Ini</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;

// client/src/pages/ContactPage.jsx

import React, { useEffect } from 'react';
import { FaUserTie, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const ContactPage = () => {
    
  // WAJIB: Menambahkan ID ke body agar CSS spesifik bisa bekerja
  useEffect(() => {
    document.body.id = 'contact-page';
    // Membersihkan ID saat komponen dilepas (unmount)
    return () => {
      document.body.id = '';
    };
  }, []);

  return (
    <div className="container">
      {/* Card terluar ini sekarang diatur agar rapi di tengah halaman
        oleh CSS di #contact-page .container > .card
      */}
      <div className="card">
        <div className="section-header">
          <h1 className="heading heading--secondary">Hubungi Kami</h1>
          <p className="section-subtitle">Kami siap membantu menjawab pertanyaan Anda seputar layanan kami.</p>
        </div>

        {/* .contact-info-wrapper sekarang dipaksa menjadi tumpukan vertikal
          oleh CSS di #contact-page .contact-info-wrapper
        */}
        <div className="contact-info-wrapper">
          <div className="contact-info-item">
            <FaUserTie className="contact-info__icon" />
            <div className="contact-info__content">
              <h3 className="contact-info__title">Manajer Layanan</h3>
              <p className="contact-info__detail">Brian</p>
            </div>
          </div>

          <div className="contact-info-item">
            <FaPhoneAlt className="contact-info__icon" />
            <div className="contact-info__content">
              <h3 className="contact-info__title">Telepon / WhatsApp</h3>
              <p className="contact-info__detail">0812-3456-789</p>
            </div>
          </div>
          
          <div className="contact-info-item">
            <FaEnvelope className="contact-info__icon" />
            <div className="contact-info__content">
              <h3 className="contact-info__title">Email</h3>
              <p className="contact-info__detail">contact@seacatering.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

import React from 'react';
import { FaUserTie, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const ContactPage = () => {
  return (
    // Kita gunakan .container untuk padding dan layout yang konsisten
    <div className="container">
      <div className="card">
        <div style={{ textAlign: 'center' }}>
          <h1 className="heading heading--secondary">Hubungi Kami</h1>
          <p>Kami siap membantu menjawab pertanyaan Anda seputar layanan kami.</p>
        </div>

        <div className="contact-info-wrapper">
          <div className="contact-info-item">
            <FaUserTie size={24} className="contact-info__icon" />
            <div>
              <h3 className="heading--tertiary" style={{ marginBottom: '0.25rem' }}>Manajer Layanan</h3>
              <p>Brian</p>
            </div>
          </div>
          <div className="contact-info-item">
            <FaPhoneAlt size={24} className="contact-info__icon" />
            <div>
              <h3 className="heading--tertiary" style={{ marginBottom: '0.25rem' }}>Telepon / WhatsApp</h3>
              <p>0812-3456-789</p>
            </div>
          </div>
          <div className="contact-info-item">
            <FaEnvelope size={24} className="contact-info__icon" />
            <div>
              <h3 className="heading--tertiary" style={{ marginBottom: '0.25rem' }}>Email</h3>
              <p>contact@seacatering.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
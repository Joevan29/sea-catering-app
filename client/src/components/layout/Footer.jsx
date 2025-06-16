// client/src/components/layout/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer__container">
        
        <div className="footer__section footer__about">
          <h3 className="footer__title">SEA Catering</h3>
          <p>Solusi makanan sehat, lezat, dan praktis untuk gaya hidup modern Anda. Diantar langsung ke depan pintu Anda.</p>
        </div>

        <div className="footer__section">
          <h3 className="footer__title">Navigasi</h3>
          <ul className="footer__links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Meal Plans</Link></li>
            <li><Link to="/subscribe">Berlangganan</Link></li>
          </ul>
        </div>

        <div className="footer__section">
          <h3 className="footer__title">Hubungi Kami</h3>
          <ul className="footer__links">
            <li><a href="mailto:contact@seacatering.com"><FaEnvelope /> contact@seacatering.com</a></li>
            <li><a href="#"><FaWhatsapp /> 0812-3456-7890</a></li>
          </ul>
        </div>

        <div className="footer__section">
          <h3 className="footer__title">Ikuti Kami</h3>
          <div className="footer__socials">
            <a href="#" aria-label="Instagram"><FaInstagram size={24} /></a>
            <a href="#" aria-label="WhatsApp"><FaWhatsapp size={24} /></a>
          </div>
        </div>

      </div>
      <div className="footer__copyright">
        &copy; {new Date().getFullYear()} SEA Catering. Dibuat dengan Penuh Semangat.
      </div>
    </footer>
  );
};

export default Footer;
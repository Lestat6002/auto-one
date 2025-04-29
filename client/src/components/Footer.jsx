import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Footer.scss';
import logo from '../assets/logo-white.png'; // Make sure to add this to your assets
import axios from '../services/api';


const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src={logo} alt="AUTO ONE" />
            </Link>
            <p className="footer-tagline">
              {t('footer.tagline')}
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="icon-facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="icon-instagram"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="icon-youtube"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h3>{t('footer.navigation')}</h3>
              <ul>
                <li>
                  <Link to="/">{t('navbar.home')}</Link>
                </li>
                <li>
                  <Link to="/inventory">{t('navbar.inventory')}</Link>
                </li>
                <li>
                  <Link to="/contact">{t('navbar.contact')}</Link>
                </li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>{t('footer.contactInfo')}</h3>
              <ul className="contact-info">
                <li>
                  <i className="icon-address"></i>
                  <span>Via Roma 123<br />20100 Milano, Italia</span>
                </li>
                <li>
                  <i className="icon-phone"></i>
                  <a href="tel:+391234567890">+39 123 456 7890</a>
                </li>
                <li>
                  <i className="icon-email"></i>
                  <a href="mailto:info@autoone.it">info@autoone.it</a>
                </li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>{t('footer.businessHours')}</h3>
              <ul className="business-hours">
                <li>
                  <span className="day">{t('contact.weekdays')}:</span>
                  <span className="hours">9:00 - 18:00</span>
                </li>
                <li>
                  <span className="day">{t('contact.saturday')}:</span>
                  <span className="hours">9:00 - 13:00</span>
                </li>
                <li>
                  <span className="day">{t('contact.sunday')}:</span>
                  <span className="hours">{t('contact.closed')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            &copy; {currentYear} AUTO ONE BY Alessandro. {t('footer.rightsReserved')}
          </div>
          <div className="footer-legal">
            <Link to="/privacy-policy">{t('footer.privacyPolicy')}</Link>
            <Link to="/terms">{t('footer.terms')}</Link>
            <Link to="/cookie-policy">{t('footer.cookiePolicy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../services/api';

import '../styles/Contact.scss';

const Contact = () => {
  const { t } = useTranslation();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    gdprConsent: false
  });
  
  // Form status
  const [status, setStatus] = useState({
    submitting: false,
    success: null,
    error: null
  });
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.gdprConsent) {
      setStatus({
        submitting: false,
        success: false,
        error: t('contact.gdprRequired')
      });
      return;
    }
    
    setStatus({
      submitting: true,
      success: null,
      error: null
    });
    
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/contact`, formData);
      
      setStatus({
        submitting: false,
        success: true,
        error: null
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        gdprConsent: false
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      setStatus({
        submitting: false,
        success: false,
        error: t('contact.sendError')
      });
    }
  };
  
  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.subtitle')}</p>
        </div>
      </div>
      
      <div className="container">
        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-container">
            <h2>{t('contact.formTitle')}</h2>
            
            {status.success && (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <p>{t('contact.successMessage')}</p>
              </div>
            )}
            
            {!status.success && (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">{t('contact.name')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">{t('contact.email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">{t('contact.phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">{t('contact.message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    id="gdprConsent"
                    name="gdprConsent"
                    checked={formData.gdprConsent}
                    onChange={handleChange}
                  />
                  <label htmlFor="gdprConsent">
                    {t('contact.gdprConsent')}
                  </label>
                </div>
                
                {status.error && (
                  <div className="error-message">{status.error}</div>
                )}
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={status.submitting}
                >
                  {status.submitting ? t('contact.sending') : t('contact.send')}
                </button>
              </form>
            )}
          </div>
          
          {/* Contact Info */}
          <div className="contact-info">
            <h2>{t('contact.infoTitle')}</h2>
            
            <div className="info-item">
              <div className="info-icon">
                <i className="icon-address"></i>
              </div>
              <div className="info-content">
                <h3>{t('contact.address')}</h3>
                <p>Via Roma 123<br />20100 Milano, Italia</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <i className="icon-phone"></i>
              </div>
              <div className="info-content">
                <h3>{t('contact.phoneTitle')}</h3>
                <p>
                  <a href="tel:+391234567890">+39 123 456 7890</a>
                </p>
                <p>
                  <a href="tel:+391098765432">+39 109 876 5432</a>
                </p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <i className="icon-email"></i>
              </div>
              <div className="info-content">
                <h3>{t('contact.emailTitle')}</h3>
                <p>
                  <a href="mailto:info@autoone.it">info@autoone.it</a>
                </p>
                <p>
                  <a href="mailto:sales@autoone.it">sales@autoone.it</a>
                </p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <i className="icon-hours"></i>
              </div>
              <div className="info-content">
                <h3>{t('contact.hours')}</h3>
                <p>
                  {t('contact.weekdays')}: 9:00 - 18:00<br />
                  {t('contact.saturday')}: 9:00 - 13:00<br />
                  {t('contact.sunday')}: {t('contact.closed')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
       {/* Google Map */}
        <div className="map-container">
          <h2>{t('contact.findUs')}</h2>
          <div className="google-map">
            <a 
              href="https://www.google.com/maps/place/AUTO+ONE+by+Alessandro/@41.48981,12.6233695,743m/data=!3m3!1e3!4b1!5s0x1325a33275b7b1b3:0x2a445e1fbafa13b2!4m6!3m5!1s0x1325a330ba7f6e65:0x47ebfd4a9d6fd177!8m2!3d41.489806!4d12.6259444!16s%2Fg%2F11kk63bpm6?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                src={require('../assets/maps.png')} 
                alt="AUTO ONE location map" 
                style={{width: '100%', height: '450px', objectFit: 'cover', borderRadius: '8px'}}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
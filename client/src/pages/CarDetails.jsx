// În client/src/pages/CarDetails.jsx
// Modificăm layout-ul pentru a muta descrierea sub galeria de imagini

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../services/api';

import '../styles/CarDetails.scss';

const CarDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [imagesArray, setImagesArray] = useState([]);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/cars/${id}`);
        setCar(response.data);
        
        // Procesează imaginile
        processImages(response.data.images);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching car details:', err);
        setError(t('carDetails.errorFetching'));
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id, t]);

  // Procesează imaginile pentru afișare
  const processImages = (images) => {
    console.log('Procesez imaginile:', images);
    
    const imageList = [];
    
    // Verifică dacă images este valid
    if (!images) {
      setImagesArray([]);
      return;
    }
    
    // Dacă images este string (în caz că a fost serializat ca JSON)
    if (typeof images === 'string') {
      try {
        const parsedImages = JSON.parse(images);
        Object.values(parsedImages).forEach(url => {
          if (url) imageList.push(getFullImageUrl(url));
        });
      } catch (error) {
        console.error('Eroare la parsarea imaginilor:', error);
      }
    }
    // Dacă images este obiect
    else if (typeof images === 'object' && images !== null) {
      Object.values(images).forEach(url => {
        if (url) imageList.push(getFullImageUrl(url));
      });
    }
    
    console.log('Lista de imagini procesate:', imageList);
    setImagesArray(imageList);
  };

  // Funcție pentru a construi URL-ul complet al imaginii
  const getFullImageUrl = (url) => {
    // Dacă URL-ul începe cu http, este deja un URL complet
    if (url.startsWith('http')) {
      return url;
    }
    
    // Dacă nu începe cu /, adaugă /
    if (!url.startsWith('/')) {
      url = '/' + url;
    }
    
    // Construiește URL-ul complet relativ la API
    return `${process.env.REACT_APP_API_URL.replace('/api', '')}${url}`;
  };

  // Format price with currency according to selected language
  const formatPrice = (price) => {
    switch (i18n.language) {
      case 'it':
      case 'de':
        return `€${price.toLocaleString()}`;
      case 'ro':
        return `${price.toLocaleString()} RON`;
      default:
        return `€${price.toLocaleString()}`;
    }
  };

  // Handle image navigation
  const nextImage = () => {
    if (imagesArray.length > 0) {
      setActiveImage((prev) => (prev + 1) % imagesArray.length);
    }
  };

  const prevImage = () => {
    if (imagesArray.length > 0) {
      setActiveImage((prev) => (prev - 1 + imagesArray.length) % imagesArray.length);
    }
  };

  if (loading) {
    return (
      <div className="car-details-page loading">
        <div className="container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="car-details-page error">
        <div className="container">
          <div className="error-message">{error || t('carDetails.notFound')}</div>
          <Link to="/inventory" className="back-btn">
            {t('carDetails.backToInventory')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="car-details-page">
      <div className="container">
        <div className="navigation">
          <Link to="/inventory" className="back-link">
            <span className="arrow">←</span> {t('carDetails.backToInventory')}
          </Link>
        </div>

        {/* Header Section with Title & Price */}
        <div className="car-title-section">
          <div className="car-header">
            <h1>{car.title}</h1>
            <div className="car-brand">{car.brand} {car.model}</div>
            <div className="car-price">{formatPrice(car.price)}</div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="car-details-content">
          <div className="gallery-section">
            <div className="main-image">
              {imagesArray.length > 0 ? (
                <>
                  <img
                    src={imagesArray[activeImage]}
                    alt={`${car.brand} ${car.title}`}
                    onError={(e) => {
                      console.error('Eroare la încărcarea imaginii:', imagesArray[activeImage]);
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                    }}
                  />
                  {imagesArray.length > 1 && (
                    <>
                      <button className="gallery-nav prev" onClick={prevImage}>
                        <span>‹</span>
                      </button>
                      <button className="gallery-nav next" onClick={nextImage}>
                        <span>›</span>
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="placeholder-image">
                  <span>{t('carDetails.noImages')}</span>
                </div>
              )}
            </div>

            {imagesArray.length > 1 && (
              <div className="thumbnail-gallery">
                {imagesArray.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img 
                      src={img} 
                      alt={`${car.brand} ${car.title} thumbnail ${index + 1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/100x75?text=Error';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Car Specifications */}
          <div className="info-section">
            <div className="car-specs">
              <div className="spec-item">
                <div className="spec-label">{t('car.year')}</div>
                <div className="spec-value">{car.year}</div>
              </div>
              <div className="spec-item">
                <div className="spec-label">{t('car.mileage')}</div>
                <div className="spec-value">{car.km.toLocaleString()} km</div>
              </div>
              {car.fuel && (
                <div className="spec-item">
                  <div className="spec-label">{t('car.fuel')}</div>
                  <div className="spec-value">{car.fuel}</div>
                </div>
              )}
              {car.transmission && (
                <div className="spec-item">
                  <div className="spec-label">{t('car.transmission')}</div>
                  <div className="spec-value">{car.transmission}</div>
                </div>
              )}
              {car.power && (
                <div className="spec-item">
                  <div className="spec-label">{t('car.power')}</div>
                  <div className="spec-value">{car.power} HP</div>
                </div>
              )}
              {car.color && (
                <div className="spec-item">
                  <div className="spec-label">{t('car.color')}</div>
                  <div className="spec-value">{car.color}</div>
                </div>
              )}
            </div>

            <div className="contact-actions">
              <Link to="/contact" className="contact-btn primary">
                {t('carDetails.contactUs')}
              </Link>
              <a href={`tel:+123456789`} className="contact-btn secondary">
                {t('carDetails.callUs')}
              </a>
              <a
                href={`https://wa.me/123456789?text=${encodeURIComponent(
                  `${t('carDetails.whatsappMessage')} ${car.brand} ${car.title}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn whatsapp"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Description Section - Mutat sub galerie */}
        <div className="description-section">
          <h2>{t('carDetails.description')}</h2>
          <div className="description-content">
            <p>{car.description}</p>
          </div>
        </div>

        {/* Additional Details */}
        {car.features && car.features.length > 0 && (
          <div className="additional-section">
            <h2>{t('carDetails.features')}</h2>
            <div className="features-list">
              {car.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarDetails;
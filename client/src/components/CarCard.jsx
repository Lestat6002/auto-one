// În client/src/components/CarCard.jsx
// Actualizează componenta pentru a afișa corect imaginile

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/CarCard.scss';
import axios from '../services/api';


const CarCard = ({ car }) => {
  const { t, i18n } = useTranslation();
  const { id, title, brand, price, km, year, images } = car;
  
  // Funcție pentru a construi URL-ul corect al imaginii
  const getImageUrl = () => {
    // Verifică dacă images este un obiect valid
    if (!images) return null;
    
    let imageUrl = null;
    
    // Dacă images este un string (în caz că a fost serializat ca JSON)
    if (typeof images === 'string') {
      try {
        const parsedImages = JSON.parse(images);
        
        // Încearcă să folosești prima imagine disponibilă
        if (parsedImages.front) imageUrl = parsedImages.front;
        else if (parsedImages.exterior) imageUrl = parsedImages.exterior;
        else {
          // Altfel ia prima imagine din obiect
          const firstKey = Object.keys(parsedImages)[0];
          if (firstKey) imageUrl = parsedImages[firstKey];
        }
      } catch (error) {
        console.error('Eroare la parsarea imaginilor:', error);
      }
    }
    // Dacă images este un obiect
    else if (typeof images === 'object' && images !== null) {
      // Încearcă să folosești prima imagine disponibilă
      if (images.front) imageUrl = images.front;
      else if (images.exterior) imageUrl = images.exterior;
      else {
        // Altfel ia prima imagine din obiect
        const firstKey = Object.keys(images)[0];
        if (firstKey) imageUrl = images[firstKey];
      }
    }
    
    // Asigură-te că URL-ul este formatat corect
    if (imageUrl) {
      // Dacă imageUrl începe cu http, este deja un URL complet
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      
      // Dacă nu începe cu /, adaugă /
      if (!imageUrl.startsWith('/')) {
        imageUrl = '/' + imageUrl;
      }
      
      // Construiește URL-ul complet relativ la API
      return `${process.env.REACT_APP_API_URL.replace('/api', '')}${imageUrl}`;
    }
    
    return null;
  };
  
  // Format price with currency according to selected language
  const formatPrice = () => {
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

  // Obține URL-ul imaginii
  const imageUrl = getImageUrl();
  console.log('CarCard: URL imagine pentru mașina', id, ':', imageUrl);

  return (
    <div className="car-card">
      <Link to={`/car/${id}`} className="car-card-link">
        <div className="car-image">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={`${brand} ${title}`} 
              onError={(e) => {
                console.error('Eroare la încărcarea imaginii:', imageUrl);
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
              }}
              loading="lazy"
            />
          ) : (
            <div className="placeholder-image"></div>
          )}
        </div>
        
        <div className="car-info">
          <h3 className="car-title">{title}</h3>
          <div className="car-brand">{brand}</div>
          
          <div className="car-specs">
            <div className="spec">
              <span className="spec-label">{t('car.year')}:</span>
              <span className="spec-value">{year}</span>
            </div>
            <div className="spec">
              <span className="spec-label">{t('car.mileage')}:</span>
              <span className="spec-value">{km.toLocaleString()} km</span>
            </div>
          </div>
          
          <div className="car-price">{formatPrice()}</div>
          
          <div className="view-details">
            <span className="details-text">{t('car.viewDetails')}</span>
            <span className="arrow">→</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CarCard;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from '../services/api';

import '../styles/Home.scss';
import CarCard from '../components/CarCard';

const Home = () => {
  const { t } = useTranslation();
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        // Fetch 3 featured cars from the API
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/cars?limit=3`);
        setFeaturedCars(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured cars:', error);
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>{t('home.hero.title')}</h1>
          <p>{t('home.hero.subtitle')}</p>
          <Link to="/inventory" className="btn-primary">
            {t('home.hero.cta')}
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <div className="section-header">
            <h2>{t('home.about.title')}</h2>
            <p>{t('home.about.subtitle')}</p>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p>{t('home.about.description1')}</p>
              <p>{t('home.about.description2')}</p>
              <Link to="/contact" className="btn-outline">
                {t('home.about.contact')}
              </Link>
            </div>
            <div className="about-image">
              <div className="image-container">
                {/* Replace with actual image */}
                <div className="placeholder-image"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="featured-cars">
        <div className="container">
          <div className="section-header">
            <h2>{t('home.featured.title')}</h2>
            <p>{t('home.featured.subtitle')}</p>
          </div>

          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <div className="cars-grid">
              {featuredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
          
          <div className="view-all">
            <Link to="/inventory" className="btn-text">
              {t('home.featured.viewAll')} <span className="arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <div className="section-header">
            <h2>{t('home.whyChoose.title')}</h2>
            <p>{t('home.whyChoose.subtitle')}</p>
          </div>

          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">
                <i className="icon-quality"></i>
              </div>
              <h3>{t('home.whyChoose.feature1.title')}</h3>
              <p>{t('home.whyChoose.feature1.description')}</p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">
                <i className="icon-service"></i>
              </div>
              <h3>{t('home.whyChoose.feature2.title')}</h3>
              <p>{t('home.whyChoose.feature2.description')}</p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">
                <i className="icon-warranty"></i>
              </div>
              <h3>{t('home.whyChoose.feature3.title')}</h3>
              <p>{t('home.whyChoose.feature3.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>{t('home.cta.title')}</h2>
            <p>{t('home.cta.subtitle')}</p>
            <Link to="/inventory" className="btn-primary btn-large">
              {t('home.cta.button')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
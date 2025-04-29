// În client/src/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Navbar.scss';
import logo from '../assets/logo.png'; // Asigură-te că există logo-ul în assets
import ThemeToggle from './ThemeToggle';
import axios from '../services/api';


const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Change background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle language change
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setMenuOpen(false);
  };

  // Set language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const isHome = location.pathname === '/';
  const navbarClass = `navbar ${isScrolled || !isHome ? 'navbar-solid' : 'navbar-transparent'} ${menuOpen ? 'menu-open' : ''}`;

  return (
    <nav className={navbarClass}>
      <div className="navbar-container">
        <Link to="/" className="logo-container">
          <img src={logo} alt="AUTO ONE" className="logo" />
        </Link>

        <div className={`menu-toggle ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            {t('navbar.home')}
          </Link>
          <Link to="/inventory" className="nav-link" onClick={() => setMenuOpen(false)}>
            {t('navbar.inventory')}
          </Link>
          <Link to="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>
            {t('navbar.contact')}
          </Link>
        </div>

        <div className="navbar-right">
          {/* Butonul pentru comutarea temei */}
          <ThemeToggle />
          
          {/* Selectorul de limbă */}
          <div className="language-selector">
            <button 
              className={i18n.language === 'it' ? 'active' : ''} 
              onClick={() => changeLanguage('it')}
            >
              IT
            </button>
            <button 
              className={i18n.language === 'de' ? 'active' : ''} 
              onClick={() => changeLanguage('de')}
            >
              DE
            </button>
            <button 
              className={i18n.language === 'ro' ? 'active' : ''} 
              onClick={() => changeLanguage('ro')}
            >
              RO
            </button>
            <button 
              className={i18n.language === 'en' ? 'active' : ''} 
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
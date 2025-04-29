// În client/src/App.js
// Corectează ordinea de încărcare a stilurilor

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './i18n';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './context/ThemeContext';

// Importă stilurile în ordinea corectă:
// 1. Stiluri de bază
// 2. Stiluri pentru teme
// 3. Stiluri pentru componente
import './styles/main.scss';
import './styles/theme.scss';  // Asigură-te că acest import este după main.scss

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import CarDetails from './pages/CarDetails';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function App() {
  const { i18n } = useTranslation();
  
  // Set language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs = ['en', 'it', 'de', 'ro'];
      
      if (supportedLangs.includes(browserLang)) {
        i18n.changeLanguage(browserLang);
        localStorage.setItem('language', browserLang);
      }
    }
  }, [i18n]);
  
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/car/:id" element={<CarDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
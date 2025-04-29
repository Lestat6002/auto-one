// În client/src/context/ThemeContext.js

import React, { createContext, useState, useEffect } from 'react';

// Creăm contextul pentru temă
export const ThemeContext = createContext();

// Provider-ul pentru temă care va înconjura aplicația
export const ThemeProvider = ({ children }) => {
  // Verificăm dacă există o preferință salvată în localStorage
  // Dacă nu, folosim preferințele sistemului (prefers-color-scheme)
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Verificăm preferințele sistemului
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  // Starea pentru tema curentă
  const [theme, setTheme] = useState(getInitialTheme);

  // Funcția pentru comutarea temei
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Actualizăm documentul și salvăm preferința în localStorage când tema se schimbă
  useEffect(() => {
    // Actualizăm data-theme în elementul html
    document.documentElement.setAttribute('data-theme', theme);
    
    // Salvăm tema în localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Valorile pe care le expunem în context
  const contextValue = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook pentru utilizarea temei în componente
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
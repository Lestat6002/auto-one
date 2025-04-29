// În client/src/pages/Inventory.jsx
// Componenta complet rescrisă

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../services/api';

import '../styles/Inventory.scss';
import CarCard from '../components/CarCard';
import { useTheme } from '../context/ThemeContext'; // Importăm hook-ul pentru temă

const Inventory = () => {
  const { t } = useTranslation();
  const { theme } = useTheme(); // Utilizăm tema curentă
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  
  // Listă completă de mărci auto disponibile
  const [brands, setBrands] = useState([]);
  
  // Filters
  const [filters, setFilters] = useState({
    brand: '',
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
    minKm: '',
    maxKm: '',
    fuel: '',
    transmission: ''
  });
  
  // Opțiuni pentru combustibil
  const fuelOptions = [
    { value: '', label: t('inventory.filters.allFuels') },
    { value: 'petrol', label: t('car.fuelTypes.petrol') },
    { value: 'diesel', label: t('car.fuelTypes.diesel') },
    { value: 'hybrid', label: t('car.fuelTypes.hybrid') },
    { value: 'electric', label: t('car.fuelTypes.electric') },
    { value: 'lpg', label: t('car.fuelTypes.lpg') }
  ];
  
  // Opțiuni pentru transmisie
  const transmissionOptions = [
    { value: '', label: t('inventory.filters.allTransmissions') },
    { value: 'manual', label: t('car.transmissionTypes.manual') },
    { value: 'automatic', label: t('car.transmissionTypes.automatic') },
    { value: 'semi-automatic', label: t('car.transmissionTypes.semiAuto') }
  ];
  
  // Încărcarea listei de mărci disponibile
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/cars/brands`);
        // Verifică dacă response.data este un array
        if (Array.isArray(response.data)) {
          setBrands(response.data);
        } else {
          console.error('Răspunsul pentru mărci nu este un array:', response.data);
          // Folosește lista predefinită dacă nu primim un array
          setBrands(defaultBrands);
        }
      } catch (err) {
        console.error('Eroare la încărcarea mărcilor:', err);
        // În caz de eroare, folosim lista predefinită
        setBrands(defaultBrands);
      }
    };
    
    fetchBrands();
  }, []);
  
  // Lista predefinită de mărci (ca backup)
  const defaultBrands = [
    'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Toyota', 
    'Honda', 'Ford', 'Fiat', 'Renault', 'Peugeot', 'Opel',
    'Škoda', 'Hyundai', 'Kia', 'Nissan', 'Mazda', 'Citroën',
    'Volvo', 'Subaru', 'Jeep', 'Land Rover', 'Tesla', 'Seat',
    'Dacia', 'Mitsubishi', 'Suzuki', 'Mini', 'Alfa Romeo',
    'Porsche', 'Jaguar', 'Lexus'
  ];

  // Sortare mașini
  const sortCars = (carsToSort) => {
    // Facem o copie a array-ului pentru a nu modifica starea direct
    const sortedCars = [...carsToSort];
    
    switch (sortOption) {
      case 'priceAsc':
        return sortedCars.sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return sortedCars.sort((a, b) => b.price - a.price);
      case 'newest': // Presupunem că cele mai noi sunt bazate pe id sau createdAt
      default:
        // Ar trebui să sortăm după createdAt dacă există, altfel după id descrescător
        return sortedCars.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return b.id - a.id;
        });
    }
  };
  
  // Gestionarea schimbării opțiunii de sortare
  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    // Resortăm mașinile existente
    const sortedCars = sortCars([...cars]);
    setCars(sortedCars);
  };
  
  // Apply filters
  const applyFilters = async () => {
    setLoading(true);
    
    try {
      // Create query params from filters
      const params = {};
      if (filters.brand) params.brand = filters.brand;
      if (filters.minYear) params.minYear = filters.minYear;
      if (filters.maxYear) params.maxYear = filters.maxYear;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.minKm) params.minKm = filters.minKm;
      if (filters.maxKm) params.maxKm = filters.maxKm;
      if (filters.fuel) params.fuel = filters.fuel;
      if (filters.transmission) params.transmission = filters.transmission;
      
      console.log('Aplicăm filtrele:', params);
      
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/cars`, { params });
      // Sortăm rezultatele conform opțiunii de sortare actuale
      const sortedCars = sortCars(response.data);
      setCars(sortedCars);
      setError(null);
    } catch (err) {
      console.error('Eroare la filtrarea mașinilor:', err);
      setError(t('inventory.errorFetching'));
    } finally {
      setLoading(false);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      brand: '',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
      minKm: '',
      maxKm: '',
      fuel: '',
      transmission: ''
    });
    
    // Fetch all cars without filters
    fetchCars();
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Initial fetch
  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/cars`);
      // Sortăm rezultatele conform opțiunii de sortare actuale
      const sortedCars = sortCars(response.data);
      setCars(sortedCars);
      setError(null);
    } catch (err) {
      console.error('Eroare la încărcarea mașinilor:', err);
      setError(t('inventory.errorFetching'));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Excludem funcțiile din dependențe pentru a evita reîncărcări infinite
  
  return (
    <div className="inventory-page" data-theme={theme}>
      <div className="page-header">
        <div className="container">
          <h1>{t('inventory.title')}</h1>
          <p>{t('inventory.subtitle')}</p>
        </div>
      </div>
      
      <div className="container">
        <div className="inventory-content">
          {/* Filters */}
          <div className="filters-panel">
            <h2>{t('inventory.filters.title')}</h2>
            
            <div className="filter-group">
              <label htmlFor="brand">{t('inventory.filters.brand')}</label>
              <select 
                id="brand" 
                name="brand" 
                value={filters.brand} 
                onChange={handleFilterChange}
              >
                <option value="">{t('inventory.filters.allBrands')}</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>{t('inventory.filters.year')}</label>
              <div className="range-inputs">
                <input 
                  type="number" 
                  placeholder={t('inventory.filters.min')}
                  name="minYear"
                  value={filters.minYear}
                  onChange={handleFilterChange}
                />
                <span className="range-separator">-</span>
                <input 
                  type="number" 
                  placeholder={t('inventory.filters.max')}
                  name="maxYear"
                  value={filters.maxYear}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label>{t('inventory.filters.price')}</label>
              <div className="range-inputs">
                <input 
                  type="number" 
                  placeholder={t('inventory.filters.min')}
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <span className="range-separator">-</span>
                <input 
                  type="number" 
                  placeholder={t('inventory.filters.max')}
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label>{t('inventory.filters.mileage')}</label>
              <div className="range-inputs">
                <input 
                  type="number" 
                  placeholder={t('inventory.filters.min')}
                  name="minKm"
                  value={filters.minKm}
                  onChange={handleFilterChange}
                />
                <span className="range-separator">-</span>
                <input 
                  type="number" 
                  placeholder={t('inventory.filters.max')}
                  name="maxKm"
                  value={filters.maxKm}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            
            {/* Adăugăm filtre pentru combustibil și transmisie */}
            <div className="filter-group">
              <label htmlFor="fuel">{t('car.fuel')}</label>
              <select 
                id="fuel" 
                name="fuel" 
                value={filters.fuel} 
                onChange={handleFilterChange}
              >
                {fuelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="transmission">{t('car.transmission')}</label>
              <select 
                id="transmission" 
                name="transmission" 
                value={filters.transmission} 
                onChange={handleFilterChange}
              >
                {transmissionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-actions">
              <button 
                className="btn-apply" 
                onClick={applyFilters}
              >
                {t('inventory.filters.apply')}
              </button>
              <button 
                className="btn-reset" 
                onClick={resetFilters}
              >
                {t('inventory.filters.reset')}
              </button>
            </div>
          </div>
          
          {/* Results */}
          <div className="cars-results">
            {loading ? (
              <div className="loading-spinner"></div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : cars.length === 0 ? (
              <div className="no-results">{t('inventory.noResults')}</div>
            ) : (
              <>
                <div className="results-header">
                  <div className="results-count">
                    {t('inventory.resultsCount', { count: cars.length })}
                  </div>
                  <div className="results-sort">
                    <select 
                      className="sort-select"
                      value={sortOption}
                      onChange={handleSortChange}
                    >
                      <option value="newest">{t('inventory.sort.newest')}</option>
                      <option value="priceAsc">{t('inventory.sort.priceAsc')}</option>
                      <option value="priceDesc">{t('inventory.sort.priceDesc')}</option>
                    </select>
                  </div>
                </div>
                
                <div className="cars-grid">
                  {cars.map(car => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
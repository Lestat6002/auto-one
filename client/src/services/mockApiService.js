// client/src/services/mockApiService.js

// Date simulate pentru mașini
const MOCK_CARS = [
    {
      id: 1,
      title: "Audi A4 2.0 TDI Premium",
      brand: "Audi",
      model: "A4",
      price: 25000,
      km: 75000,
      year: 2019,
      fuel: "diesel",
      transmission: "automatic",
      power: 190,
      engine_size: 2.0,
      color: "Gri Metalizat",
      description: "Mașină în stare excelentă, un singur proprietar, carte service la zi, toate reviziile făcute la reprezentanță.",
      features: ["abs", "esp", "ac", "leather", "navigation", "bluetooth", "parking_sensors", "cruise_control"],
      images: {
        front: "https://i.imgur.com/JU3zQw0.jpg",
        rear: "https://i.imgur.com/7uZiuP2.jpg",
        side_left: "https://i.imgur.com/xzfpems.jpg",
        interior_front: "https://i.imgur.com/ducGrRB.jpg"
      },
      createdAt: "2024-04-28T14:30:00.000Z"
    },
    {
      id: 2,
      title: "BMW Seria 5 530e Plug-in Hybrid",
      brand: "BMW",
      model: "Seria 5",
      price: 35000,
      km: 45000,
      year: 2020,
      fuel: "hybrid",
      transmission: "automatic",
      power: 292,
      engine_size: 2.0,
      color: "Negru",
      description: "BMW Seria 5 Plug-in Hybrid, model 2020, pachet M Sport, head-up display, navigație profesională, scaune cu memorie, camera 360.",
      features: ["abs", "esp", "electric_windows", "navigation", "bluetooth", "cruise_control", "heated_seats", "leather"],
      images: {
        front: "https://i.imgur.com/SWUE7L5.jpg",
        rear: "https://i.imgur.com/QxT971z.jpg",
        interior_front: "https://i.imgur.com/tJFIv45.jpg",
        dashboard: "https://i.imgur.com/KZjFBqD.jpg"
      },
      createdAt: "2024-04-27T10:15:00.000Z"
    },
    {
      id: 3,
      title: "Mercedes-Benz C-Class C220d AMG Line",
      brand: "Mercedes-Benz",
      model: "C-Class",
      price: 29500,
      km: 60000,
      year: 2019,
      fuel: "diesel",
      transmission: "automatic",
      power: 194,
      engine_size: 2.0,
      color: "Alb",
      description: "Mercedes C-Class cu pachet AMG Line, interior piele, navigație, cameră marșarier, faruri LED, jante aliaj 18\".",
      features: ["abs", "esp", "auto_ac", "navigation", "bluetooth", "led_lights", "alloy_wheels", "parking_sensors"],
      images: {
        front: "https://i.imgur.com/dAiM98j.jpg",
        rear: "https://i.imgur.com/RjPJIqO.jpg",
        side_right: "https://i.imgur.com/J5KZfTE.jpg",
        interior_front: "https://i.imgur.com/RUvdj5h.jpg"
      },
      createdAt: "2024-04-26T16:45:00.000Z"
    },
    {
      id: 4,
      title: "Volkswagen Golf 8 1.5 TSI",
      brand: "Volkswagen",
      model: "Golf",
      price: 22000,
      km: 35000,
      year: 2021,
      fuel: "petrol",
      transmission: "manual",
      power: 150,
      engine_size: 1.5,
      color: "Albastru",
      description: "VW Golf 8, model 2021, motor 1.5 TSI, climatronic, Apple CarPlay, Android Auto, senzori parcare, faruri LED.",
      features: ["abs", "esp", "auto_ac", "bluetooth", "parking_sensors", "led_lights", "alloy_wheels", "keyless"],
      images: {
        front: "https://i.imgur.com/rVXhqUi.jpg",
        rear: "https://i.imgur.com/dVJwdZo.jpg",
        interior_front: "https://i.imgur.com/Niyq9P9.jpg",
        dashboard: "https://i.imgur.com/uisrSM6.jpg"
      },
      createdAt: "2024-04-25T09:30:00.000Z"
    },
    {
      id: 5,
      title: "Tesla Model 3 Long Range AWD",
      brand: "Tesla",
      model: "Model 3",
      price: 42000,
      km: 40000,
      year: 2021,
      fuel: "electric",
      transmission: "automatic",
      power: 346,
      engine_size: null,
      color: "Roșu",
      description: "Tesla Model 3 Long Range cu tracțiune integrală, autonomie 560 km, Autopilot, interior alb premium, garanție baterie.",
      features: ["abs", "esp", "auto_ac", "navigation", "bluetooth", "heated_seats", "electric_windows", "keyless"],
      images: {
        front: "https://i.imgur.com/sIYDIAF.jpg",
        rear: "https://i.imgur.com/K5H3nBV.jpg",
        interior_front: "https://i.imgur.com/nwdUfzw.jpg",
        dashboard: "https://i.imgur.com/Z3HEFLX.jpg"
      },
      createdAt: "2024-04-29T11:20:00.000Z"
    }
  ];
  
  // Funcție pentru a salva datele în localStorage
  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  
  // Funcție pentru a încărca datele din localStorage
  const loadFromLocalStorage = (key, defaultValue) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  };
  
  // Inițializează datele în localStorage dacă nu există
  const initializeData = () => {
    const cars = loadFromLocalStorage('mock_cars', null);
    if (!cars) {
      saveToLocalStorage('mock_cars', MOCK_CARS);
    }
  };
  
  // Inițializează datele când se încarcă serviciul
  initializeData();
  
  // API pentru mașini
  const carsApi = {
    // Obține toate mașinile cu filtre opționale
    getCars: (filters = {}) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let cars = loadFromLocalStorage('mock_cars', MOCK_CARS);
          
          // Aplicăm filtrele
          if (filters) {
            if (filters.brand) {
              cars = cars.filter(car => car.brand === filters.brand);
            }
            if (filters.minYear) {
              cars = cars.filter(car => car.year >= parseInt(filters.minYear));
            }
            if (filters.maxYear) {
              cars = cars.filter(car => car.year <= parseInt(filters.maxYear));
            }
            if (filters.minPrice) {
              cars = cars.filter(car => car.price >= parseInt(filters.minPrice));
            }
            if (filters.maxPrice) {
              cars = cars.filter(car => car.price <= parseInt(filters.maxPrice));
            }
            if (filters.minKm) {
              cars = cars.filter(car => car.km >= parseInt(filters.minKm));
            }
            if (filters.maxKm) {
              cars = cars.filter(car => car.km <= parseInt(filters.maxKm));
            }
            if (filters.fuel) {
              cars = cars.filter(car => car.fuel === filters.fuel);
            }
            if (filters.transmission) {
              cars = cars.filter(car => car.transmission === filters.transmission);
            }
          }
          
          resolve(cars);
        }, 500); // Simulăm un delay de 500ms
      });
    },
  
    // Obține o mașină după ID
    getCarById: (id) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const cars = loadFromLocalStorage('mock_cars', MOCK_CARS);
          const car = cars.find(car => car.id === parseInt(id));
          
          if (car) {
            resolve(car);
          } else {
            reject(new Error('Car not found'));
          }
        }, 500);
      });
    },
  
    // Obține lista de mărci unice
    getBrands: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const cars = loadFromLocalStorage('mock_cars', MOCK_CARS);
          const brands = [...new Set(cars.map(car => car.brand))].sort();
          resolve(brands);
        }, 300);
      });
    }
  };
  
  // API pentru autentificare
  const authApi = {
    login: (credentials) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulăm autentificarea cu credențiale hardcodate pentru demo
          if (credentials.email === 'admin@autoone.it' && credentials.password === '123456') {
            const token = 'mock_token_' + Date.now();
            localStorage.setItem('auth_token', token);
            resolve({ token });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 800);
      });
    },
    
    validateToken: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const token = localStorage.getItem('auth_token');
          resolve({ valid: !!token, user: { email: 'admin@autoone.it' } });
        }, 300);
      });
    }
  };
  
  // API simulat complet
  const mockApi = {
    cars: carsApi,
    auth: authApi
  };
  
  export default mockApi;
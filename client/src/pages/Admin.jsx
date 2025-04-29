import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../services/api';

import '../styles/Admin.scss';

const Admin = () => {
  const { t } = useTranslation();
  
  // Lista mărcilor și modelelor
  const brandModels = {
    'Audi':            ['A1','A3','A4','A5','A6','A7','A8','Q2','Q3','Q5','Q7','Q8','e-tron','TT','R8'],
    'BMW':             ['Seria 1','Seria 2','Seria 3','Seria 4','Seria 5','Seria 6','Seria 7','Seria 8','X1','X2','X3','X4','X5','X6','X7','Z4','i3','i4','i8','iX'],
    'Mercedes-Benz':   ['Clasa A','Clasa B','Clasa C','Clasa E','Clasa S','CLA','CLS','GLA','GLB','GLC','GLE','GLS','EQA','EQB','EQC','EQE','EQS','AMG A','AMG C','AMG E','AMG G','AMG GT'],
    'Volkswagen':      ['Polo','Golf','Passat','Arteon','T-Cross','T-Roc','Tiguan','Touareg','ID.3','ID.4','ID.5','ID.Buzz'],
    'Toyota':          ['Yaris','Corolla','Auris','Prius','Camry','C-HR','RAV4','Highlander','Land Cruiser','Hilux','Yaris Cross','GR Yaris'],
    'Ford':            ['Fiesta','Focus','Mondeo','EcoSport','Kuga','Edge','Explorer','Mustang','Puma','Tourneo','Transit Connect','Transit Custom'],
    'Renault':         ['Clio','Megane','Talisman','Captur','Kadjar','Koleos','Scenic','Espace','ZOE','Twingo'],
    'Opel':            ['Corsa','Astra','Insignia','Crossland X','Grandland X','Mokka','Combo','Vivaro'],
    'Peugeot':         ['108','208','308','508','2008','3008','5008','Rifter','Traveller','Expert'],
    'Škoda':           ['Fabia','Rapid','Octavia','Superb','Scala','Kamiq','Karoq','Kodiaq','Enyaq'],
    'Hyundai':         ['i10','i20','i30','i40','Accent','Kona','Tucson','Santa Fe','Bayon','IONIQ','KONA Electric'],
    'Kia':             ['Picanto','Rio','Ceed','Stonic','Niro','Sportage','Sorento','Soul','EV6','EV9'],
    'Honda':           ['Jazz','Civic','Accord','HR-V','CR-V','e','Insight','NSX'],
    'Nissan':          ['Micra','Note','Leaf','Juke','Qashqai','X-Trail','Navara','GT-R','370Z'],
    'Mazda':           ['2','3','6','MX-5','CX-3','CX-30','CX-5','CX-9'],
    'Citroën':         ['C1','C3','C3 Aircross','C4','C4 Cactus','C5 Aircross','Berlingo','Spacetourer','e-C4'],
    'Volvo':           ['V40','V60','V90','S60','S90','XC40','XC60','XC90','C40 Recharge','XC40 Recharge'],
    'Subaru':          ['Impreza','XV','Forester','Outback','BRZ'],
    'Fiat':            ['500','Panda','Tipo','Punto','Doblo','Panda Cross','500X','500L','124 Spider'],
    'Jeep':            ['Renegade','Compass','Cherokee','Grand Cherokee','Wrangler','Gladiator'],
    'Land Rover':      ['Discovery','Range Rover Evoque','Range Rover Sport','Range Rover','Defender','Velar'],
    'Tesla':           ['Model S','Model 3','Model X','Model Y','Cybertruck','Roadster'],
    'Seat':            ['Mii Electric','Ibiza','Leon','Arona','Ateca','Tarraco','Alhambra'],
    'Dacia':           ['Sandero','Logan','Duster','Lodgy','Dokker','Spring','Logan MCV'],
    'Mitsubishi':      ['Space Star','Mirage','ASX','Eclipse Cross','Outlander','Pajero','L200'],
    'Suzuki':          ['Swift','Ignis','Baleno','Vitara','S-Cross','Jimny'],
    'Mini':            ['Cooper','Clubman','Countryman','Convertible','Paceman','John Cooper Works'],
    'Alfa Romeo':      ['Giulietta','Giulia','Stelvio','MiTo','4C','Tonale'],
    'Porsche':         ['911','718 Cayman','718 Boxster','Macan','Cayenne','Panamera','Taycan'],
    'Jaguar':          ['XE','XF','XJ','F-Pace','E-Pace','I-Pace','F-Type'],
    'DS':              ['DS3','DS4','DS5','DS7','DS9'],
    'Lexus':           ['CT','IS','ES','GS','LS','UX','NX','RX','GX','LX'],
    'Infiniti':        ['Q30','QX30','Q50','Q60','Q70','QX50','QX60','QX70','QX80'],
    'Chevrolet':       ['Spark','Aveo','Cruze','Malibu','Camaro','Corvette','Trax','Equinox','Tahoe','Suburban'],
    'Cadillac':        ['ATS','CTS','XTS','SRX','Escalade','XT4','XT5','XT6'],
    'Chrysler':        ['200','300','Pacifica','Voyager'],
    'Dodge':           ['Dart','Charger','Challenger','Journey','Durango','Grand Caravan'],
    'Maserati':        ['Ghibli','Quattroporte','Levante','GranTurismo','GranCabrio'],
    'Bentley':         ['Continental GT','Flying Spur','Bentayga'],
    'Rolls-Royce':     ['Phantom','Ghost','Wraith','Dawn','Cullinan'],
    'Ferrari':         ['488','458','812','F8','SF90','Portofino','Roma','California'],
    'Lamborghini':     ['Huracán','Aventador','Urus','Gallardo','Diablo','Murciélago'],
    'McLaren':         ['570S','600LT','720S','GT','650S','765LT'],
    'Aston Martin':    ['DB11','Vantage','DBS','Rapide','DBX'],
    'Bugatti':         ['Veyron','Chiron','Divo','Centodieci'],
    'Genesis':         ['G70','G80','G90','GV70','GV80'],
    'MG':              ['MG3','ZS','HS','5','6','MG4','MG5 EV']
  };
  
  // Opțiuni pentru mașini
  const featureOptions = [
    { id: 'abs', name: 'ABS' },
    { id: 'esp', name: 'ESP' },
    { id: 'ac', name: 'Aer condiționat' },
    { id: 'auto_ac', name: 'Climatronic' },
    { id: 'leather', name: 'Tapițerie piele' },
    { id: 'electric_windows', name: 'Geamuri electrice' },
    { id: 'electric_mirrors', name: 'Oglinzi electrice' },
    { id: 'heated_seats', name: 'Scaune încălzite' },
    { id: 'navigation', name: 'Sistem navigație' },
    { id: 'bluetooth', name: 'Bluetooth' },
    { id: 'parking_sensors', name: 'Senzori parcare' },
    { id: 'cruise_control', name: 'Cruise control' },
    { id: 'led_lights', name: 'Faruri LED' },
    { id: 'sunroof', name: 'Trapă' },
    { id: 'alloy_wheels', name: 'Jante aliaj' },
    { id: 'airbags', name: 'Airbag-uri' },
    { id: 'keyless', name: 'Keyless Entry' },
    { id: 'start_stop', name: 'Start/Stop' }
  ].sort((a, b) => a.name.localeCompare(b.name));
  
  // Categorii de imagini
  const imageCategories = [
    { id: 'front', name: 'Vedere față' },
    { id: 'rear', name: 'Vedere spate' },
    { id: 'side_left', name: 'Lateral stânga' },
    { id: 'side_right', name: 'Lateral dreapta' },
    { id: 'interior_front', name: 'Interior față' },
    { id: 'interior_rear', name: 'Interior spate' },
    { id: 'dashboard', name: 'Bord' },
    { id: 'trunk', name: 'Portbagaj' },
    { id: 'engine', name: 'Motor' }
  ];

  // Models state for the selected brand
  const [models, setModels] = useState([]);
  
  // Authentication state
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    token: localStorage.getItem('auth_token'),
    email: '',
    password: ''
  });
  
  // Admin panel state
  const [activeTab, setActiveTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Car form state
  const [carForm, setCarForm] = useState({
    id: null,
    title: '',
    brand: '',
    model: '',
    price: '',
    km: '',
    year: '',
    fuel: '',
    transmission: '',
    power: '',
    engine_size: '',
    color: '',
    description: '',
    features: [],
    images: {}
  });
  
  // Update models when brand changes
  useEffect(() => {
    if (carForm.brand && brandModels[carForm.brand]) {
      setModels(brandModels[carForm.brand]);
    } else {
      setModels([]);
    }
  }, [carForm.brand]);
  
  // Fișiere de imagine
  const [imageFiles, setImageFiles] = useState({});
  
  // Previzualizare imagini
  const [imagePreviews, setImagePreviews] = useState({});
  
  // Cars pagination
  const [carsPage, setCarsPage] = useState(1);
  const [carsPerPage] = useState(10);
  
  // Edit mode toggle
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Handle login form change
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setAuth(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email: auth.email,
        password: auth.password
      });
      
      const { token } = response.data;
      localStorage.setItem('auth_token', token);
      
      setAuth(prev => ({
        ...prev,
        isAuthenticated: true,
        token,
        password: '' // Clear password from state
      }));
      
      // After successful login, fetch data
      fetchCars();
      fetchMessages();
      
    } catch (err) {
      console.error('Login error:', err);
      setError(t('admin.loginError'));
    } finally {
      setLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setAuth({
      isAuthenticated: false,
      token: null,
      email: '',
      password: ''
    });
  };
  
  // Fetch cars
  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/cars`);
      setCars(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError(t('admin.fetchError'));
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch messages
  const fetchMessages = async () => {
    if (activeTab !== 'messages') return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/contact`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      setMessages(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(t('admin.fetchError'));
    } finally {
      setLoading(false);
    }
  };
  
  // Check auth token on mount
  useEffect(() => {
    if (auth.token) {
      // Validate token and fetch data if valid
      const validateToken = async () => {
        try {
          // Setup axios with auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
          
          // Attempt to fetch protected resource
          await axios.get(`${process.env.REACT_APP_API_URL}/auth/validate`);
          
          setAuth(prev => ({
            ...prev,
            isAuthenticated: true
          }));
          
          // Fetch initial data
          fetchCars();
          
        } catch (err) {
          console.error('Invalid token:', err);
          localStorage.removeItem('auth_token');
          setAuth(prev => ({
            ...prev,
            isAuthenticated: false,
            token: null
          }));
        }
      };
      
      validateToken();
    }
  }, []);
  
  // Fetch messages when switching to messages tab
  useEffect(() => {
    if (activeTab === 'messages' && auth.isAuthenticated) {
      fetchMessages();
    }
  }, [activeTab]);
  
  // Handle car form change
  const handleCarFormChange = (e) => {
    const { name, value } = e.target;
    setCarForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Toggle a feature in the features array
  const toggleFeature = (featureId) => {
    setCarForm(prev => {
      const features = [...prev.features];
      
      if (features.includes(featureId)) {
        return {
          ...prev,
          features: features.filter(id => id !== featureId)
        };
      } else {
        return {
          ...prev,
          features: [...features, featureId]
        };
      }
    });
  };
  
  // Fix 1: Improve the image upload handler

// Îmbunătățim handleImageUpload
  const handleImageUpload = (e, category) => {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log(`Imagine selectată pentru ${category}:`, file.name, file.type, file.size);
    
    // Validare tip fișier
    if (!file.type.startsWith('image/')) {
      setError(`Fișierul "${file.name}" nu este o imagine. Sunt acceptate doar fișiere imagine.`);
      return;
    }
    
    // Validare dimensiune fișier (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError(`Fișierul "${file.name}" este prea mare. Dimensiunea maximă este 5MB.`);
      return;
    }
    
    // Actualizează imagine
    setImageFiles(prev => ({
      ...prev,
      [category]: file
    }));
    
    // Creează URL de previzualizare
    const previewUrl = URL.createObjectURL(file);
    setImagePreviews(prev => ({
      ...prev,
      [category]: previewUrl
    }));
    
    console.log(`Imagine pentru ${category} procesată cu succes.`);
  };

  // Reset car form
  const resetCarForm = () => {
  setCarForm({
    id: null,
    title: '',
    brand: '',
    model: '',
    price: '',
    km: '',
    year: '',
    fuel: '',
    transmission: '',
    power: '',
    engine_size: '',
    color: '',
    description: '',
    features: [],
    images: {}
  });
  
  // Clear image previews
  Object.values(imagePreviews).forEach(url => URL.revokeObjectURL(url));
  setImagePreviews({});
  setImageFiles({});
  
  setIsEditMode(false);
  setError(null);
  };
  
  // Edit car
  const editCar = (car) => {
    setCarForm({
      id: car.id || null,
      title: car.title || '',
      brand: car.brand || '',
      model: car.model || '',
      price: car.price ? car.price.toString() : '',
      km: car.km ? car.km.toString() : '',
      year: car.year ? car.year.toString() : '',
      fuel: car.fuel || '',
      transmission: car.transmission || '',
      power: car.power ? car.power.toString() : '',
      engine_size: car.engine_size ? car.engine_size.toString() : '',
      color: car.color || '',
      description: car.description || '',
      features: car.features || [],
      images: car.images || {}
    });
    
    // Set image previews if available
    if (car.images) {
      const previews = {};
      Object.entries(car.images).forEach(([category, url]) => {
        if (url) previews[category] = url;
      });
      setImagePreviews(previews);
    }
    
    setIsEditMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Save car (create or update)
  const saveCar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    console.log('Începe salvarea mașinii...');
    
    try {
      // Validări de bază
      if (!carForm.title || !carForm.brand || !carForm.model || !carForm.price || !carForm.km || !carForm.year) {
        throw new Error('Te rugăm să completezi toate câmpurile obligatorii.');
      }
      
      // Creează form data pentru încărcarea fișierelor
      const formData = new FormData();
      
      // Adaugă câmpurile de bază
      formData.append('title', carForm.title);
      formData.append('brand', carForm.brand);
      formData.append('model', carForm.model);
      formData.append('price', carForm.price);
      formData.append('km', carForm.km);
      formData.append('year', carForm.year);
      formData.append('fuel', carForm.fuel || '');
      formData.append('transmission', carForm.transmission || '');
      
      // Câmpuri opționale numerice
      if (carForm.power) formData.append('power', carForm.power);
      if (carForm.engine_size) formData.append('engine_size', carForm.engine_size);
      
      // Alte câmpuri
      formData.append('color', carForm.color || '');
      formData.append('description', carForm.description || '');
      
      // Adaugă features ca JSON
      formData.append('features', JSON.stringify(carForm.features || []));
      console.log('Features adăugate:', carForm.features);
      
      // Adaugă fișierele imagine
      let hasImages = false;
      Object.entries(imageFiles).forEach(([category, file]) => {
        console.log(`Adaug imagine pentru ${category}:`, file.name);
        formData.append(`image_${category}`, file);
        hasImages = true;
      });
      
      // Dacă suntem în modul editare, adaugă imaginile existente care nu au fost schimbate
      if (isEditMode && carForm.images) {
        // Filtrează categoriile care au încărcări noi
        const existingImages = {};
        Object.entries(carForm.images).forEach(([category, url]) => {
          if (!imageFiles[category] && url) {
            existingImages[category] = url;
          }
        });
        
        if (Object.keys(existingImages).length > 0) {
          formData.append('existing_images', JSON.stringify(existingImages));
          console.log('Imagini existente adăugate:', existingImages);
        }
      }
      
      // Afișează conținutul formData pentru debug
      console.log('FormData conține următoarele câmpuri:');
      for (let [key, value] of formData.entries()) {
        if (key.includes('image_')) {
          console.log(key, 'Fișier:', value.name, value.type, value.size);
        } else {
          console.log(key, value);
        }
      }
      
      const url = isEditMode 
        ? `${process.env.REACT_APP_API_URL}/cars/${carForm.id}`
        : `${process.env.REACT_APP_API_URL}/cars`;
      
      const method = isEditMode ? 'put' : 'post';
      console.log(`Trimit cerere ${method.toUpperCase()} către ${url}`);
      
      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Răspuns de la server:', response.data);
      
      // Verifică dacă răspunsul conține date valide
      if (!response.data || !response.data.id) {
        throw new Error('Răspunsul de la server nu conține date valide.');
      }
      
      // Reîmprospătează lista de mașini și resetează formularul
      fetchCars();
      resetCarForm();
      
      // Afișează mesaj de succes
      alert(`Mașina "${carForm.title}" a fost ${isEditMode ? 'actualizată' : 'creată'} cu succes!`);
      
    } catch (err) {
      console.error('Eroare la salvarea mașinii:', err);
      
      // Afișează mesaj de eroare detaliat dacă este disponibil
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(t('admin.saveError'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete car
  const deleteCar = async (id) => {
    if (!window.confirm(t('admin.confirmDelete'))) {
      return;
    }
    
    setLoading(true);
    
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/cars/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        }
      );
      
      // Refresh car list
      fetchCars();
      setError(null);
      
    } catch (err) {
      console.error('Error deleting car:', err);
      setError(t('admin.deleteError'));
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate pagination for cars
  const indexOfLastCar = carsPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);
  const totalCarsPages = Math.ceil(cars.length / carsPerPage);
  
  // Pagination controls
  const paginate = (pageNumber) => setCarsPage(pageNumber);
  
  // If not authenticated, show login form
  if (!auth.isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="login-container">
            <h1>{t('admin.loginTitle')}</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">{t('admin.email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={auth.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">{t('admin.password')}</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={auth.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading ? t('admin.loggingIn') : t('admin.login')}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  
  // Admin panel UI when authenticated
  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>{t('admin.title')}</h1>
          <button className="logout-btn" onClick={handleLogout}>
            {t('admin.logout')}
          </button>
        </div>
        
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'cars' ? 'active' : ''}`}
            onClick={() => setActiveTab('cars')}
          >
            {t('admin.cars')}
          </button>
          <button
            className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            {t('admin.messages')}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {activeTab === 'cars' && (
          <div className="cars-manager">
            <div className="car-form-container">
              <h2>{isEditMode ? t('admin.editCar') : t('admin.addCar')}</h2>
              
              <form className="car-form" onSubmit={saveCar} encType="multipart/form-data">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">{t('car.title')}</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={carForm.title}
                      onChange={handleCarFormChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="brand">{t('car.brand')}</label>
                    <select
                      id="brand"
                      name="brand"
                      value={carForm.brand}
                      onChange={handleCarFormChange}
                      required
                    >
                      <option value="">{t('admin.selectBrand')}</option>
                      {Object.keys(brandModels).map(brand => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="model">{t('car.model')}</label>
                    {carForm.brand ? (
                      <select
                        id="model"
                        name="model"
                        value={carForm.model}
                        onChange={handleCarFormChange}
                        required
                      >
                        <option value="">{t('admin.selectModel')}</option>
                        {brandModels[carForm.brand]?.map(model => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        )) || (
                          <option value={carForm.model}>{carForm.model}</option>
                        )}
                      </select>
                    ) : (
                      <input
                        type="text"
                        id="model"
                        name="model"
                        value={carForm.model}
                        onChange={handleCarFormChange}
                        required
                        disabled={!carForm.brand}
                      />
                    )}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">{t('car.price')}</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={carForm.price}
                      onChange={handleCarFormChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="km">{t('car.mileage')}</label>
                    <input
                      type="number"
                      id="km"
                      name="km"
                      value={carForm.km}
                      onChange={handleCarFormChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="year">{t('car.year')}</label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      value={carForm.year}
                      onChange={handleCarFormChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fuel">{t('car.fuel')}</label>
                    <select
                      id="fuel"
                      name="fuel"
                      value={carForm.fuel}
                      onChange={handleCarFormChange}
                      required
                    >
                      <option value="">{t('admin.selectFuel')}</option>
                      <option value="petrol">{t('car.fuelTypes.petrol')}</option>
                      <option value="diesel">{t('car.fuelTypes.diesel')}</option>
                      <option value="hybrid">{t('car.fuelTypes.hybrid')}</option>
                      <option value="electric">{t('car.fuelTypes.electric')}</option>
                      <option value="lpg">{t('car.fuelTypes.lpg')}</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="transmission">{t('car.transmission')}</label>
                    <select
                      id="transmission"
                      name="transmission"
                      value={carForm.transmission}
                      onChange={handleCarFormChange}
                      required
                    >
                      <option value="">{t('admin.selectTransmission')}</option>
                      <option value="manual">{t('car.transmissionTypes.manual')}</option>
                      <option value="automatic">{t('car.transmissionTypes.automatic')}</option>
                      <option value="semi-automatic">{t('car.transmissionTypes.semiAuto')}</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="power">{t('car.power')} (HP)</label>
                    <input
                      type="number"
                      id="power"
                      name="power"
                      value={carForm.power}
                      onChange={handleCarFormChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="engine_size">{t('Capacitate motor')} (L)</label>
                    <input
                      type="number"
                      id="engine_size"
                      name="engine_size"
                      value={carForm.engine_size}
                      onChange={handleCarFormChange}
                      step="0.1"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="color">{t('car.color')}</label>
                    <input
                      type="text"
                      id="color"
                      name="color"
                      value={carForm.color}
                      onChange={handleCarFormChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">{t('car.description')}</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={carForm.description}
                    onChange={handleCarFormChange}
                    required
                  ></textarea>
                </div>
                
                <div className="form-section">
                  <h3>{t('admin.features')}</h3>
                  <div className="features-grid">
                    {featureOptions.map(feature => (
                      <div key={feature.id} className="feature-checkbox">
                        <input
                          type="checkbox"
                          id={`feature-${feature.id}`}
                          checked={carForm.features.includes(feature.id)}
                          onChange={() => toggleFeature(feature.id)}
                        />
                        <label htmlFor={`feature-${feature.id}`}>
                          {feature.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="form-section">
                  <h3>{t('admin.images')}</h3>
                  <div className="images-grid">
                    {imageCategories.map(category => (
                      <div key={category.id} className="image-upload-container">
                        <label htmlFor={`image-${category.id}`} className="image-upload-label">
                          <div className="image-preview">
                            {imagePreviews[category.id] ? (
                              <img 
                                src={imagePreviews[category.id]} 
                                alt={category.name} 
                                className="preview"
                              />
                            ) : (
                              <div className="no-preview">
                                <span>{category.name}</span>
                              </div>
                            )}
                          </div>
                          <span className="image-category-name">{category.name}</span>
                        </label>
                        <input
                          type="file"
                          id={`image-${category.id}`}
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, category.id)}
                          className="image-upload-input"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={loading}
                  >
                    {loading ? t('admin.saving') : t('admin.save')}
                  </button>
                  
                  {isEditMode && (
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={resetCarForm}
                    >
                      {t('admin.cancel')}
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            <div className="cars-list">
              <h2>{t('admin.carsList')}</h2>
              
              {loading && <div className="loading-spinner"></div>}
              
              {!loading && cars.length === 0 ? (
                <div className="no-items">{t('admin.noCars')}</div>
              ) : (
                <>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{t('car.id')}</th>
                        <th>{t('car.brand')}</th>
                        <th>{t('car.model')}</th>
                        <th>{t('car.year')}</th>
                        <th>{t('car.price')}</th>
                        <th>{t('car.mileage')}</th>
                        <th>{t('admin.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCars.map(car => (
                        <tr key={car.id}>
                        <td>{car.id || '-'}</td>
                        <td>{car.brand || '-'}</td>
                        <td>{car.model || '-'}</td>
                        <td>{car.year || '-'}</td>
                        <td>{car.price ? `${car.price} €` : '-'}</td>
                        <td>{car.km ? `${car.km.toLocaleString()} km` : '-'}</td>
                        <td className="actions-cell">
                          <button
                            className="edit-btn"
                            onClick={() => editCar(car)}
                          >
                            {t('admin.edit')}
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteCar(car.id)}
                          >
                            {t('admin.delete')}
                          </button>
                        </td>
                      </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Pagination controls */}
                  {totalCarsPages > 1 && (
                    <div className="pagination">
                      {Array.from({ length: totalCarsPages }, (_, i) => (
                        <button
                          key={i + 1}
                          className={`page-btn ${carsPage === i + 1 ? 'active' : ''}`}
                          onClick={() => paginate(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'messages' && (
          <div className="messages-manager">
            <h2>{t('admin.messagesList')}</h2>
            
            {loading && <div className="loading-spinner"></div>}
            
            {!loading && messages.length === 0 ? (
              <div className="no-items">{t('admin.noMessages')}</div>
            ) : (
              <div className="messages-list">
                {messages.map(message => (
                  <div key={message.id} className="message-card">
                    <div className="message-header">
                      <div className="message-sender">
                        <strong>{message.name}</strong> &lt;{message.email}&gt;
                      </div>
                      <div className="message-date">
                        {new Date(message.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="message-phone">
                      {t('contact.phone')}: {message.phone}
                    </div>
                    <div className="message-content">{message.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
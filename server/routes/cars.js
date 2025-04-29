const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Car = require('../models/Car');
const { authenticateToken } = require('./auth');
const { Sequelize } = require('sequelize');



// Actualizează funcția de procesare a imaginilor cu mai multe mesaje de debug

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    console.log('Director de încărcare:', uploadDir);
    
    // Creează directorul dacă nu există
    if (!fs.existsSync(uploadDir)) {
      console.log('Directorul nu există, îl creez acum...');
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Director creat cu succes!');
      } catch (error) {
        console.error('Eroare la crearea directorului:', error);
      }
    } else {
      console.log('Directorul există deja.');
    }
    
    // Verifică permisiunile
    try {
      fs.accessSync(uploadDir, fs.constants.W_OK);
      console.log('Directorul are permisiuni de scriere.');
    } catch (error) {
      console.error('Eroare de permisiuni la director:', error);
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Crează un nume de fișier unic
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    const newFilename = uniqueSuffix + fileExt;
    console.log('Salvez fișierul cu numele:', newFilename);
    cb(null, newFilename);
  }
});



// Actualizează funcția de manipulare a cererilor POST pentru mai multă diagnosticare
router.post('/', authenticateToken, (req, res, next) => {
  console.log('Cerere POST primită pentru crearea unei mașini noi');
  
  imageUpload(req, res, async (err) => {
    if (err) {
      console.error('Eroare la încărcarea imaginilor:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Dimensiunea fișierului este prea mare. Dimensiunea maximă este 5MB.' });
      }
      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ error: 'Tip de fișier invalid. Sunt permise doar imagini.' });
      }
      return res.status(400).json({ error: `Eroare la încărcarea fișierelor: ${err.message}` });
    }
    
    try {
      console.log('Toate fișierele au fost încărcate cu succes');
      console.log('Body-ul cererii:', req.body);
      
      // Procesează imaginile încărcate
      const images = processImageUploads(req);
      
      // Procesează array-ul de features
      let features = [];
      if (req.body.features) {
        try {
          console.log('Procesez features din:', req.body.features);
          if (typeof req.body.features === 'string') {
            features = JSON.parse(req.body.features);
          } else if (Array.isArray(req.body.features)) {
            features = req.body.features;
          }
          console.log('Features procesate:', features);
        } catch (error) {
          console.error('Eroare la parsarea features:', error);
        }
      }
      
      // Creează datele mașinii
      const carData = {
        title: req.body.title,
        brand: req.body.brand,
        model: req.body.model,
        price: parseFloat(req.body.price),
        km: parseInt(req.body.km),
        year: parseInt(req.body.year),
        fuel: req.body.fuel,
        transmission: req.body.transmission,
        power: req.body.power ? parseInt(req.body.power) : null,
        engine_size: req.body.engine_size ? parseFloat(req.body.engine_size) : null,
        color: req.body.color,
        description: req.body.description,
        features: features,
        images: images
      };
      
      console.log('Date mașină pentru creare:', JSON.stringify(carData, null, 2));
      
      const car = await Car.create(carData);
      console.log('Mașină creată cu succes:', car.id);
      
      res.status(201).json(car);
    } catch (err) {
      console.error('Eroare la crearea mașinii:', err);
      res.status(500).json({ error: 'Eroare la crearea mașinii: ' + err.message });
    }
  });
});

// Fix 2: Improve file filter to provide better error messages
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    const error = new Error('Only image files are allowed!');
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Îmbunătățirea funcției de procesare a imaginilor
const processImageUploads = (req) => {
  console.log('Procesez încărcările de imagini...');
  console.log('req.files:', JSON.stringify(req.files, null, 2));
  
  const imageFields = {};
  
  // Procesează fișierele încărcate
  if (req.files && Object.keys(req.files).length > 0) {
    console.log('Fișiere detectate pentru procesare.');
    
    Object.keys(req.files).forEach(fieldName => {
      console.log(`Procesez câmpul: ${fieldName}`);
      
      // Extrage categoria din numele câmpului (ex: "image_front" -> "front")
      const category = fieldName.replace('image_', '');
      if (req.files[fieldName] && req.files[fieldName][0]) {
        const file = req.files[fieldName][0];
        console.log('Detalii fișier:', file.filename, file.path, file.mimetype);
        
        // Calea la care va fi accesibilă imaginea din frontend
        // IMPORTANT: Asigură-te că URL-ul începe cu / pentru a fi relativ la root
        const imagePath = `/uploads/${file.filename}`;
        console.log(`Setez ${category} la path: ${imagePath}`);
        imageFields[category] = imagePath;
      } else {
        console.log(`Niciun fișier în câmpul ${fieldName}`);
      }
    });
  } else {
    console.log('Nu s-au detectat fișiere în cerere.');
  }
  
  // Procesează imagini existente care nu au fost modificate
  if (req.body.existing_images) {
    console.log('Procesez imagini existente din request.body');
    try {
      let existingImages = {};
      
      // Verifică dacă existing_images este string sau obiect
      if (typeof req.body.existing_images === 'string') {
        existingImages = JSON.parse(req.body.existing_images);
      } else {
        existingImages = req.body.existing_images;
      }
      
      console.log('Imagini existente:', existingImages);
      
      // Combină imaginile existente cu cele noi, noile încărcări având prioritate
      Object.keys(existingImages).forEach(category => {
        if (!imageFields[category]) {
          // Asigură-te că calea începe cu /
          let imagePath = existingImages[category];
          if (imagePath && !imagePath.startsWith('/')) {
            imagePath = '/' + imagePath;
          }
          console.log(`Folosesc imaginea existentă pentru ${category}: ${imagePath}`);
          imageFields[category] = imagePath;
        }
      });
    } catch (error) {
      console.error('Eroare la parsarea imaginilor existente:', error);
    }
  }
  
  console.log('Imagini finale pentru salvare:', imageFields);
  return imageFields;
};

// Adaugă această funcție în routes/cars.js pentru o rută de debug
// Poate fi accesată la http://localhost:5000/api/cars/debug
router.get('/debug', async (req, res) => {
  try {
    const cars = await Car.findAll();
    const result = cars.map(car => {
      const images = car.images;
      
      // Convertește URL-urile relative în URL-uri absolute pentru verificare
      const absoluteImages = {};
      if (typeof images === 'object' && images !== null) {
        Object.keys(images).forEach(key => {
          let path = images[key];
          if (path && !path.startsWith('http')) {
            // Dacă nu începe cu /, adaugă /
            if (!path.startsWith('/')) {
              path = '/' + path;
            }
            absoluteImages[key] = `http://localhost:5000${path}`;
          } else {
            absoluteImages[key] = path;
          }
        });
      }
      
      return {
        id: car.id,
        title: car.title,
        brand: car.brand,
        model: car.model,
        rawImages: car.images,
        parsedImages: images,
        absoluteImages
      };
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fix 4: Update the POST route with better error handling
router.post('/', authenticateToken, (req, res, next) => {
  imageUpload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Maximum file size is 5MB.' });
      }
      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ error: 'Invalid file type. Only images are allowed.' });
      }
      return res.status(400).json({ error: `Error uploading files: ${err.message}` });
    }
    
    try {
      // Process uploaded images
      const images = processImageUploads(req);
      
      // Process features JSON array
      let features = [];
      if (req.body.features) {
        try {
          features = JSON.parse(req.body.features);
        } catch (error) {
          console.error('Error parsing features:', error);
        }
      }
      
      // Create car data
      const carData = {
        title: req.body.title,
        brand: req.body.brand,
        model: req.body.model,
        price: parseFloat(req.body.price),
        km: parseInt(req.body.km),
        year: parseInt(req.body.year),
        fuel: req.body.fuel,
        transmission: req.body.transmission,
        power: req.body.power ? parseInt(req.body.power) : null,
        engine_size: req.body.engine_size ? parseFloat(req.body.engine_size) : null,
        color: req.body.color,
        description: req.body.description,
        features: features,
        images: images
      };
      
      const car = await Car.create(carData);
      
      res.status(201).json(car);
    } catch (err) {
      console.error('Error creating car:', err);
      res.status(500).json({ error: 'Error creating car: ' + err.message });
    }
  });
});

// Fix 5: Update the PUT route similarly
router.put('/:id', authenticateToken, (req, res, next) => {
  imageUpload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Maximum file size is 5MB.' });
      }
      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ error: 'Invalid file type. Only images are allowed.' });
      }
      return res.status(400).json({ error: `Error uploading files: ${err.message}` });
    }
    
    try {
      const car = await Car.findByPk(req.params.id);
      
      if (!car) {
        return res.status(404).json({ error: 'Car not found' });
      }
      
      // Process uploaded images
      const images = processImageUploads(req);
      
      // Process features JSON array
      let features = [];
      if (req.body.features) {
        try {
          features = JSON.parse(req.body.features);
        } catch (error) {
          console.error('Error parsing features:', error);
        }
      }
      
      // Update car data
      await car.update({
        title: req.body.title,
        brand: req.body.brand,
        model: req.body.model,
        price: parseFloat(req.body.price),
        km: parseInt(req.body.km),
        year: parseInt(req.body.year),
        fuel: req.body.fuel,
        transmission: req.body.transmission,
        power: req.body.power ? parseInt(req.body.power) : null,
        engine_size: req.body.engine_size ? parseFloat(req.body.engine_size) : null,
        color: req.body.color,
        description: req.body.description,
        features: features,
        images: { ...car.images, ...images }  // Combine existing images with new ones
      });
      
      res.json(car);
    } catch (err) {
      console.error('Error updating car:', err);
      res.status(500).json({ error: 'Error updating car: ' + err.message });
    }
  });
});
// Configurare pentru upload-ul de mai multe câmpuri de imagine
const imageUpload = upload.fields([
  { name: 'image_front', maxCount: 1 },
  { name: 'image_rear', maxCount: 1 },
  { name: 'image_side_left', maxCount: 1 },
  { name: 'image_side_right', maxCount: 1 },
  { name: 'image_interior_front', maxCount: 1 },
  { name: 'image_interior_rear', maxCount: 1 },
  { name: 'image_dashboard', maxCount: 1 },
  { name: 'image_trunk', maxCount: 1 },
  { name: 'image_engine', maxCount: 1 }
]);

// Rute

// GET toate mașinile cu filtre
router.get('/', async (req, res) => {
  try {
    const { 
      brand, 
      minPrice, 
      maxPrice, 
      minYear, 
      maxYear, 
      minKm, 
      maxKm,
      fuel,
      transmission
    } = req.query;
    
    const where = {};
    
    // Aplică filtrele
    if (brand) where.brand = brand;
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }
    
    if (minYear || maxYear) {
      where.year = {};
      if (minYear) where.year[Op.gte] = parseInt(minYear);
      if (maxYear) where.year[Op.lte] = parseInt(maxYear);
    }
    
    if (minKm || maxKm) {
      where.km = {};
      if (minKm) where.km[Op.gte] = parseInt(minKm);
      if (maxKm) where.km[Op.lte] = parseInt(maxKm);
    }
    
    if (fuel) where.fuel = fuel;
    if (transmission) where.transmission = transmission;
    
    const cars = await Car.findAll({ 
      where,
      order: [['createdAt', 'DESC']]
    });
    
    res.json(cars);
  } catch (err) {
    console.error('Error fetching cars:', err);
    res.status(500).json({ error: 'Error fetching cars' });
  }
});

// GET o mașină după ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    res.json(car);
  } catch (err) {
    console.error('Error fetching car:', err);
    res.status(500).json({ error: 'Error fetching car' });
  }
});

// POST (creează) o mașină nouă
router.post('/', authenticateToken, imageUpload, async (req, res) => {
  try {
    // Procesează imaginile încărcate
    const images = processImageUploads(req);
    
    // Procesează array-ul de features JSON
    let features = [];
    if (req.body.features) {
      try {
        features = JSON.parse(req.body.features);
      } catch (error) {
        console.error('Eroare la parsarea features:', error);
      }
    }
    
    // Creează datele mașinii
    const carData = {
      title: req.body.title,
      brand: req.body.brand,
      model: req.body.model,
      price: parseFloat(req.body.price),
      km: parseInt(req.body.km),
      year: parseInt(req.body.year),
      fuel: req.body.fuel,
      transmission: req.body.transmission,
      power: req.body.power ? parseInt(req.body.power) : null,
      engine_size: req.body.engine_size ? parseFloat(req.body.engine_size) : null,
      color: req.body.color,
      description: req.body.description,
      features: features,
      images: images
    };
    
    const car = await Car.create(carData);
    
    res.status(201).json(car);
  } catch (err) {
    console.error('Error creating car:', err);
    res.status(500).json({ error: 'Error creating car' });
  }
});

// Rută pentru a obține lista de mărci unice
router.get('/brands', async (req, res) => {
  try {
    // Verificăm dacă modelul Sequelize are metoda findAll
    if (typeof Car.findAll !== 'function') {
      throw new Error('Car model nu are metoda findAll');
    }
    
    console.log('Obținem lista de mărci din baza de date...');
    
    // Obține lista de mărci unice din baza de date
    const brands = await Car.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('brand')), 'brand']],
      order: [['brand', 'ASC']]
    });
    
    // Verifică rezultatul
    if (!brands || !Array.isArray(brands)) {
      console.error('Rezultatul obținut nu este un array:', brands);
      return res.status(500).json({ error: 'Eroare la obținerea mărcilor' });
    }
    
    // Extrage valorile din rezultat
    const brandValues = brands.map(item => item.get('brand')).filter(brand => !!brand);
    
    console.log('Mărci găsite:', brandValues);
    
    res.json(brandValues);
  } catch (err) {
    console.error('Error fetching brands:', err);
    
    // Returnează lista predefinită de mărci în caz de eroare
    const defaultBrands = [
      'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Toyota', 
      'Honda', 'Ford', 'Fiat', 'Renault', 'Peugeot', 'Opel',
      'Škoda', 'Hyundai', 'Kia', 'Nissan', 'Mazda', 'Citroën',
      'Volvo', 'Subaru', 'Jeep', 'Land Rover', 'Tesla', 'Seat',
      'Dacia', 'Mitsubishi', 'Suzuki', 'Mini', 'Alfa Romeo',
      'Porsche', 'Jaguar', 'Lexus'
    ];
    
    res.json(defaultBrands);
  }
});

// PUT (actualizează) o mașină existentă
router.put('/:id', authenticateToken, imageUpload, async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    // Procesează imaginile încărcate
    const images = processImageUploads(req);
    
    // Procesează array-ul de features JSON
    let features = [];
    if (req.body.features) {
      try {
        features = JSON.parse(req.body.features);
      } catch (error) {
        console.error('Eroare la parsarea features:', error);
      }
    }
    
    // Actualizează datele mașinii
    await car.update({
      title: req.body.title,
      brand: req.body.brand,
      model: req.body.model,
      price: parseFloat(req.body.price),
      km: parseInt(req.body.km),
      year: parseInt(req.body.year),
      fuel: req.body.fuel,
      transmission: req.body.transmission,
      power: req.body.power ? parseInt(req.body.power) : null,
      engine_size: req.body.engine_size ? parseFloat(req.body.engine_size) : null,
      color: req.body.color,
      description: req.body.description,
      features: features,
      images: { ...car.images, ...images } // Combină imaginile existente cu cele noi
    });
    
    res.json(car);
  } catch (err) {
    console.error('Error updating car:', err);
    res.status(500).json({ error: 'Error updating car' });
  }
});

// DELETE o mașină
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    // Șterge imaginile asociate din directorul de uploads
    if (car.images) {
      Object.values(car.images).forEach(imagePath => {
        if (imagePath && typeof imagePath === 'string') {
          // Elimină calea relativă din URL-ul imaginii pentru a obține numele fișierului
          const fileName = imagePath.replace('/uploads/', '');
          const filePath = path.join(__dirname, '../uploads', fileName);
          
          // Verifică dacă fișierul există și șterge-l
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      });
    }
    
    // Șterge mașina din baza de date
    await car.destroy();
    
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting car:', err);
    res.status(500).json({ error: 'Error deleting car' });
  }
});

module.exports = router;
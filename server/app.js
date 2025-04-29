// În server/app.js
// Adaugă resetarea bazei de date

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const db = require('./config/db');

const carsRoutes = require('./routes/cars');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Creează directorul uploads dacă nu există
const uploadsDir = path.join(__dirname, 'uploads');
console.log('Director uploads path:', uploadsDir);

if (!fs.existsSync(uploadsDir)) {
  console.log('Directorul uploads nu există. Îl creez...');
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Director uploads creat cu succes!');
  } catch (error) {
    console.error('Eroare la crearea directorului uploads:', error);
  }
}

// Servește fișierele din directorul uploads ca fișiere statice
app.use('/uploads', express.static(uploadsDir));

// Rute API
app.use('/api/cars', carsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);

// Rută pentru a verifica starea bazei de date
app.get('/api/db-status', async (req, res) => {
  try {
    // Verifică tabela Cars
    const [tables] = await db.query("SELECT name FROM sqlite_master WHERE type='table'");
    const [columns] = await db.query("PRAGMA table_info(Cars)");
    
    res.json({
      tables: tables.map(t => t.name),
      carsColumns: columns.map(c => ({ name: c.name, type: c.type }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/uploads', (req, res, next) => {
    console.log(`Cerere pentru fișier static: ${req.url}`);
    
    // Adaugă header CORS explicit pentru fișiere statice
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    next();
  }, express.static(path.join(__dirname, 'uploads')));
  
  // Adaugă o rută de test pentru verificarea fișierelor
  app.get('/api/test-file/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({
          exists: false,
          error: `Fișierul ${filename} nu există.`,
          requestedPath: filePath
        });
      }
      
      // Fișierul există
      res.json({
        exists: true,
        size: fs.statSync(filePath).size,
        path: filePath,
        url: `/uploads/${filename}`
      });
    });
  });
  
// Inițializare DB
async function initializeDatabase() {
  try {
    // Verifică și resetează schema dacă e necesar
    if (db.resetDatabaseIfNeeded) {
      const wasReset = await db.resetDatabaseIfNeeded();
      if (wasReset) {
        console.log('Baza de date a fost resetată. Se va sincroniza noua schemă...');
      }
    }
    
    // Sincronizează modelele cu baza de date
    await db.sync({ alter: true });
    console.log('Baza de date sincronizată cu succes!');
  } catch (error) {
    console.error('Eroare la inițializarea bazei de date:', error);
    process.exit(1); // Ieși din aplicație în caz de eroare gravă
  }
}

// Pornește serverul după inițializarea bazei de date
initializeDatabase().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server pornit pe portul ${PORT}`);
    console.log(`Accesează http://localhost:${PORT}/api/db-status pentru a verifica starea DB`);
  });
});

module.exports = app;
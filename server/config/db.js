// În server/config/db.js
// Modifică configurarea Sequelize pentru a reseta schema dacă este necesar

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Creează o instanță Sequelize cu SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log // Activează logging-ul pentru a vedea interogările SQL
});

// Exportă instanța Sequelize
module.exports = sequelize;

// Funcție pentru verificarea și resetarea schemei dacă e necesar
// Poți rula acest cod separat sau îl poți include în app.js
async function resetDatabaseIfNeeded() {
  try {
    // Verifică conexiunea
    await sequelize.authenticate();
    console.log('Conexiune la baza de date stabilită cu succes.');
    
    // Verifică dacă există tabelul Cars
    const [results] = await sequelize.query("PRAGMA table_info(Cars)");
    
    // Verifică dacă coloana model există
    const modelColumn = results.find(col => col.name === 'model');
    
    if (!modelColumn) {
      console.log('Coloana "model" nu există. Se va reseta schema bazei de date...');
      
      // Resetează schema (va șterge toate datele!)
      await sequelize.query("DROP TABLE IF EXISTS Cars");
      console.log('Tabelul Cars a fost șters. Modelele vor recrea schema corectă.');
      
      return true; // Schema a fost resetată
    }
    
    console.log('Schema bazei de date este corectă.');
    return false; // Nu a fost nevoie de resetare
    
  } catch (error) {
    console.error('Eroare la verificarea/resetarea bazei de date:', error);
    throw error;
  }
}

// Exportă și funcția de resetare
module.exports.resetDatabaseIfNeeded = resetDatabaseIfNeeded;
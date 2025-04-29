// În server/models/Car.js
// Modelul Car actualizat pentru compatibilitate SQLite

const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Car = db.define('Car', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  km: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fuel: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  transmission: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  power: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  engine_size: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ''
  },
  features: {
    type: DataTypes.TEXT, // Folosim TEXT în loc de JSON pentru SQLite
    allowNull: false,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('features');
      if (!rawValue) return [];
      try {
        return JSON.parse(rawValue);
      } catch (error) {
        console.error('Eroare la parsarea features:', error);
        return [];
      }
    },
    set(value) {
      let stringValue;
      if (typeof value === 'string') {
        try {
          // Verifică dacă este deja JSON valid
          JSON.parse(value);
          stringValue = value;
        } catch (e) {
          // Nu este JSON valid, setează ca array gol
          stringValue = '[]';
        }
      } else {
        // Convertește array sau obiect în string JSON
        stringValue = JSON.stringify(value || []);
      }
      this.setDataValue('features', stringValue);
    }
  },
  images: {
    type: DataTypes.TEXT, // Folosim TEXT în loc de JSON pentru SQLite
    allowNull: false,
    defaultValue: '{}',
    get() {
      const rawValue = this.getDataValue('images');
      if (!rawValue) return {};
      try {
        return JSON.parse(rawValue);
      } catch (error) {
        console.error('Eroare la parsarea images:', error);
        return {};
      }
    },
    set(value) {
      let stringValue;
      if (typeof value === 'string') {
        try {
          // Verifică dacă este deja JSON valid
          JSON.parse(value);
          stringValue = value;
        } catch (e) {
          // Nu este JSON valid, setează ca obiect gol
          stringValue = '{}';
        }
      } else {
        // Convertește array sau obiect în string JSON
        stringValue = JSON.stringify(value || {});
      }
      this.setDataValue('images', stringValue);
    }
  }
}, {
  // Opțiuni pentru model
  timestamps: true, // Adaugă createdAt și updatedAt
  tableName: 'Cars' // Specifică exact numele tabelului
});

module.exports = Car;
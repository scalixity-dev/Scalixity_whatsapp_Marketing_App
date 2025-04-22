const { Sequelize } = require('sequelize');
require('dotenv').config();

// You can use environment variables for sensitive info
const sequelize = new Sequelize(
  process.env.DB_NAME || 'whatsapp_marketing',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql', // Change to 'postgres' if using PostgreSQL
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
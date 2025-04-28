const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'name'
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'phone_number'
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'company'
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'position'
  },
  imported_from: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'imported_from'
  },
  imported_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'imported_at'
  },
  last_contacted: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_contacted'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'blocked', 'responded'),
    defaultValue: 'active',
    field: 'status'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'notes'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'contacts'
});

module.exports = Contact; 
// models/Message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Contact = require('./contactModel');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  contactId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'contact_id',
    references: {
      model: Contact,
      key: 'id'
    }
  },
  direction: {
    type: DataTypes.ENUM('incoming', 'outgoing'),
    allowNull: false,
    field: 'direction'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'content'
  },
  messageType: {
    type: DataTypes.ENUM('text', 'image', 'audio', 'video', 'document', 'location', 'contact', 'interactive'),
    defaultValue: 'text',
    field: 'message_type'
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'timestamp'
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'delivered', 'read', 'failed'),
    defaultValue: 'pending',
    field: 'status'
  },
  messageId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'message_id'
  },
  isCampaignMessage: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_campaign_message'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'messages'
});

// Define relationship
Message.belongsTo(Contact, { foreignKey: 'contactId' });
Contact.hasMany(Message, { foreignKey: 'contactId' });

module.exports = Message;
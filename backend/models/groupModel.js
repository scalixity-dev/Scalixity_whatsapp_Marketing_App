const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Contact = require('./contactModel');

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'groups'
});

// Define the many-to-many relationship between Group and Contact
const GroupContact = sequelize.define('GroupContact', {}, {
  timestamps: true,
  tableName: 'group_contacts'
});

// Define the associations with explicit foreign key names
Group.belongsToMany(Contact, { 
  through: GroupContact,
  foreignKey: 'groupId',
  otherKey: 'contactId'
});

Contact.belongsToMany(Group, { 
  through: GroupContact,
  foreignKey: 'contactId',
  otherKey: 'groupId'
});

module.exports = { Group, GroupContact };
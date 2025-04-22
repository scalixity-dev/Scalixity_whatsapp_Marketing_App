const sequelize = require('../config/database');
const Contact = require('./contactModel');
const { Group, GroupContact } = require('./groupModel');

// Make sure associations are defined after both models are loaded
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

module.exports = {
  Contact,
  Group,
  GroupContact
};
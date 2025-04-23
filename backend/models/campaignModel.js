const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Contact = require('./contactModel');
const Template = require('./templateModel');
const { Group } = require('./groupModel');

const Campaign = sequelize.define('Campaign', {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description'
  },
  template_message: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'template_message'
  },
  status: {
    type: DataTypes.ENUM('draft', 'scheduled', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'draft',
    field: 'status'
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'scheduled_at'
  },
  started_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'started_at'
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at'
  },
  contact_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'contact_count'
  },
  delivered_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'delivered_count'
  },
  read_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'read_count'
  },
  replied_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'replied_count'
  },
  template_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'template_id',
    references: {
      model: Template,
      key: 'id'
    }
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'campaigns'
});

// Define the many-to-many relationship between Campaign and Contact
const CampaignContact = sequelize.define('CampaignContact', {
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'delivered', 'read', 'replied', 'failed'),
    defaultValue: 'pending'
  },
  sent_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  delivered_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  replied_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'campaign_contacts'
});

// Define the many-to-many relationship between Campaign and Group
const CampaignGroup = sequelize.define('CampaignGroup', {}, {
  timestamps: true,
  tableName: 'campaign_groups'
});

// Define associations
Campaign.belongsToMany(Contact, { 
  through: CampaignContact,
  foreignKey: 'campaign_id',
  otherKey: 'contact_id'
});

Contact.belongsToMany(Campaign, { 
  through: CampaignContact,
  foreignKey: 'contact_id',
  otherKey: 'campaign_id'
});

Campaign.belongsToMany(Group, { 
  through: CampaignGroup,
  foreignKey: 'campaign_id',
  otherKey: 'group_id'
});

Group.belongsToMany(Campaign, { 
  through: CampaignGroup,
  foreignKey: 'group_id',
  otherKey: 'campaign_id'
});

// Associate Campaign with Template
Campaign.belongsTo(Template, { foreignKey: 'template_id' });
Template.hasMany(Campaign, { foreignKey: 'template_id' });

module.exports = { Campaign, CampaignContact, CampaignGroup };
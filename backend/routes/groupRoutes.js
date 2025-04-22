const express = require('express');
const router = express.Router();
const { Group, Contact, GroupContact } = require('../models');
const { Op } = require('sequelize');

// Get all groups with their contacts
router.get('/', async (req, res) => {
  try {
    const groups = await Group.findAll({
      include: [{
        model: Contact,
        through: { attributes: [] } // Exclude join table attributes
      }]
    });
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Get a single group by ID
router.get('/:id', async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [{
        model: Contact,
        through: { attributes: [] }
      }]
    });
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    res.json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

// Create a new group
router.post('/', async (req, res) => {
  try {
    const { name, description, contactIds } = req.body;
    
    // Create the group
    const group = await Group.create({
      name,
      description
    });
    
    // Add contacts to the group if contactIds are provided
    if (contactIds && contactIds.length > 0) {
      await group.addContacts(contactIds);
    }
    
    // Fetch the created group with its contacts
    const createdGroup = await Group.findByPk(group.id, {
      include: [{
        model: Contact,
        through: { attributes: [] }
      }]
    });
    
    res.status(201).json(createdGroup);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// Update a group
router.put('/:id', async (req, res) => {
  try {
    const { name, description, contactIds } = req.body;
    const group = await Group.findByPk(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    // Update group details
    await group.update({
      name,
      description
    });
    
    // Update contacts if contactIds are provided
    if (contactIds) {
      await group.setContacts(contactIds);
    }
    
    // Fetch the updated group with its contacts
    const updatedGroup = await Group.findByPk(group.id, {
      include: [{
        model: Contact,
        through: { attributes: [] }
      }]
    });
    
    res.json(updatedGroup);
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ error: 'Failed to update group' });
  }
});

// Delete a group
router.delete('/:id', async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    await group.destroy();
    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

// Add contacts to a group
router.post('/:id/contacts', async (req, res) => {
  try {
    const { contactIds } = req.body;
    const group = await Group.findByPk(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    await group.addContacts(contactIds);
    
    // Fetch the updated group with its contacts
    const updatedGroup = await Group.findByPk(group.id, {
      include: [{
        model: Contact,
        through: { attributes: [] }
      }]
    });
    
    res.json(updatedGroup);
  } catch (error) {
    console.error('Error adding contacts to group:', error);
    res.status(500).json({ error: 'Failed to add contacts to group' });
  }
});

// Remove contacts from a group
router.delete('/:id/contacts', async (req, res) => {
  try {
    const { contactIds } = req.body;
    const group = await Group.findByPk(req.params.id);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    await group.removeContacts(contactIds);
    
    // Fetch the updated group with its contacts
    const updatedGroup = await Group.findByPk(group.id, {
      include: [{
        model: Contact,
        through: { attributes: [] }
      }]
    });
    
    res.json(updatedGroup);
  } catch (error) {
    console.error('Error removing contacts from group:', error);
    res.status(500).json({ error: 'Failed to remove contacts from group' });
  }
});

// Import contacts from CSV and create a group
router.post('/import', async (req, res) => {
  try {
    const { name, description, contacts } = req.body;
    
    // Create the group
    const group = await Group.create({
      name,
      description
    });
    
    // Create contacts and add them to the group
    const createdContacts = await Promise.all(
      contacts.map(contact => 
        Contact.create({
          name: contact.name,
          phoneNumber: contact.phone,
          // Include other fields from the updated Contact model
          company: contact.company || null,
          position: contact.position || null,
          importedFrom: 'csv-import',
          status: 'active',
          notes: contact.notes || null
        })
      )
    );
    
    // Add all created contacts to the group
    await group.addContacts(createdContacts.map(contact => contact.id));
    
    // Fetch the created group with its contacts
    const createdGroup = await Group.findByPk(group.id, {
      include: [{
        model: Contact,
        through: { attributes: [] }
      }]
    });
    
    res.status(201).json(createdGroup);
  } catch (error) {
    console.error('Error importing contacts and creating group:', error);
    res.status(500).json({ error: 'Failed to import contacts and create group' });
  }
});

module.exports = router;
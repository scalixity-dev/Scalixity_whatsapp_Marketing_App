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
    console.log('Groups fetched:', JSON.stringify(groups.length));
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
    
    console.log(`Group ${req.params.id} fetched with ${group.Contacts ? group.Contacts.length : 0} contacts`);
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
    console.log(`Creating group "${name}" with ${contactIds ? contactIds.length : 0} contacts`);
    
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
    
    console.log(`Group created with ID ${group.id} and ${createdGroup.Contacts ? createdGroup.Contacts.length : 0} contacts`);
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
    
    console.log(`Updating group ${req.params.id} with ${contactIds ? contactIds.length : 'no'} contacts`);
    
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
    
    console.log(`Group ${req.params.id} updated with ${updatedGroup.Contacts ? updatedGroup.Contacts.length : 0} contacts`);
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
    
    console.log(`Deleting group ${req.params.id}`);
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
    
    console.log(`Adding ${contactIds ? contactIds.length : 0} contacts to group ${req.params.id}`);
    await group.addContacts(contactIds);
    
    // Fetch the updated group with its contacts
    const updatedGroup = await Group.findByPk(group.id, {
      include: [{
        model: Contact,
        through: { attributes: [] }
      }]
    });
    
    console.log(`Group ${req.params.id} now has ${updatedGroup.Contacts ? updatedGroup.Contacts.length : 0} contacts`);
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
    
    console.log(`Removing ${contactIds ? contactIds.length : 0} contacts from group ${req.params.id}`);
    await group.removeContacts(contactIds);
    
    // Fetch the updated group with its contacts
    const updatedGroup = await Group.findByPk(group.id, {
      include: [{
        model: Contact,
        through: { attributes: [] }
      }]
    });
    
    console.log(`Group ${req.params.id} now has ${updatedGroup.Contacts ? updatedGroup.Contacts.length : 0} contacts`);
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
    
    console.log(`Importing ${contacts ? contacts.length : 0} contacts to new group "${name}"`);
    
    // Create the group
    const group = await Group.create({
      name,
      description: description || `Imported group with ${contacts.length} contacts`
    });
    
    // Create contacts and add them to the group
    const createdContacts = await Promise.all(
      contacts.map(contact => 
        Contact.create({
          name: contact.name, // Use name field from CSV
          phoneNumber: contact.phone, // Use phone field from CSV
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
    
    console.log(`Imported group created with ID ${group.id} and ${createdGroup.Contacts ? createdGroup.Contacts.length : 0} contacts`);
    res.status(201).json(createdGroup);
  } catch (error) {
    console.error('Error importing contacts and creating group:', error);
    res.status(500).json({ error: 'Failed to import contacts and create group' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Contact = require('../models/contactModel');
const { parseCSV, generateCSV } = require('../utils/csvUtils');

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json({ data: contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Error fetching contacts' });
  }
});

// Get contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ data: contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Error fetching contact' });
  }
});

// Create new contact
router.post('/', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ data: contact });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Error creating contact' });
  }
});

// Update contact
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Contact.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    const contact = await Contact.findByPk(req.params.id);
    res.json({ data: contact });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Error updating contact' });
  }
});

// Delete contact
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Contact.destroy({
      where: { id: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Error deleting contact' });
  }
});

// Import contacts from CSV
router.post('/import', async (req, res) => {
  try {
    const { csvData } = req.body;
    const contacts = await parseCSV(csvData);
    const savedContacts = await Contact.bulkCreate(contacts);
    res.json({ 
      data: {
        imported: savedContacts,
        count: savedContacts.length
      }
    });
  } catch (error) {
    console.error('Error importing contacts:', error);
    res.status(500).json({ error: 'Error importing contacts' });
  }
});

// Export contacts to CSV
router.get('/export/csv', async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    const csvData = generateCSV(contacts);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.send(csvData);
  } catch (error) {
    console.error('Error exporting contacts:', error);
    res.status(500).json({ error: 'Error exporting contacts' });
  }
});

// Update contact status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const [updated] = await Contact.update(
      { status },
      { where: { id: req.params.id } }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    const contact = await Contact.findByPk(req.params.id);
    res.json({ data: contact });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ error: 'Error updating contact status' });
  }
});

// Update last contacted date
router.patch('/:id/last-contacted', async (req, res) => {
  try {
    const [updated] = await Contact.update(
      { lastContacted: new Date() },
      { where: { id: req.params.id } }
    );
    
    if (!updated) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    const contact = await Contact.findByPk(req.params.id);
    res.json({ data: contact });
  } catch (error) {
    console.error('Error updating last contacted:', error);
    res.status(500).json({ error: 'Error updating last contacted' });
  }
});

module.exports = router; 
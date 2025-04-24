const express = require('express');
const router = express.Router();
const campaignService = require('../services/campaignService');

// Get all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await campaignService.getAllCampaigns();
    res.json(campaigns);
  } catch (error) {
    console.error('Error in GET /api/campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Get campaign by ID
router.get('/:id', async (req, res) => {
  try {
    const campaign = await campaignService.getCampaignById(req.params.id);
    res.json(campaign);
  } catch (error) {
    console.error(`Error in GET /api/campaigns/${req.params.id}:`, error);
    if (error.message === 'Campaign not found') {
      res.status(404).json({ error: 'Campaign not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch campaign' });
    }
  }
});

// Create new campaign
router.post('/', async (req, res) => {
  try {
    const campaign = await campaignService.createCampaign(req.body);
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error in POST /api/campaigns:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Update campaign
router.put('/:id', async (req, res) => {
  try {
    const campaign = await campaignService.updateCampaign(req.params.id, req.body);
    res.json(campaign);
  } catch (error) {
    console.error(`Error in PUT /api/campaigns/${req.params.id}:`, error);
    if (error.message === 'Campaign not found') {
      res.status(404).json({ error: 'Campaign not found' });
    } else {
      res.status(500).json({ error: 'Failed to update campaign' });
    }
  }
});

// Delete campaign
router.delete('/:id', async (req, res) => {
  try {
    await campaignService.deleteCampaign(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(`Error in DELETE /api/campaigns/${req.params.id}:`, error);
    if (error.message === 'Campaign not found') {
      res.status(404).json({ error: 'Campaign not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete campaign' });
    }
  }
});

// Add contacts to campaign
router.post('/:id/contacts', async (req, res) => {
  try {
    const { contact_ids } = req.body;
    await campaignService.addContactsToCampaign(req.params.id, contact_ids);
    res.status(200).json({ message: 'Contacts added to campaign successfully' });
  } catch (error) {
    console.error(`Error in POST /api/campaigns/${req.params.id}/contacts:`, error);
    if (error.message === 'Campaign not found') {
      res.status(404).json({ error: 'Campaign not found' });
    } else {
      res.status(500).json({ error: 'Failed to add contacts to campaign' });
    }
  }
});

// Add groups to campaign
router.post('/:id/groups', async (req, res) => {
  try {
    const { group_ids } = req.body;
    await campaignService.addGroupsToCampaign(req.params.id, group_ids);
    res.status(200).json({ message: 'Groups added to campaign successfully' });
  } catch (error) {
    console.error(`Error in POST /api/campaigns/${req.params.id}/groups:`, error);
    if (error.message === 'Campaign not found') {
      res.status(404).json({ error: 'Campaign not found' });
    } else {
      res.status(500).json({ error: 'Failed to add groups to campaign' });
    }
  }
});

// Update campaign status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const campaign = await campaignService.updateCampaignStatus(req.params.id, status);
    res.json(campaign);
  } catch (error) {
    console.error(`Error in PATCH /api/campaigns/${req.params.id}/status:`, error);
    if (error.message === 'Campaign not found') {
      res.status(404).json({ error: 'Campaign not found' });
    } else {
      res.status(500).json({ error: 'Failed to update campaign status' });
    }
  }
});

// Update message status
router.patch('/:campaignId/messages/:contactId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const campaignContact = await campaignService.updateMessageStatus(
      req.params.campaignId,
      req.params.contactId,
      status
    );
    res.json(campaignContact);
  } catch (error) {
    console.error(`Error in PATCH /api/campaigns/${req.params.campaignId}/messages/${req.params.contactId}/status:`, error);
    if (error.message === 'Campaign contact not found') {
      res.status(404).json({ error: 'Campaign contact not found' });
    } else {
      res.status(500).json({ error: 'Failed to update message status' });
    }
  }
});

// Send campaign messages
router.post('/:id/send', async (req, res) => {
  try {
    const result = await campaignService.sendCampaignMessages(req.params.id);
    res.json(result);
  } catch (error) {
    console.error(`Error in POST /api/campaigns/${req.params.id}/send:`, error);
    res.status(500).json({ error: error.message || 'Failed to send campaign messages' });
  }
});

module.exports = router; 
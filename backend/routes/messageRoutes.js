// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageService = require('../services/messageService');

// Get all messages
router.get('/', async (req, res) => {
  try {
    const messages = await messageService.getAllMessages();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error in GET /messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get messages for a specific contact
router.get('/contact/:contactId', async (req, res) => {
  try {
    const contactId = parseInt(req.params.contactId);
    const messages = await messageService.getMessagesByContact(contactId);
    res.status(200).json(messages);
  } catch (error) {
    console.error(`Error in GET /messages/contact/${req.params.contactId}:`, error);
    res.status(500).json({ error: 'Failed to fetch messages for contact' });
  }
});

// Send a new message
router.post('/send', async (req, res) => {
  try {
    const { contactId, content, messageType, mediaUrl, isCampaignMessage } = req.body;

    if (!contactId || !content) {
      return res.status(400).json({ error: 'Contact ID and content are required' });
    }

    const message = await messageService.sendMessage({
      contactId,
      content,
      messageType,
      mediaUrl,
      isCampaignMessage
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error in POST /messages/send:', error);
    res.status(500).json({ error: error.message || 'Failed to send message' });
  }
});

// Update message status
router.put('/:messageId/status', async (req, res) => {
  try {
    const messageId = parseInt(req.params.messageId);
    const { status } = req.body;
    
    if (!['pending', 'sent', 'delivered', 'read', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    await messageService.updateMessageStatus(messageId, status);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(`Error in PUT /messages/${req.params.messageId}/status:`, error);
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

// Delete a message
router.delete('/:messageId', async (req, res) => {
  try {
    const messageId = parseInt(req.params.messageId);
    await messageService.deleteMessage(messageId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(`Error in DELETE /messages/${req.params.messageId}:`, error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
// services/messageService.js
const Message = require('../models/Message');
const Contact = require('../models/contactModel');
const { Op } = require('sequelize');

class MessageService {
  /**
   * Get all messages from the database
   */
  async getAllMessages() {
    try {
      return await Message.findAll({
        order: [['timestamp', 'ASC']]
      });
    } catch (error) {
      console.error('Error fetching all messages:', error);
      throw error;
    }
  }

  /**
   * Get messages for a specific contact
   */
  async getMessagesByContact(contactId) {
    try {
      return await Message.findAll({
        where: { contactId },
        order: [['timestamp', 'ASC']]
      });
    } catch (error) {
      console.error('Error fetching messages for contact:', error);
      throw error;
    }
  }

  /**
   * Send a new message
   */
  async sendMessage(messageData) {
    try {
      // Get the contact to get their phone number
      const contact = await Contact.findByPk(messageData.contactId);
      if (!contact) {
        throw new Error('Contact not found');
      }

      // Send the message through WhatsApp API
      const webhookService = require('./webhookService');
      const result = await webhookService.sendMessage({
        phoneNumber: contact.phone_number,
        content: messageData.content,
        messageType: messageData.messageType || 'text',
        mediaUrl: messageData.mediaUrl
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Create the message record
      const message = await Message.create({
        contactId: messageData.contactId,
        direction: 'outgoing',
        content: messageData.content,
        messageType: messageData.messageType || 'text',
        timestamp: new Date(),
        status: 'sent',
        messageId: result.data.messages[0].id,
        isCampaignMessage: messageData.isCampaignMessage || false
      });
      
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Record a received message from a contact
   */
  async receiveMessage(contactId, content, messageType = 'text', messageId = null) {
    try {
      return await Message.create({
        contactId,
        direction: 'incoming',
        content,
        messageType,
        timestamp: new Date(),
        status: 'delivered',
        messageId,
        isCampaignMessage: false
      });
    } catch (error) {
      console.error('Error recording received message:', error);
      throw error;
    }
  }

  /**
   * Update message status
   */
  async updateMessageStatus(messageId, status) {
    try {
      await Message.update(
        { status },
        { where: { id: messageId } }
      );
      return { success: true };
    } catch (error) {
      console.error('Error updating message status:', error);
      throw error;
    }
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId) {
    try {
      const result = await Message.destroy({
        where: { id: messageId }
      });
      
      if (result === 0) {
        throw new Error('Message not found');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
}

module.exports = new MessageService();
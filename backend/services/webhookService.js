const axios = require('axios');
const Contact = require('../models/contactModel');
const Message = require('../models/Message');
const { Op } = require('sequelize');

class WebhookService {
  /**
   * Verify webhook for WhatsApp Cloud API integration
   */
  verifyWebhook(mode, token, challenge, verifyToken) {
    if (mode === "subscribe" && token === verifyToken) {
      console.log("Webhook verified successfully");
      return { status: 200, data: challenge };
    } else {
      console.error("Webhook verification failed");
      return { status: 403 };
    }
  }

  /**
   * Normalize phone number for consistent comparison
   * Removes all non-numeric characters and keeps only digits
   */
  normalizePhoneNumber(phoneNumber) {
    return phoneNumber.replace(/\D/g, '');
  }

  /**
   * Process incoming WhatsApp messages
   */
  async processIncomingMessage(body) {
    // Log the incoming payload for debugging
    console.log('Received webhook payload:', JSON.stringify(body, null, 2));

    // Basic validation of the webhook payload structure
    if (!body.object || body.object !== 'whatsapp_business_account') {
      console.log("Invalid webhook object type");
      return { status: 400, error: "Invalid webhook object type" };
    }

    if (!body.entry || !Array.isArray(body.entry) || body.entry.length === 0) {
      console.log("Invalid webhook entry structure");
      return { status: 400, error: "Invalid webhook entry structure" };
    }

    const entry = body.entry[0];
    if (!entry.changes || !Array.isArray(entry.changes) || entry.changes.length === 0) {
      console.log("Invalid webhook changes structure");
      return { status: 400, error: "Invalid webhook changes structure" };
    }

    const change = entry.changes[0];
    if (!change.value) {
      console.log("Invalid webhook value structure");
      return { status: 400, error: "Invalid webhook value structure" };
    }

    // Handle different types of webhook payloads
    if (change.value.messages && Array.isArray(change.value.messages) && change.value.messages.length > 0) {
      // This is a message webhook
      const message = change.value.messages[0];
      const phoneNumberId = change.value.metadata.phone_number_id;
      const fromNumber = message.from;
      const messageBody = message.text?.body;
      const timestamp = new Date();
      const messageId = message.id;
      const messageType = message.type;

      console.log(`Received ${messageType} message from ${fromNumber}: ${messageBody}`);

      try {
        // Normalize the incoming phone number
        const normalizedIncoming = this.normalizePhoneNumber(fromNumber);
        const last10Digits = normalizedIncoming.slice(-10);
        
        // Log possible phone formats for debugging
        console.log("Checking for phone number formats:");
        console.log("- Original:", fromNumber);
        console.log("- Normalized:", normalizedIncoming);
        console.log("- Last 10 digits:", last10Digits);
        
        // First, fetch all contacts to see what formats exist in the database
        const allContacts = await Contact.findAll({
          limit: 5, // Limit to avoid too much output
          attributes: ['id', 'name', 'phone_number']
        });
        
        console.log("Sample contacts in database:");
        allContacts.forEach(c => {
          console.log(`- ID: ${c.id}, Name: ${c.name}, Phone: ${c.phone_number}, Normalized: ${this.normalizePhoneNumber(c.phone_number)}`);
        });
        
        // Find all contacts and manually compare normalized phone numbers
        const allPossibleContacts = await Contact.findAll();
        
        let matchedContact = null;
        
        for (const c of allPossibleContacts) {
          const normalizedDbPhone = this.normalizePhoneNumber(c.phone_number);
          
          // Compare normalized numbers or last 10 digits if numbers differ in length
          if (normalizedDbPhone === normalizedIncoming || 
              normalizedDbPhone.slice(-10) === last10Digits || 
              normalizedIncoming.endsWith(normalizedDbPhone)) {
            matchedContact = c;
            console.log(`Found match: DB(${normalizedDbPhone}) matches Incoming(${normalizedIncoming})`);
            break;
          }
        }
        
        if (matchedContact) {
          console.log(`Found contact: ${matchedContact.name}`);
          
          // Save the incoming message to database
          const newMessage = await Message.create({
            contactId: matchedContact.id,
            direction: 'incoming',
            content: messageBody || '',
            messageType: messageType || 'text',
            timestamp: timestamp,
            status: 'delivered',
            messageId: messageId,
            isCampaignMessage: false
          });

          // Update contact's last contacted time and status
          await Contact.update(
            { 
              last_contacted: timestamp,
              status: 'responded' 
            },
            { 
              where: { id: matchedContact.id } 
            }
          );

          // Return success
          return { 
            status: 200, 
            data: { 
              message: "Message processed successfully",
              contactId: matchedContact.id,
              messageId: newMessage.id
            }
          };
        } else {
          console.log(`Contact not found for number: ${fromNumber}`);
          // Optionally create a new contact here if desired
          return { status: 200, data: { message: "Message received, but contact not found in database" } };
        }
      } catch (error) {
        console.error("Error processing incoming message:", error);
        return { status: 500, data: { error: "Failed to process message" } };
      }
    } else if (change.value.statuses && Array.isArray(change.value.statuses) && change.value.statuses.length > 0) {
      // This is a status webhook
      const status = change.value.statuses[0];
      console.log(`Received status update for message ${status.id}: ${status.status}`);
      return { status: 200, data: { type: 'status', status: status.status } };

    } else if (change.value.errors && Array.isArray(change.value.errors) && change.value.errors.length > 0) {
      // This is an error webhook
      const error = change.value.errors[0];
      console.error(`Received error from WhatsApp API: ${error.code} - ${error.title}`);
      return { status: 400, error: error.title };

    } else {
      console.log("Unhandled webhook payload type");
      return { status: 200, data: { type: 'unhandled' } };
    }
  }

  /**
   * Send a message via WhatsApp Cloud API
   * @param {Object} messageData - Message data containing recipient and content
   * @param {string} messageData.phoneNumber - Recipient's phone number
   * @param {string} messageData.content - Message content
   * @param {string} [messageData.messageType='text'] - Type of message (text, image, document, etc.)
   * @param {string} [messageData.mediaUrl] - URL for media content (for image, document, etc.)
   * @param {Object} [messageData.template] - Template data for template messages
   * @returns {Promise<Object>} Response from WhatsApp API
   */
  async sendMessage(messageData) {
    const {
      phoneNumber,
      content,
      messageType = 'text',
      mediaUrl,
      template
    } = messageData;

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      throw new Error('WhatsApp credentials not configured');
    }

    try {
      let messagePayload;
      
      if (messageType === 'template') {
        // Template message format
        messagePayload = {
          messaging_product: "whatsapp",
          to: this.normalizePhoneNumber(phoneNumber),
          type: "template",
          template: {
            name: template.name,
            language: {
              code: "en"
            }
          }
        };
      } else {
        // Regular message format
        messagePayload = {
          messaging_product: "whatsapp",
          to: this.normalizePhoneNumber(phoneNumber),
        };

        switch (messageType) {
          case 'text':
            messagePayload.text = { body: content };
            break;
          case 'image':
            messagePayload.image = { link: mediaUrl };
            break;
          case 'document':
            messagePayload.document = { link: mediaUrl };
            break;
          case 'audio':
            messagePayload.audio = { link: mediaUrl };
            break;
          case 'video':
            messagePayload.video = { link: mediaUrl };
            break;
          default:
            throw new Error(`Unsupported message type: ${messageType}`);
        }
      }

      console.log('Sending WhatsApp message with payload:', JSON.stringify(messagePayload, null, 2));

      const response = await axios({
        method: "POST",
        url: `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`,
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        data: messagePayload
      });

      console.log('WhatsApp API response:', JSON.stringify(response.data, null, 2));

      // Save the message to database
      const contact = await Contact.findOne({
        where: {
          phone_number: {
            [Op.like]: `%${this.normalizePhoneNumber(phoneNumber)}`
          }
        }
      });

      if (contact) {
        await Message.create({
          contactId: contact.id,
          direction: 'outgoing',
          content: content || `Template: ${template?.name}`,
          messageType: messageType,
          timestamp: new Date(),
          status: 'sent',
          messageId: response.data.messages[0].id,
          isCampaignMessage: true
        });
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Error sending WhatsApp message:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Send a reply via WhatsApp Cloud API
   * @deprecated Use sendMessage instead
   */
  async sendWhatsAppReply(phoneNumberId, recipientNumber, messageContent) {
    return this.sendMessage({
      phoneNumber: recipientNumber,
      content: messageContent,
      messageType: 'text'
    });
  }
}

module.exports = new WebhookService();
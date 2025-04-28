import { Message } from '../types';
import axios from 'axios';
import API_CONFIG from '../config/api';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
});

class MessageService {
  async getAllMessages(): Promise<Message[]> {
    const response = await api.get('/messages');
    return response.data;
  }
  
  async getMessagesByContact(contactId: number): Promise<Message[]> {
    const response = await api.get(`/messages/contact/${contactId}`);
    return response.data;
  }
  
  async sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'status'>): Promise<Message> {
    const response = await api.post('/messages/send', {
      contactId: message.contactId,
      content: message.content,
      messageType: message.messageType || 'text',
      isCampaignMessage: message.isCampaignMessage || false
    });
    return response.data;
  }
  
  async updateMessageStatus(messageId: number, status: Message['status']): Promise<void> {
    await api.put(`/messages/${messageId}/status`, { status });
  }
  
  // Simulate receiving a message from a contact (this would typically be handled by WebSocket)
  async receiveMessage(contactId: number, content: string, messageType: Message['messageType'] = 'text'): Promise<Message> {
    // In a real implementation, this would be triggered by a WebSocket event
    // For now, we'll create a message directly through the API
    const response = await api.post('/messages/send', {
      contactId,
      content,
      messageType,
      direction: 'incoming',
      status: 'delivered'
    });
    return response.data;
  }
  
  getMessageById(): Promise<Message | undefined> {
    // This method is no longer used in the new implementation
    throw new Error('Method not implemented');
  }
  
  getMessagesByCampaign(): Promise<Message[]> {
    // This method is no longer used in the new implementation
    throw new Error('Method not implemented');
  }
  
  // Bulk send campaign messages
  async sendCampaignMessages(campaignId: number, contactIds: number[], messageTemplate: string): Promise<Message[]> {
    const sentMessages: Promise<Message>[] = contactIds.map(contactId => {
      // Here we would normally replace placeholders in the template with contact info
      // For simplicity, we'll just use the template as is
      return this.sendMessage({
        contactId,
        campaignId,
        direction: 'outgoing',
        content: messageTemplate,
        messageType: 'text',
        isCampaignMessage: true
      });
    });
    
    return Promise.all(sentMessages);
  }
}

export const messageService = new MessageService();
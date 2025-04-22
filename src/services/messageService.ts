import { Message } from '../types';
import { mockMessages } from '../data/mockData';

class MessageService {
  private messages: Message[] = [...mockMessages];
  
  getAllMessages(): Promise<Message[]> {
    return Promise.resolve([...this.messages]);
  }
  
  getMessageById(id: number): Promise<Message | undefined> {
    const message = this.messages.find(m => m.id === id);
    return Promise.resolve(message);
  }
  
  getMessagesByContact(contactId: number): Promise<Message[]> {
    const contactMessages = this.messages.filter(m => m.contactId === contactId);
    return Promise.resolve([...contactMessages]);
  }
  
  getMessagesByCampaign(campaignId: number): Promise<Message[]> {
    const campaignMessages = this.messages.filter(m => m.campaignId === campaignId);
    return Promise.resolve([...campaignMessages]);
  }
  
  sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'status'>): Promise<Message> {
    const newMessage: Message = {
      ...message,
      id: Math.max(0, ...this.messages.map(m => m.id)) + 1,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    this.messages.push(newMessage);
    
    // Simulate message delivery process
    setTimeout(() => {
      this.updateMessageStatus(newMessage.id, 'sent');
      
      setTimeout(() => {
        this.updateMessageStatus(newMessage.id, 'delivered');
        
        // Simulate read receipt for some messages
        if (Math.random() > 0.3) {
          setTimeout(() => {
            this.updateMessageStatus(newMessage.id, 'read');
          }, Math.random() * 60000); // Between 0 and 60 seconds
        }
      }, Math.random() * 3000 + 1000); // Between 1 and 4 seconds
    }, Math.random() * 2000 + 500); // Between 0.5 and 2.5 seconds
    
    return Promise.resolve(newMessage);
  }
  
  updateMessageStatus(id: number, status: Message['status']): Promise<Message | undefined> {
    const index = this.messages.findIndex(m => m.id === id);
    if (index === -1) {
      return Promise.resolve(undefined);
    }
    
    this.messages[index] = { ...this.messages[index], status };
    return Promise.resolve(this.messages[index]);
  }
  
  // Simulate receiving a message from a contact
  receiveMessage(contactId: number, content: string, messageType: Message['messageType'] = 'text', mediaUrl?: string): Promise<Message> {
    const newMessage: Message = {
      id: Math.max(0, ...this.messages.map(m => m.id)) + 1,
      contactId,
      direction: 'incoming',
      content,
      messageType,
      mediaUrl,
      timestamp: new Date().toISOString(),
      status: 'read', // Incoming messages are always marked as read
      isCampaignMessage: false
    };
    
    this.messages.push(newMessage);
    return Promise.resolve(newMessage);
  }
  
  // Bulk send campaign messages
  sendCampaignMessages(campaignId: number, contactIds: number[], messageTemplate: string): Promise<Message[]> {
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
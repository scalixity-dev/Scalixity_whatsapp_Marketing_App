import { DashboardStats, Message } from '../types';
import { mockDashboardStats } from '../data/mockData';
import { messageService } from './messageService';
import { campaignService } from './campaignService';
import { contactService } from './contactService';

class AnalyticsService {
  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    // In a real application, this would calculate stats from actual data
    // For now, we'll return mock data but gradually transition to real calculations
    
    try {
      const [campaigns, contacts] = await Promise.all([
        campaignService.getAllCampaigns(),
        contactService.getAllContacts()
      ]);
      
      // Calculate some stats from real data
      const activeContacts = contacts.filter(c => c.status === 'active' || c.status === 'responded').length;
      const activeCampaigns = campaigns.filter(c => c.status === 'in_progress' || c.status === 'scheduled').length;
      
      // For demo purposes, we'll mix real and mock data
      return {
        ...mockDashboardStats,
        totalContacts: contacts.length,
        activeContacts,
        totalCampaigns: campaigns.length,
        activeCampaigns
      };
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      return mockDashboardStats;
    }
  }
  
  // Get campaign performance metrics
  async getCampaignPerformance(campaignId: number): Promise<{
    deliveryRate: number;
    openRate: number;
    responseRate: number;
    messages: Message[];
  }> {
    try {
      const messages = await messageService.getMessagesByCampaign();
      const campaign = await campaignService.getCampaignById(campaignId);
      
      if (!campaign || !campaign.contact_count || campaign.contact_count === 0) {
        return {
          deliveryRate: 0,
          openRate: 0,
          responseRate: 0,
          messages: []
        };
      }
      
      const totalSent = messages.filter(m => m.direction === 'outgoing').length;
      const delivered = messages.filter(m => m.status === 'delivered' || m.status === 'read').length;
      const read = messages.filter(m => m.status === 'read').length;
      const responses = messages.filter(m => m.direction === 'incoming').length;
      
      return {
        deliveryRate: (delivered / Math.max(totalSent, 1)) * 100,
        openRate: (read / Math.max(totalSent, 1)) * 100,
        responseRate: (responses / Math.max(totalSent, 1)) * 100,
        messages
      };
    } catch (error) {
      console.error('Error calculating campaign performance:', error);
      return {
        deliveryRate: 0,
        openRate: 0,
        responseRate: 0,
        messages: []
      };
    }
  }
  
  // Get contact engagement metrics
  async getContactEngagement(contactId: number): Promise<{
    messagesReceived: number;
    messagesSent: number;
    responseRate: number;
    averageResponseTime?: number; // in minutes
    lastActivity?: string;
  }> {
    try {
      const messages = await messageService.getMessagesByContact(contactId);
      
      const received = messages.filter(m => m.direction === 'outgoing');
      const sent = messages.filter(m => m.direction === 'incoming');
      
      // Calculate response times
      let totalResponseTime = 0;
      let responseCount = 0;
      
      // Sort messages by timestamp
      const sortedMessages = [...messages].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      // Find pairs of messages (outgoing followed by incoming)
      for (let i = 0; i < sortedMessages.length - 1; i++) {
        const current = sortedMessages[i];
        const next = sortedMessages[i + 1];
        
        if (current.direction === 'outgoing' && next.direction === 'incoming') {
          const currentTime = new Date(current.timestamp).getTime();
          const nextTime = new Date(next.timestamp).getTime();
          const responseTime = (nextTime - currentTime) / (1000 * 60); // convert to minutes
          
          if (responseTime < 60 * 24) { // Only count responses within 24 hours
            totalResponseTime += responseTime;
            responseCount++;
          }
        }
      }
      
      const lastActivity = sortedMessages.length > 0 
        ? sortedMessages[sortedMessages.length - 1].timestamp 
        : undefined;
      
      return {
        messagesReceived: received.length,
        messagesSent: sent.length,
        responseRate: received.length > 0 ? (sent.length / received.length) * 100 : 0,
        averageResponseTime: responseCount > 0 ? totalResponseTime / responseCount : undefined,
        lastActivity
      };
    } catch (error) {
      console.error('Error calculating contact engagement:', error);
      return {
        messagesReceived: 0,
        messagesSent: 0,
        responseRate: 0
      };
    }
  }
}

export const analyticsService = new AnalyticsService();
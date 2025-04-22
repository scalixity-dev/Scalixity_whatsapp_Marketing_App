import { Campaign } from '../types';
import api from './api';

export const campaignService = {
  getAllCampaigns: async (): Promise<Campaign[]> => {
    const response = await api.get('/campaigns');
    return response.data;
  },

  getCampaignById: async (id: number): Promise<Campaign> => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  createCampaign: async (campaign: Omit<Campaign, 'id' | 'created_at'>): Promise<Campaign> => {
    try {
      const { contact_ids, ...campaignData } = campaign;
      const payload = {
        ...campaignData,
        contact_ids: contact_ids || []
      };
      
      console.log('Creating campaign with payload:', payload);
      
      const response = await api.post('/campaigns', payload);
      return response.data;
    } catch (error: any) {
      console.error('Error creating campaign:', error.response?.data || error.message);
      throw error;
    }
  },

  updateCampaign: async (id: number, campaign: Partial<Campaign>): Promise<Campaign> => {
    const response = await api.put(`/campaigns/${id}`, campaign);
    return response.data;
  },

  deleteCampaign: async (id: number): Promise<void> => {
    await api.delete(`/campaigns/${id}`);
  },

  addContactsToCampaign: async (campaignId: number, contactIds: number[]): Promise<void> => {
    await api.post(`/campaigns/${campaignId}/contacts`, { contactIds });
  },

  removeContactsFromCampaign: async (campaignId: number, contactIds: number[]): Promise<void> => {
    await api.delete(`/campaigns/${campaignId}/contacts`, { data: { contactIds } });
  },

  scheduleCampaign: async (id: number, scheduledAt: string): Promise<Campaign> => {
    const response = await api.post(`/campaigns/${id}/schedule`, { scheduledAt });
    return response.data;
  },

  startCampaign: async (id: number): Promise<Campaign> => {
    const response = await api.post(`/campaigns/${id}/start`);
    return response.data;
  },

  completeCampaign: async (id: number): Promise<Campaign> => {
    const response = await api.post(`/campaigns/${id}/complete`);
    return response.data;
  },

  cancelCampaign: async (id: number): Promise<Campaign> => {
    const response = await api.post(`/campaigns/${id}/cancel`);
    return response.data;
  }
};
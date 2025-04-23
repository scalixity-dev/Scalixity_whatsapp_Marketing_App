import { Campaign } from '../types';
import { api } from './api';

class CampaignService {
  async getAllCampaigns(): Promise<Campaign[]> {
    const response = await api.get('/campaigns');
    return response.data;
  }

  async getCampaignById(id: number): Promise<Campaign> {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  }

  async createCampaign(campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign> {
    const response = await api.post('/campaigns', campaign);
    return response.data;
  }

  async updateCampaign(id: number, campaign: Partial<Campaign>): Promise<Campaign> {
    const response = await api.put(`/campaigns/${id}`, campaign);
    return response.data;
  }

  async deleteCampaign(id: number): Promise<void> {
    await api.delete(`/campaigns/${id}`);
  }

  async addContactsToCampaign(campaignId: number, contactIds: number[]): Promise<void> {
    await api.post(`/campaigns/${campaignId}/contacts`, { contact_ids: contactIds });
  }

  async addGroupsToCampaign(campaignId: number, groupIds: number[]): Promise<void> {
    await api.post(`/campaigns/${campaignId}/groups`, { group_ids: groupIds });
  }

  async updateCampaignStatus(id: number, status: string): Promise<Campaign> {
    const response = await api.patch(`/campaigns/${id}/status`, { status });
    return response.data;
  }

  async updateMessageStatus(campaignId: number, contactId: number, status: string): Promise<void> {
    await api.patch(`/campaigns/${campaignId}/messages/${contactId}/status`, { status });
  }
}

export const campaignService = new CampaignService();
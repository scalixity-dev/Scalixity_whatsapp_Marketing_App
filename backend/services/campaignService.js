const { Campaign, CampaignContact, CampaignGroup } = require('../models/campaignModel');
const { Group } = require('../models/groupModel');
const Contact = require('../models/contactModel');
const Template = require('../models/templateModel');
const webhookService = require('./webhookService');
const axios = require('axios');

class CampaignService {
  async getAllCampaigns() {
    try {
      return await Campaign.findAll({
        include: [
          { model: Template, attributes: ['id', 'name'] },
          { model: Group, attributes: ['id', 'name'] }
        ],
        order: [['created_at', 'DESC']]
      });
    } catch (error) {
      console.error('CampaignService error - getAllCampaigns:', error);
      throw error;
    }
  }

  async getCampaignById(id) {
    try {
      const campaign = await Campaign.findByPk(id, {
        include: [
          { model: Template, attributes: ['id', 'name', 'content'] },
          { model: Group, attributes: ['id', 'name'] },
          { 
            model: Contact, 
            attributes: ['id', 'name', 'phone_number', 'company', 'position'],
            through: { attributes: ['status', 'sent_at', 'delivered_at', 'read_at', 'replied_at'] }
          }
        ]
      });
      
      if (!campaign) {
        throw new Error('Campaign not found');
      }
      
      return campaign;
    } catch (error) {
      console.error(`CampaignService error - getCampaignById(${id}):`, error);
      throw error;
    }
  }

  async createCampaign(campaignData) {
    try {
      const campaign = await Campaign.create({
        name: campaignData.name,
        description: campaignData.description,
        template_message: campaignData.template_message,
        status: campaignData.status || 'draft',
        scheduled_at: campaignData.scheduled_at,
        template_id: campaignData.template_id
      });
      
      // If contact IDs are provided, add them to the campaign
      if (campaignData.contact_ids && campaignData.contact_ids.length > 0) {
        await this.addContactsToCampaign(campaign.id, campaignData.contact_ids);
      }
      
      // If group IDs are provided, add them to the campaign
      if (campaignData.group_ids && campaignData.group_ids.length > 0) {
        await this.addGroupsToCampaign(campaign.id, campaignData.group_ids);
      }
      
      // Update contact count
      await this.updateContactCount(campaign.id);
      
      return this.getCampaignById(campaign.id);
    } catch (error) {
      console.error('CampaignService error - createCampaign:', error);
      throw error;
    }
  }

  async updateCampaign(id, campaignData) {
    try {
      const campaign = await this.getCampaignById(id);
      
      // Update campaign fields
      campaign.name = campaignData.name || campaign.name;
      campaign.description = campaignData.description || campaign.description;
      campaign.template_message = campaignData.template_message || campaign.template_message;
      campaign.status = campaignData.status || campaign.status;
      campaign.scheduled_at = campaignData.scheduled_at || campaign.scheduled_at;
      campaign.template_id = campaignData.template_id || campaign.template_id;
      
      await campaign.save();
      
      // If contact IDs are provided, update the contacts
      if (campaignData.contact_ids) {
        // Remove existing contacts
        await CampaignContact.destroy({ where: { campaign_id: id } });
        
        // Add new contacts
        if (campaignData.contact_ids.length > 0) {
          await this.addContactsToCampaign(id, campaignData.contact_ids);
        }
      }
      
      // If group IDs are provided, update the groups
      if (campaignData.group_ids) {
        // Remove existing groups
        await CampaignGroup.destroy({ where: { campaign_id: id } });
        
        // Add new groups
        if (campaignData.group_ids.length > 0) {
          await this.addGroupsToCampaign(id, campaignData.group_ids);
        }
      }
      
      // Update contact count
      await this.updateContactCount(id);
      
      return this.getCampaignById(id);
    } catch (error) {
      console.error(`CampaignService error - updateCampaign(${id}):`, error);
      throw error;
    }
  }

  async deleteCampaign(id) {
    try {
      const campaign = await this.getCampaignById(id);
      
      // Delete campaign contacts
      await CampaignContact.destroy({ where: { campaign_id: id } });
      
      // Delete campaign groups
      await CampaignGroup.destroy({ where: { campaign_id: id } });
      
      // Delete the campaign
      await campaign.destroy();
      
      return true;
    } catch (error) {
      console.error(`CampaignService error - deleteCampaign(${id}):`, error);
      throw error;
    }
  }

  async addContactsToCampaign(campaignId, contactIds) {
    try {
      const campaign = await this.getCampaignById(campaignId);
      
      // Add contacts to the campaign
      await campaign.addContacts(contactIds);
      
      // Update contact count
      await this.updateContactCount(campaignId);
      
      return true;
    } catch (error) {
      console.error(`CampaignService error - addContactsToCampaign(${campaignId}):`, error);
      throw error;
    }
  }

  async addGroupsToCampaign(campaignId, groupIds) {
    try {
      const campaign = await this.getCampaignById(campaignId);
      
      // Add groups to the campaign
      await campaign.addGroups(groupIds);
      
      // Get all contacts from the groups and add them to the campaign
      for (const groupId of groupIds) {
        const group = await Group.findByPk(groupId, {
          include: [{ model: Contact, attributes: ['id'] }]
        });
        
        if (group && group.Contacts) {
          const contactIds = group.Contacts.map(contact => contact.id);
          await this.addContactsToCampaign(campaignId, contactIds);
        }
      }
      
      return true;
    } catch (error) {
      console.error(`CampaignService error - addGroupsToCampaign(${campaignId}):`, error);
      throw error;
    }
  }

  async updateContactCount(campaignId) {
    try {
      const campaign = await this.getCampaignById(campaignId);
      
      // Count unique contacts in the campaign
      const contactCount = await CampaignContact.count({
        where: { campaign_id: campaignId }
      });
      
      // Update the campaign's contact count
      campaign.contact_count = contactCount;
      await campaign.save();
      
      return contactCount;
    } catch (error) {
      console.error(`CampaignService error - updateContactCount(${campaignId}):`, error);
      throw error;
    }
  }

  async updateCampaignStatus(id, status) {
    try {
      const campaign = await this.getCampaignById(id);
      
      campaign.status = status;
      
      // Update timestamps based on status
      if (status === 'in_progress') {
        campaign.started_at = new Date();
      } else if (status === 'completed') {
        campaign.completed_at = new Date();
      }
      
      await campaign.save();
      
      return campaign;
    } catch (error) {
      console.error(`CampaignService error - updateCampaignStatus(${id}):`, error);
      throw error;
    }
  }

  async updateMessageStatus(campaignId, contactId, status) {
    try {
      const campaignContact = await CampaignContact.findOne({
        where: { campaign_id: campaignId, contact_id: contactId }
      });
      
      if (!campaignContact) {
        throw new Error('Campaign contact not found');
      }
      
      // Update status
      campaignContact.status = status;
      
      // Update timestamps based on status
      if (status === 'sent') {
        campaignContact.sent_at = new Date();
      } else if (status === 'delivered') {
        campaignContact.delivered_at = new Date();
      } else if (status === 'read') {
        campaignContact.read_at = new Date();
      } else if (status === 'replied') {
        campaignContact.replied_at = new Date();
      }
      
      await campaignContact.save();
      
      // Update campaign counts
      await this.updateCampaignCounts(campaignId);
      
      return campaignContact;
    } catch (error) {
      console.error(`CampaignService error - updateMessageStatus(${campaignId}, ${contactId}):`, error);
      throw error;
    }
  }

  async updateCampaignCounts(campaignId) {
    try {
      const campaign = await this.getCampaignById(campaignId);
      
      // Count messages by status
      const deliveredCount = await CampaignContact.count({
        where: { campaign_id: campaignId, status: 'delivered' }
      });
      
      const readCount = await CampaignContact.count({
        where: { campaign_id: campaignId, status: 'read' }
      });
      
      const repliedCount = await CampaignContact.count({
        where: { campaign_id: campaignId, status: 'replied' }
      });
      
      // Update campaign counts
      campaign.delivered_count = deliveredCount;
      campaign.read_count = readCount;
      campaign.replied_count = repliedCount;
      
      await campaign.save();
      
      return {
        delivered_count: deliveredCount,
        read_count: readCount,
        replied_count: repliedCount
      };
    } catch (error) {
      console.error(`CampaignService error - updateCampaignCounts(${campaignId}):`, error);
      throw error;
    }
  }
}

module.exports = new CampaignService(); 
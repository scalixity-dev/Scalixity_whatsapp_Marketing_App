import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Campaign, Template, Contact, Group } from '../types';
import CampaignCard from '../components/Campaigns/CampaignCard';
import CampaignForm from '../components/Campaigns/CampaignForm';
import CampaignDetails from '../components/Campaigns/CampaignDetails';
import { campaignService } from '../services/campaignService';
import { templateService } from '../services/templateService';
import { contactService } from '../services/contactService';
import { groupService } from '../services/groupService';

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewCampaignForm, setShowNewCampaignForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch campaigns, templates, contacts, and groups in parallel
        const [campaignsData, templatesData, contactsData, groupsData] = await Promise.all([
          campaignService.getAllCampaigns(),
          templateService.getAllTemplates(),
          contactService.getAllContacts(),
          groupService.getAllGroups()
        ]);
        
        setCampaigns(campaignsData);
        setTemplates(templatesData);
        setContacts(contactsData.map(contact => ({
          ...contact,
          phone_number: contact.phone,
          created_at: String(contact.created_at || new Date().toISOString()),
          updated_at: String(contact.updated_at || new Date().toISOString()),
          imported_from: String(contact.imported_from || 'manual'),
          imported_at: new Date(contact.imported_at || Date.now()),
          status: (contact.status as 'active' | 'inactive' | 'blocked' | 'responded') || 'active'
        })));
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleCampaignClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };
  
  const handleCreateCampaign = async (
    campaignData: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'contact_count' | 'delivered_count' | 'read_count' | 'replied_count'>, 
    selectedContactIds: number[],
    selectedGroupIds: number[]
  ) => {
    setIsCreating(true);
    try {
      const newCampaign = await campaignService.createCampaign({
        ...campaignData,
        status: 'draft',
        contact_count: 0,
        delivered_count: 0,
        read_count: 0,
        replied_count: 0
      });
      
      if (selectedContactIds.length > 0) {
        await campaignService.addContactsToCampaign(newCampaign.id, selectedContactIds);
      }
      
      if (selectedGroupIds.length > 0) {
        await campaignService.addGroupsToCampaign(newCampaign.id, selectedGroupIds);
      }
      
      const updatedCampaign = await campaignService.getCampaignById(newCampaign.id);
      setCampaigns(prev => [...prev, updatedCampaign]);
      setShowNewCampaignForm(false);
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleUpdateCampaignStatus = async (campaignId: number, status: string) => {
    try {
      const updatedCampaign = await campaignService.updateCampaignStatus(campaignId, status);
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === campaignId ? updatedCampaign : campaign
      ));
      if (selectedCampaign?.id === campaignId) {
        setSelectedCampaign(updatedCampaign);
      }
    } catch (error) {
      console.error('Error updating campaign status:', error);
      alert('Failed to update campaign status. Please try again.');
    }
  };

  const handleEditCampaign = async (updatedCampaign: Campaign) => {
    try {
      const result = await campaignService.updateCampaign(updatedCampaign.id, updatedCampaign);
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === updatedCampaign.id ? result : campaign
      ));
      setSelectedCampaign(result);
    } catch (error) {
      console.error('Error updating campaign:', error);
      alert('Failed to update campaign. Please try again.');
    }
  };

  const handleDeleteCampaign = async (campaignId: number) => {
    try {
      await campaignService.deleteCampaign(campaignId);
      setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
      setSelectedCampaign(null);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign. Please try again.');
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-emerald-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }
  
  // Group campaigns by status
  const draftCampaigns = campaigns.filter(c => c.status === 'draft');
  const scheduledCampaigns = campaigns.filter(c => c.status === 'scheduled');
  const activeCampaigns = campaigns.filter(c => c.status === 'in_progress');
  const completedCampaigns = campaigns.filter(c => c.status === 'completed');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        
        <button
          className="flex items-center px-4 py-2 mt-3 md:mt-0 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setShowNewCampaignForm(!showNewCampaignForm)}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Campaign
        </button>
      </div>
      
      {showNewCampaignForm && (
        <div className="mb-6">
          <CampaignForm 
            templates={templates} 
            contacts={contacts}
            groups={groups}
            onSubmit={handleCreateCampaign}
            isLoading={isCreating}
          />
        </div>
      )}
      
      {selectedCampaign && (
        <CampaignDetails
          campaign={selectedCampaign}
          templates={templates}
          contacts={contacts}
          groups={groups}
          onClose={() => setSelectedCampaign(null)}
          onEdit={handleEditCampaign}
          onDelete={handleDeleteCampaign}
        />
      )}
      
      {campaigns.length === 0 && !showNewCampaignForm ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500 mb-4">No campaigns found</p>
          <button
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            onClick={() => setShowNewCampaignForm(true)}
          >
            Create Your First Campaign
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {activeCampaigns.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Active Campaigns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeCampaigns.map(campaign => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign} 
                    onClick={handleCampaignClick}
                    onStatusChange={handleUpdateCampaignStatus}
                  />
                ))}
              </div>
            </div>
          )}
          
          {scheduledCampaigns.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Scheduled Campaigns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scheduledCampaigns.map(campaign => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign} 
                    onClick={handleCampaignClick}
                    onStatusChange={handleUpdateCampaignStatus}
                  />
                ))}
              </div>
            </div>
          )}
          
          {draftCampaigns.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Draft Campaigns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {draftCampaigns.map(campaign => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign} 
                    onClick={handleCampaignClick}
                    onStatusChange={handleUpdateCampaignStatus}
                  />
                ))}
              </div>
            </div>
          )}
          
          {completedCampaigns.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Completed Campaigns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedCampaigns.map(campaign => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign} 
                    onClick={handleCampaignClick}
                    onStatusChange={handleUpdateCampaignStatus}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Campaigns;
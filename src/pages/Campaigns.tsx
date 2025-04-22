import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Campaign, Template, Contact } from '../types';
import CampaignCard from '../components/Campaigns/CampaignCard';
import CampaignForm from '../components/Campaigns/CampaignForm';
import { campaignService } from '../services/campaignService';
import { templateService } from '../services/templateService';
import { contactService } from '../services/contactService';

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewCampaignForm, setShowNewCampaignForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch campaigns, templates, and contacts in parallel
        const [campaignsData, templatesData, contactsData] = await Promise.all([
          campaignService.getAllCampaigns(),
          templateService.getAllTemplates(),
          contactService.getAllContacts()
        ]);
        
        setCampaigns(campaignsData);
        setTemplates(templatesData);
        setContacts(contactsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleCampaignClick = (campaign: Campaign) => {
    // This would navigate to a campaign detail page in a real app
    alert(`Viewing campaign: ${campaign.name}`);
  };
  
  const handleCreateCampaign = async (
    campaignData: Omit<Campaign, 'id' | 'created_at'>, 
    selectedContactIds: number[]
  ) => {
    setIsCreating(true);
    try {
      // Create the campaign
      const newCampaign = await campaignService.createCampaign(campaignData);
      
      // Add contacts to the campaign
      await campaignService.addContactsToCampaign(newCampaign.id, selectedContactIds);
      
      // Update the local state
      setCampaigns(prev => [...prev, newCampaign]);
      setShowNewCampaignForm(false);
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setIsCreating(false);
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
      
      {/* New Campaign Form */}
      {showNewCampaignForm && (
        <div className="mb-6">
          <CampaignForm 
            templates={templates} 
            contacts={contacts}
            onSubmit={handleCreateCampaign}
            isLoading={isCreating}
          />
        </div>
      )}
      
      {/* Campaigns Display */}
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
          {/* Active Campaigns */}
          {activeCampaigns.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Active Campaigns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeCampaigns.map(campaign => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign} 
                    onClick={handleCampaignClick} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Scheduled Campaigns */}
          {scheduledCampaigns.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Scheduled Campaigns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scheduledCampaigns.map(campaign => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign} 
                    onClick={handleCampaignClick} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Draft Campaigns */}
          {draftCampaigns.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Draft Campaigns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {draftCampaigns.map(campaign => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign} 
                    onClick={handleCampaignClick} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Completed Campaigns */}
          {completedCampaigns.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Completed Campaigns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedCampaigns.map(campaign => (
                  <CampaignCard 
                    key={campaign.id} 
                    campaign={campaign} 
                    onClick={handleCampaignClick} 
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
import React from 'react';
import { Campaign } from '../../types';

interface CampaignCardProps {
  campaign: Campaign;
  onClick: (campaign: Campaign) => void;
  onStatusChange?: (campaignId: number, status: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick, onStatusChange }) => {
  const handleClick = () => {
    onClick(campaign);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(campaign.id, e.target.value);
    }
  };

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
          {campaign.status.replace('_', ' ')}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{campaign.description}</p>
      
      <div className="flex justify-between text-sm text-gray-500">
        <span>{campaign.contact_count} contacts</span>
        <span>
          {campaign.delivered_count} delivered • {campaign.read_count} read • {campaign.replied_count} replied
        </span>
      </div>
      
      {campaign.status === 'draft' && (
        <div className="mt-4">
          <select
            className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
            value={campaign.status}
            onChange={handleStatusChange}
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Schedule</option>
            <option value="in_progress">Start Now</option>
          </select>
        </div>
      )}
      
      {campaign.status === 'scheduled' && (
        <div className="mt-4 flex justify-between items-center">
          <button
            className="text-sm text-emerald-600 hover:text-emerald-700"
            onClick={(e) => {
              e.stopPropagation();
              if (onStatusChange) {
                onStatusChange(campaign.id, 'in_progress');
              }
            }}
          >
            Start Now
          </button>
          <button
            className="text-sm text-gray-600 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              if (onStatusChange) {
                onStatusChange(campaign.id, 'draft');
              }
            }}
          >
            Move to Draft
          </button>
        </div>
      )}
      
      {campaign.status === 'in_progress' && (
        <div className="mt-4">
          <button
            className="w-full text-sm text-emerald-600 hover:text-emerald-700"
            onClick={(e) => {
              e.stopPropagation();
              if (onStatusChange) {
                onStatusChange(campaign.id, 'completed');
              }
            }}
          >
            Mark as Completed
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignCard;
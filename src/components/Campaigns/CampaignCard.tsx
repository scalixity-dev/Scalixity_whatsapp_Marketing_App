import React from 'react';
import { Campaign } from '../../types';
import { Calendar, Users, MessageSquare, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
  onClick: (campaign: Campaign) => void;
  onStatusChange: (campaignId: number, status: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick, onStatusChange }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-emerald-100 text-emerald-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <AlertCircle className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <MessageSquare className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    onStatusChange(campaign.id, e.target.value);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(campaign)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
          {getStatusIcon(campaign.status)}
          <span className="ml-1 capitalize">{campaign.status.replace('_', ' ')}</span>
        </span>
      </div>
      
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{campaign.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(campaign.created_at)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-1" />
          <span>{campaign.contact_count} contacts</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-sm font-medium text-gray-900">{campaign.delivered_count}</div>
          <div className="text-xs text-gray-500">Delivered</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-sm font-medium text-gray-900">{campaign.read_count}</div>
          <div className="text-xs text-gray-500">Read</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-sm font-medium text-gray-900">{campaign.replied_count}</div>
          <div className="text-xs text-gray-500">Replied</div>
        </div>
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
              onStatusChange(campaign.id, 'in_progress');
            }}
          >
            Start Now
          </button>
          <button
            className="text-sm text-gray-600 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(campaign.id, 'draft');
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
              onStatusChange(campaign.id, 'completed');
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
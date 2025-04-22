import React from 'react';
import { Campaign } from '../../types';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle, Users } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
  onClick: (campaign: Campaign) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick }) => {
  const getStatusDetails = (status: Campaign['status']) => {
    switch(status) {
      case 'draft':
        return {
          icon: <Clock className="h-5 w-5 text-gray-600" />,
          label: 'Draft',
          color: 'bg-gray-100 text-gray-800'
        };
      case 'scheduled':
        return {
          icon: <Calendar className="h-5 w-5 text-blue-600" />,
          label: 'Scheduled',
          color: 'bg-blue-100 text-blue-800'
        };
      case 'in_progress':
        return {
          icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
          label: 'In Progress',
          color: 'bg-amber-100 text-amber-800'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
          label: 'Completed',
          color: 'bg-emerald-100 text-emerald-800'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          label: 'Cancelled',
          color: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-600" />,
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not scheduled';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const statusDetails = getStatusDetails(campaign.status);
  
  const getProgressPercentage = () => {
    if (!campaign.contact_count || campaign.contact_count === 0) return 0;
    return Math.round((campaign.delivered_count || 0) / campaign.contact_count * 100);
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer p-5"
      onClick={() => onClick(campaign)}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
        <span className={`px-2 py-1 text-xs rounded-full flex items-center ${statusDetails.color}`}>
          {statusDetails.icon}
          <span className="ml-1">{statusDetails.label}</span>
        </span>
      </div>
      
      {campaign.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-gray-600">
            {campaign.status === 'completed' 
              ? `Completed: ${formatDate(campaign.completed_at)}` 
              : `Scheduled: ${formatDate(campaign.scheduled_at)}`}
          </span>
        </div>
        
        <div className="flex items-center text-sm">
          <Users className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-gray-600">
            {campaign.contact_count || 0} recipients
          </span>
        </div>
        
        {campaign.status === 'in_progress' && (
          <div>
            <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {(campaign.status === 'completed' || campaign.status === 'in_progress') && (
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="text-center p-2 bg-gray-50 rounded-md">
              <div className="text-lg font-semibold text-gray-800">{campaign.delivered_count || 0}</div>
              <div className="text-xs text-gray-500">Delivered</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-md">
              <div className="text-lg font-semibold text-gray-800">{campaign.read_count || 0}</div>
              <div className="text-xs text-gray-500">Read</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-md">
              <div className="text-lg font-semibold text-gray-800">{campaign.replied_count || 0}</div>
              <div className="text-xs text-gray-500">Replied</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCard;
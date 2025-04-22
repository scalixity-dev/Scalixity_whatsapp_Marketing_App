import React from 'react';
import { Campaign } from '../../types';
import { useNavigate } from 'react-router-dom';

interface RecentCampaignsProps {
  campaigns: Campaign[];
}

const RecentCampaigns: React.FC<RecentCampaignsProps> = ({ campaigns }) => {
  const navigate = useNavigate();
  
  const getStatusClass = (status: Campaign['status']) => {
    switch(status) {
      case 'draft':
        return 'bg-gray-100 text-gray-600';
      case 'scheduled':
        return 'bg-blue-100 text-blue-600';
      case 'in_progress':
        return 'bg-amber-100 text-amber-600';
      case 'completed':
        return 'bg-emerald-100 text-emerald-600';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleCampaignClick = (id: number) => {
    navigate(`/campaigns/${id}`);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Campaigns</h3>
        <button 
          className="text-sm text-emerald-600 hover:text-emerald-700"
          onClick={() => navigate('/campaigns')}
        >
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campaign
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scheduled
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr 
                key={campaign.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleCampaignClick(campaign.id)}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                        {campaign.description || 'No description'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(campaign.status)}`}>
                    {campaign.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(campaign.scheduledAt)}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {campaign.status === 'in_progress' && campaign.contactCount ? (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-emerald-600 h-2.5 rounded-full"
                        style={{ width: `${(campaign.deliveredCount || 0) / campaign.contactCount * 100}%` }}
                      ></div>
                    </div>
                  ) : campaign.status === 'completed' ? (
                    <div className="text-sm text-gray-900">Completed</div>
                  ) : (
                    <div className="text-sm text-gray-500">Not started</div>
                  )}
                </td>
              </tr>
            ))}
            
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">
                  No campaigns found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentCampaigns;
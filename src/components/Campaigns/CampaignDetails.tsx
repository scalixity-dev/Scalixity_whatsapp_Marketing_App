import React, { useState } from 'react';
import { Campaign, Template, Contact, Group } from '../../types';
import { Edit2, Trash2, X, Check, AlertTriangle } from 'lucide-react';

interface CampaignDetailsProps {
  campaign: Campaign;
  templates: Template[];
  contacts: Contact[];
  groups: Group[];
  onClose: () => void;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaignId: number) => void;
}

const CampaignDetails: React.FC<CampaignDetailsProps> = ({
  campaign,
  templates,
  onClose,
  onEdit,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedCampaign, setEditedCampaign] = useState<Campaign>(campaign);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(editedCampaign);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(campaign.id);
    onClose();
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedCampaign.name}
                  onChange={(e) => setEditedCampaign({ ...editedCampaign, name: e.target.value })}
                  className="text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-emerald-500"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900">{campaign.name}</h2>
              )}
              <div className="mt-2 flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
                  {campaign.status.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-500">
                  Created: {formatDate(campaign.created_at)}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {showDeleteConfirm ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Delete Campaign</h3>
                  <p className="mt-1 text-sm text-red-700">
                    Are you sure you want to delete this campaign? This action cannot be undone.
                  </p>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Campaign Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      {isEditing ? (
                        <textarea
                          value={editedCampaign.description}
                          onChange={(e) => setEditedCampaign({ ...editedCampaign, description: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                          rows={3}
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">{campaign.description}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Template</label>
                      {isEditing ? (
                        <select
                          value={editedCampaign.template_id}
                          onChange={(e) => setEditedCampaign({ ...editedCampaign, template_id: Number(e.target.value) })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                          {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                              {template.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="mt-1 text-gray-900">
                          {templates.find(t => t.id === campaign.template_id)?.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Total Contacts</p>
                      <p className="text-2xl font-semibold text-gray-900">{campaign.contact_count}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Delivered</p>
                      <p className="text-2xl font-semibold text-gray-900">{campaign.delivered_count}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Read</p>
                      <p className="text-2xl font-semibold text-gray-900">{campaign.read_count}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Replied</p>
                      <p className="text-2xl font-semibold text-gray-900">{campaign.replied_count}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 font-medium">C</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Campaign Created</p>
                      <p className="text-sm text-gray-500">{formatDate(campaign.created_at)}</p>
                    </div>
                  </div>
                  {campaign.scheduled_at && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">S</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Scheduled For</p>
                        <p className="text-sm text-gray-500">{formatDate(campaign.scheduled_at)}</p>
                      </div>
                    </div>
                  )}
                  {campaign.started_at && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                          <span className="text-yellow-600 font-medium">S</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Campaign Started</p>
                        <p className="text-sm text-gray-500">{formatDate(campaign.started_at)}</p>
                      </div>
                    </div>
                  )}
                  {campaign.completed_at && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-medium">C</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Campaign Completed</p>
                        <p className="text-sm text-gray-500">{formatDate(campaign.completed_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails; 
import React from 'react';
import { Contact } from '../../types';
import { Phone, Mail, Building, Clock, Trash2, CheckCircle, X } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  onClick: (contact: Contact) => void;
  onDelete: (id: string) => Promise<void>;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onUpdateLastContacted: (id: string) => Promise<void>;
}

const ContactCard: React.FC<ContactCardProps> = ({ 
  contact, 
  onClick,
  onDelete,
  onUpdateStatus,
  onUpdateLastContacted
}) => {
  const getStatusColor = (status: Contact['status']) => {
    switch(status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      case 'responded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(contact.id);
  };

  const handleUpdateStatus = (e: React.MouseEvent, newStatus: string) => {
    e.stopPropagation();
    onUpdateStatus(contact.id, newStatus);
  };

  const handleUpdateLastContacted = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateLastContacted(contact.id);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer p-4"
      onClick={() => onClick(contact)}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-900 truncate max-w-[200px]">
          {contact.name}
        </h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
            {contact.status}
          </span>
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center text-sm">
          <Phone className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-gray-600">{contact.phoneNumber}</span>
        </div>
        
        {contact.company && (
          <div className="flex items-center text-sm">
            <Building className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-600 truncate">{contact.company}</span>
          </div>
        )}
        
        {contact.position && (
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-600 truncate">{contact.position}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-gray-600">Last contacted: {formatDate(contact.lastContacted)}</span>
          </div>
          <button
            onClick={handleUpdateLastContacted}
            className="p-1 text-gray-400 hover:text-emerald-500"
          >
            <CheckCircle className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={(e) => handleUpdateStatus(e, 'active')}
          className={`px-2 py-1 text-xs rounded-full ${
            contact.status === 'active' 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-gray-100 text-gray-800 hover:bg-emerald-50'
          }`}
        >
          Active
        </button>
        <button
          onClick={(e) => handleUpdateStatus(e, 'blocked')}
          className={`px-2 py-1 text-xs rounded-full ${
            contact.status === 'blocked' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-gray-100 text-gray-800 hover:bg-red-50'
          }`}
        >
          Blocked
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
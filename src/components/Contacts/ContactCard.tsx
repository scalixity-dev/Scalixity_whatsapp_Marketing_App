import React from 'react';
import { Contact } from '../../types';
import { Phone, Mail, Building, Clock, Trash2, CheckCircle, X } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  onClick: (contact: Contact) => void;
  onDelete: (id: string) => Promise<void>;
  onUpdateStatus: (id: string, status: 'active' | 'inactive' | 'blocked' | 'responded') => Promise<void>;
  onUpdateLastContacted: (id: string) => Promise<void>;
}

const ContactCard: React.FC<ContactCardProps> = ({ 
  contact, 
  onClick,
  onDelete,
  onUpdateStatus,
  onUpdateLastContacted
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
      await onDelete(contact.id.toString());
    }
  };

  const handleStatusChange = async (e: React.MouseEvent, newStatus: string) => {
    e.stopPropagation();
    await onUpdateStatus(contact.id.toString(), newStatus as 'active' | 'inactive' | 'blocked' | 'responded');
  };

  const handleLastContacted = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onUpdateLastContacted(contact.id.toString());
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(contact)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <Phone className="h-4 w-4 mr-1" />
            <span className="text-gray-600">{contact.phone_number}</span>
          </div>
          {contact.email && (
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <Mail className="h-4 w-4 mr-1" />
              <span className="text-gray-600">{contact.email}</span>
            </div>
          )}
          {contact.company && (
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <Building className="h-4 w-4 mr-1" />
              <span className="text-gray-600">{contact.company}</span>
              {contact.position && <span className="ml-1">({contact.position})</span>}
            </div>
          )}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
            title="Delete contact"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleLastContacted}
            className="p-1 text-gray-400 hover:text-emerald-500 rounded-full hover:bg-gray-100"
            title="Mark as contacted"
          >
            <Clock className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
        </span>
        
        <div className="flex space-x-1">
          <button
            onClick={(e) => handleStatusChange(e, 'active')}
            className={`p-1 rounded-full ${contact.status === 'active' ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:text-green-500 hover:bg-gray-100'}`}
            title="Mark as active"
          >
            <CheckCircle className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => handleStatusChange(e, 'blocked')}
            className={`p-1 rounded-full ${contact.status === 'blocked' ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'}`}
            title="Mark as blocked"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
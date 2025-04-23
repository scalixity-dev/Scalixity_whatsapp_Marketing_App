import React, { useState } from 'react';
import { Contact } from '../../types';
import { Phone, Search, Filter, X } from 'lucide-react';

interface ContactListProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  selectedContactIds: number[];
}

const ContactList: React.FC<ContactListProps> = ({ 
  contacts, 
  onSelectContact,
  selectedContactIds
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Contact['status'] | 'all'>('all');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        contact.phone_number.includes(searchTerm) ||
                        (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const getStatusBadgeColor = (status: Contact['status']) => {
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
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          {searchTerm && (
            <button 
              className="absolute right-3 top-2.5"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-2 mt-3 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              statusFilter === 'all' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              statusFilter === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setStatusFilter('active')}
          >
            Active
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              statusFilter === 'responded' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setStatusFilter('responded')}
          >
            Responded
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              statusFilter === 'inactive' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setStatusFilter('inactive')}
          >
            Inactive
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full ${
              statusFilter === 'blocked' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setStatusFilter('blocked')}
          >
            Blocked
          </button>
        </div>
      </div>
      
      <ul className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
        {filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
            <li 
              key={contact.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedContactIds.includes(contact.id) ? 'bg-emerald-50' : ''
              }`}
              onClick={() => onSelectContact(contact)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-medium">
                      {contact.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-3 w-3 mr-1" />
                      <span>{contact.phone_number}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(contact.status)}`}>
                    {contact.status}
                  </span>
                  {selectedContactIds.includes(contact.id) && (
                    <div className="ml-2 flex items-center justify-center w-5 h-5 bg-emerald-500 rounded-full">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              {contact.company && (
                <p className="mt-1 text-xs text-gray-500">{contact.company} {contact.position ? ` • ${contact.position}` : ''}</p>
              )}
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-gray-500">
            No contacts found matching your search
          </li>
        )}
      </ul>
    </div>
  );
};

export default ContactList;
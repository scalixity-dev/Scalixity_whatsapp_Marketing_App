import React, { useState } from 'react';
import { Contact } from '../../types';
import { Search, X } from 'lucide-react';

interface ContactListSidebarProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  selectedContactId?: number;
  lastMessageTimestamps: Record<number, string>;
}

const ContactListSidebar: React.FC<ContactListSidebarProps> = ({
  contacts,
  onSelectContact,
  selectedContactId,
  lastMessageTimestamps
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredContacts = contacts.filter(contact => {
    return contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           contact.phone_number.includes(searchTerm);
  });
  
  // Sort contacts by last message timestamp (most recent first)
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const timestampA = lastMessageTimestamps[a.id] || '0';
    const timestampB = lastMessageTimestamps[b.id] || '0';
    return new Date(timestampB).getTime() - new Date(timestampA).getTime();
  });
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
      </div>
      
      <div className="overflow-y-auto flex-1">
        <ul className="divide-y divide-gray-200">
          {sortedContacts.length > 0 ? (
            sortedContacts.map(contact => (
              <li 
                key={contact.id}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedContactId === contact.id ? 'bg-emerald-50' : ''
                }`}
                onClick={() => onSelectContact(contact)}
              >
                <div className="p-3 flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-medium">
                      {contact.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {contact.name}
                      </p>
                      {lastMessageTimestamps[contact.id] && (
                        <p className="text-xs text-gray-500">
                          {formatTimestamp(lastMessageTimestamps[contact.id])}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{contact.phone_number}</p>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {contact.company ? `${contact.company}` : ''}
                      {contact.company && contact.position ? ` • ${contact.position}` : contact.position || ''}
                    </p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">
              {searchTerm ? 'No contacts match your search' : 'No contacts found'}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ContactListSidebar;
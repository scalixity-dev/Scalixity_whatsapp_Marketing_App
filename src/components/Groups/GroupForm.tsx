import React, { useState } from 'react';
import { X } from 'lucide-react';

interface GroupFormProps {
  onSubmit: (data: { name: string; description: string; contactIds: string[] }) => void;
  onCancel: () => void;
  contacts: Array<{ id: string; name: string }>;
  initialData?: {
    name: string;
    description: string;
    contactIds: string[];
  };
}

const GroupForm: React.FC<GroupFormProps> = ({ 
  onSubmit, 
  onCancel, 
  contacts,
  initialData = { name: '', description: '', contactIds: [] } 
}) => {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(initialData.contactIds);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      contactIds: selectedContactIds
    });
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleContact = (contactId: string) => {
    if (selectedContactIds.includes(contactId)) {
      setSelectedContactIds(selectedContactIds.filter(id => id !== contactId));
    } else {
      setSelectedContactIds([...selectedContactIds, contactId]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{initialData.name ? 'Edit Group' : 'Create New Group'}</h2>
        <button
          type="button"
          className="text-gray-500 hover:text-gray-700"
          onClick={onCancel}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Group Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Contacts
          </label>
          
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          />
          
          <div className="border border-gray-300 rounded-md h-60 overflow-auto p-2">
            {filteredContacts.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredContacts.map(contact => (
                  <li key={contact.id} className="py-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedContactIds.includes(contact.id)}
                        onChange={() => toggleContact(contact.id)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span className="text-sm">{contact.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-4">No contacts found</p>
            )}
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            Selected {selectedContactIds.length} out of {contacts.length} contacts
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            disabled={!name}
          >
            {initialData.name ? 'Update Group' : 'Create Group'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupForm;
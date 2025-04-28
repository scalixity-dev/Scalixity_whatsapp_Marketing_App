import React from 'react';
import {  UserPlus, UserMinus } from 'lucide-react';
import { Contact } from '../../types';

interface GroupDetailProps {
  group: {
    id: string;
    name: string;
    description?: string;
    contacts: Contact[];
  };
  onAddContacts: () => void;
  onRemoveContact: (contactId: string) => void;
}

const GroupDetail: React.FC<GroupDetailProps> = ({ 
  group, 
  onAddContacts,
  onRemoveContact
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{group.name}</h2>
          {group.description && (
            <p className="mt-1 text-sm text-gray-500">{group.description}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Contacts ({group.contacts.length})</h3>
          <div className="flex space-x-2">
            <button
              className="flex items-center px-3 py-1 text-sm bg-emerald-100 text-emerald-800 rounded-md hover:bg-emerald-200"
              onClick={onAddContacts}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Add Contacts
            </button>
          </div>
        </div>

        {group.contacts.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {group.contacts.map(contact => (
              <li key={contact.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-500">{contact.phone_number}</p>
                  {contact.company && (
                    <p className="text-sm text-gray-500">{contact.company}</p>
                  )}
                </div>
                <button
                  className="text-gray-400 hover:text-red-600"
                  onClick={() => onRemoveContact(String(contact.id))}
                >
                  <UserMinus className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-6">No contacts in this group</p>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;
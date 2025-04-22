import React, { useState } from 'react';

interface Contact {
  id: string;
  name: string;
  phone?: string;
}

interface AddContactsToGroupFormProps {
  contacts: Contact[];
  onSubmit: (groupId: string, contactIds: string[]) => void;
  onCancel: () => void;
  groupId: string;
}

const AddContactsToGroupForm: React.FC<AddContactsToGroupFormProps> = ({
  contacts,
  onSubmit,
  onCancel,
  groupId,
}) => {
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(groupId, selectedContactIds);
  };

  const handleContactToggle = (contactId: string) => {
    setSelectedContactIds(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Add Contacts to Group</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 max-h-60 overflow-y-auto">
          {contacts.map(contact => (
            <div key={contact.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`contact-${contact.id}`}
                checked={selectedContactIds.includes(contact.id)}
                onChange={() => handleContactToggle(contact.id)}
                className="mr-2"
              />
              <label htmlFor={`contact-${contact.id}`}>
                {contact.name} {contact.phone && `(${contact.phone})`}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            disabled={selectedContactIds.length === 0}
          >
            Add Contacts
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddContactsToGroupForm;

import React, { useState, useEffect } from 'react';
import { Plus, Users, Upload } from 'lucide-react';
import { Contact } from '../types';
import { groupService } from '../services/groupService';
import { contactService } from '../services/contactService';
import GroupForm from '../components/Groups/GroupForm';
import GroupCard from '../components/Groups/GroupCard';
import GroupList from '../components/Groups/GroupList';
import GroupDetail from '../components/Groups/GroupDetail';
import AddContactsToGroupForm from '../components/Groups/AddContactsToGroupForm';
import ImportGroupCSV from '../components/Groups/ImportGroupCSV';

export interface Group {
  id: string;
  name: string;
  description?: string;
  contacts: Contact[];
  contactCount: number;
  Contacts?: Contact[]; // For API response compatibility
}

const Groups: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddContactsForm, setShowAddContactsForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);

  useEffect(() => {
    fetchGroups();
    fetchContacts();
  }, []);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const data = await groupService.getAllGroups();
      console.log('Raw groups data from API:', data);
      
      setGroups(data.map(group => {
        const contactsArray = Array.isArray(group.contacts) ? group.contacts : [];
          
        return {
          ...group,
          contacts: contactsArray,
          id: String(group.id),
          contactCount: contactsArray.length
        };
      }));
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const data = await contactService.getAllContacts();
      setContacts(data.map(contact => ({
        ...contact,
        phone_number: contact.phone,
        created_at: String(contact.created_at || new Date().toISOString()),
        updated_at: String(contact.updated_at || new Date().toISOString()),
        imported_from: String(contact.imported_from || 'manual'),
        imported_at: new Date(contact.imported_at || Date.now()),
        status: (contact.status as 'active' | 'inactive' | 'blocked' | 'responded') || 'active'
      })));
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSelectGroup = async (id: string) => {
    try {
      const group = await groupService.getGroupById(Number(id));
      console.log('Selected group details:', group);
      
      const contactsArray = Array.isArray(group.contacts) ? group.contacts : [];
      
      setSelectedGroup({
        ...group,
        contacts: contactsArray,
        id: String(group.id),
        contactCount: contactsArray.length
      });
    } catch (error) {
      console.error(`Error fetching group ${id}:`, error);
    }
  };

  const handleCreateGroup = async (groupData: { name: string; description: string; contactIds: string[] }) => {
    try {
      const newGroup = await groupService.createGroup({
        ...groupData,
        contactIds: groupData.contactIds.map(id => Number(id))
      });
      console.log('New group created:', newGroup);
      
      // Fetch all groups to ensure we have the latest data
      await fetchGroups();
      
      // Also select the newly created group to show it was created successfully
      if (newGroup && newGroup.id) {
        handleSelectGroup(String(newGroup.id));
      }
      
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleEditGroup = (id: string) => {
    const group = groups.find(g => g.id === id);
    if (group) {
      setEditingGroup(group);
      setShowEditForm(true);
    }
  };

  const handleUpdateGroup = async (groupData: { name: string; description: string; contactIds: string[] }) => {
    if (!editingGroup) return;
    
    try {
      await groupService.updateGroup(Number(editingGroup.id), {
        ...groupData,
        contactIds: groupData.contactIds.map(id => Number(id))
      });
      await fetchGroups();
      
      if (selectedGroup && selectedGroup.id === editingGroup.id) {
        handleSelectGroup(editingGroup.id);
      }
      
      setShowEditForm(false);
      setEditingGroup(null);
    } catch (error) {
      console.error('Error updating group:', error);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    try {
      await groupService.deleteGroup(Number(id));
      await fetchGroups();
      
      if (selectedGroup && selectedGroup.id === id) {
        setSelectedGroup(null);
      }
    } catch (error) {
      console.error(`Error deleting group ${id}:`, error);
    }
  };

  const handleRemoveContactFromGroup = async (groupId: string, contactId: string) => {
    try {
      await groupService.removeContactFromGroup(Number(groupId), Number(contactId));
      
      if (selectedGroup && selectedGroup.id === groupId) {
        handleSelectGroup(groupId);
      }
    } catch (error) {
      console.error('Error removing contact from group:', error);
    }
  };

  const handleAddContactsToGroup = () => {
    setShowAddContactsForm(true);
  };

  const handleSubmitAddContacts = async (groupId: string, contactIds: string[]) => {
    try {
      await groupService.addContactsToGroup(Number(groupId), contactIds.map(id => Number(id)));
      
      if (selectedGroup && selectedGroup.id === groupId) {
        handleSelectGroup(groupId);
      }
      
      setShowAddContactsForm(false);
    } catch (error) {
      console.error('Error adding contacts to group:', error);
    }
  };

  const handleImportGroup = async (groupName: string, contacts: { name: string; phone: string }[]) => {
    try {
      console.log('Importing group with data:', { groupName, contacts: contacts.slice(0, 3) });
      
      // Use the import endpoint on the server
      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/groups/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: groupName,
          description: `Imported group with ${contacts.length} contacts`,
          contacts: contacts.map(contact => ({
            name: contact.name,
            phone: contact.phone
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to import group');
      }

      await fetchGroups();
      setShowImportForm(false);
    } catch (error) {
      console.error('Error importing group:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-emerald-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Users className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowImportForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Upload className="h-5 w-5" />
            Import CSV
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
          >
            <Plus className="h-5 w-5" />
            New Group
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        <div className="w-full">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onClick={handleSelectGroup}
                  onEdit={handleEditGroup}
                  onDelete={handleDeleteGroup}
                />
              ))}
            </div>
          ) : (
            <GroupList
              groups={groups}
              onClick={handleSelectGroup}
              onEdit={handleEditGroup}
              onDelete={handleDeleteGroup}
            />
          )}
        </div>

        {selectedGroup && (
          <div className="w-full">
            <GroupDetail
              group={selectedGroup}
              onAddContacts={() => handleAddContactsToGroup()}
              onRemoveContact={(contactId) => handleRemoveContactFromGroup(selectedGroup.id, contactId)}
            />
          </div>
        )}
      </div>

      {showAddForm && (
        <GroupForm
          contacts={contacts.map(contact => ({
            id: String(contact.id),
            name: contact.name
          }))}
          onSubmit={handleCreateGroup}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {showEditForm && editingGroup && (
        <GroupForm
          contacts={contacts.map(contact => ({
            id: String(contact.id),
            name: contact.name
          }))}
          initialData={{
            name: editingGroup.name,
            description: editingGroup.description || '',
            contactIds: editingGroup.contacts.map(c => String(c.id))
          }}
          onSubmit={handleUpdateGroup}
          onCancel={() => {
            setShowEditForm(false);
            setEditingGroup(null);
          }}
        />
      )}

      {showAddContactsForm && selectedGroup && (
        <AddContactsToGroupForm
          contacts={contacts.map(contact => ({
            id: String(contact.id),
            name: contact.name,
            phone: contact.phone_number
          }))}
          groupId={selectedGroup.id}
          onSubmit={handleSubmitAddContacts}
          onCancel={() => setShowAddContactsForm(false)}
        />
      )}

      {showImportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <ImportGroupCSV
            onImport={handleImportGroup}
            onCancel={() => setShowImportForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Groups;
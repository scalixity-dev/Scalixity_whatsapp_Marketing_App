import React, { useState, useEffect } from 'react';
import { Plus, Upload, Download } from 'lucide-react';
import { Contact, ContactStatus } from '../types';
import ContactCard from '../components/Contacts/ContactCard';
import ContactList from '../components/Contacts/ContactList';
import ImportCSVForm from '../components/Contacts/ImportCSVForm';
import AddContactForm from '../components/Contacts/AddContactForm';
import { contactService } from '../services/contactService';

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  useEffect(() => {
    fetchContacts();
  }, []);
  
  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const data = await contactService.getAllContacts();
      setContacts(data.map(contact => ({
        id: Number(contact.id),
        name: String(contact.name),
        phone_number: String(contact.phone),
        email: contact.email,
        company: contact.company ? String(contact.company) : undefined,
        position: contact.position ? String(contact.position) : undefined,
        created_at: String(contact.created_at || new Date().toISOString()),
        updated_at: String(contact.updated_at || new Date().toISOString()),
        imported_from: String(contact.imported_from || 'manual'),
        imported_at: new Date(contact.imported_at || Date.now()),
        last_contacted: contact.last_contacted ? new Date(contact.last_contacted) : undefined,
        status: (contact.status || 'active') as ContactStatus,
        notes: contact.notes ? String(contact.notes) : undefined
      })));
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };
  
  const handleImportCSV = async (csvData: string) => {
    setIsImporting(true);
    try {
      const importedContacts = await contactService.importContactsFromCSV(csvData);
      setContacts(prev => [...prev, ...importedContacts.map(contact => ({
        ...contact,
        phone_number: String(contact.phone),
        created_at: String(contact.created_at || new Date().toISOString()),
        updated_at: String(contact.updated_at || new Date().toISOString()),
        imported_from: String(contact.imported_from || 'manual'),
        imported_at: new Date(contact.imported_at || Date.now()),
        status: (contact.status as 'active' | 'inactive' | 'blocked' | 'responded') || 'active'
      }))]);
      setShowImportForm(false);
    } catch (error) {
      console.error('Error importing contacts:', error);
    } finally {
      setIsImporting(false);
    }
  };
  
  const handleDownloadContacts = async () => {
    try {
      await contactService.exportContactsToCSV();
    } catch (error) {
      console.error('Error downloading contacts:', error);
    }
  };
  
  const handleAddContact = () => {
    setShowAddForm(true);
  };
  
  const handleCreateContact = async (contactData: Omit<Contact, 'id'>) => {
    try {
      const newContact = await contactService.createContact({
        ...contactData,
        imported_at: contactData.imported_at?.toISOString(),
        last_contacted: contactData.last_contacted?.toISOString()
      });
      setContacts(prev => [...prev, {
        ...newContact,
        phone_number: String(newContact.phone),
        created_at: String(newContact.created_at || new Date().toISOString()),
        updated_at: String(newContact.updated_at || new Date().toISOString()),
        imported_from: String(newContact.imported_from || 'manual'),
        imported_at: new Date(newContact.imported_at || Date.now()),
        status: (newContact.status as 'active' | 'inactive' | 'blocked' | 'responded') || 'active'
      }]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };
  
  const handleDeleteContact = async (id: string) => {
    try {
      await contactService.deleteContact(Number(id));
      setContacts(prev => prev.filter(contact => contact.id !== Number(id)));
      if (selectedContact?.id === Number(id)) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error);
    }
  };
  
  const handleUpdateContactStatus = async (id: string, status: 'active' | 'inactive' | 'blocked' | 'responded') => {
    try {
      const updatedContact = await contactService.updateContactStatus(Number(id), { status });
      setContacts(prev => prev.map(contact => 
        contact.id === Number(id) ? {
          ...updatedContact,
          phone_number: String(updatedContact.phone),
          created_at: String(updatedContact.created_at || contact.created_at),
          updated_at: String(updatedContact.updated_at || new Date().toISOString()),
          imported_from: String(updatedContact.imported_from || contact.imported_from),
          imported_at: new Date(updatedContact.imported_at || contact.imported_at),
          status: (updatedContact.status as 'active' | 'inactive' | 'blocked' | 'responded') || contact.status
        } : contact
      ));
      if (selectedContact?.id === Number(id)) {
        setSelectedContact({
          ...updatedContact,
          phone_number: String(updatedContact.phone),
          created_at: String(updatedContact.created_at || selectedContact.created_at),
          updated_at: String(updatedContact.updated_at || new Date().toISOString()),
          imported_from: String(updatedContact.imported_from || selectedContact.imported_from),
          imported_at: new Date(updatedContact.imported_at || selectedContact.imported_at),
          status: (updatedContact.status as 'active' | 'inactive' | 'blocked' | 'responded') || selectedContact.status
        });
      }
    } catch (error) {
      console.error(`Error updating contact status ${id}:`, error);
    }
  };
  
  const handleUpdateLastContacted = async (id: string) => {
    try {
      const updatedContact = await contactService.updateLastContacted(Number(id));
      setContacts(prev => prev.map(contact => 
        contact.id === Number(id) ? {
          ...updatedContact,
          phone_number: String(updatedContact.phone),
          created_at: String(updatedContact.created_at || contact.created_at),
          updated_at: String(updatedContact.updated_at || new Date().toISOString()),
          imported_from: String(updatedContact.imported_from || contact.imported_from),
          imported_at: new Date(updatedContact.imported_at || contact.imported_at),
          status: (updatedContact.status as 'active' | 'inactive' | 'blocked' | 'responded') || contact.status
        } : contact
      ));
      if (selectedContact?.id === Number(id)) {
        setSelectedContact({
          ...updatedContact,
          phone_number: String(updatedContact.phone),
          created_at: String(updatedContact.created_at || selectedContact.created_at),
          updated_at: String(updatedContact.updated_at || new Date().toISOString()),
          imported_from: String(updatedContact.imported_from || selectedContact.imported_from),
          imported_at: new Date(updatedContact.imported_at || selectedContact.imported_at),
          status: (updatedContact.status as 'active' | 'inactive' | 'blocked' | 'responded') || selectedContact.status
        });
      }
    } catch (error) {
      console.error(`Error updating last contacted for ${id}:`, error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-emerald-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }
 
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        
        <div className="flex space-x-2 mt-3 md:mt-0">
          <button
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
          <button
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={handleDownloadContacts}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
          <button
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => setShowImportForm(true)}
          >
            <Upload className="h-4 w-4 mr-1" />
            Import CSV
          </button>
          <button
            className="flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
            onClick={handleAddContact}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Contact
          </button>
        </div>
      </div>
      
      {/* Import CSV Form */}
      {showImportForm && (
        <div className="mb-6">
          <ImportCSVForm 
            onImport={handleImportCSV} 
            isLoading={isImporting} 
            onCancel={() => setShowImportForm(false)}
          />
        </div>
      )}
      
      {/* Add Contact Form */}
      {showAddForm && (
        <div className="mb-6">
          <AddContactForm 
            onSubmit={handleCreateContact}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}
      
      {/* Contacts Display */}
      {contacts.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500 mb-4">No contacts found</p>
          <button
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            onClick={handleAddContact}
          >
            Add Your First Contact
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map(contact => (
            <ContactCard 
              key={contact.id} 
              contact={contact} 
              onClick={handleContactSelect}
              onDelete={handleDeleteContact}
              onUpdateStatus={handleUpdateContactStatus}
              onUpdateLastContacted={handleUpdateLastContacted}
            />
          ))}
        </div>
      ) : (
        <ContactList 
          contacts={contacts} 
          onSelectContact={handleContactSelect}
          selectedContactIds={[]}
        />
      )}
      
      {/* Selected Contact Detail View */}
      {selectedContact && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{selectedContact.name}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                <p className="mt-1">{selectedContact.phone_number}</p>
              </div>
              {selectedContact.company && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Company</h3>
                  <p className="mt-1">{selectedContact.company}</p>
                </div>
              )}
              {selectedContact.position && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Position</h3>
                  <p className="mt-1">{selectedContact.position}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1 capitalize">{selectedContact.status}</p>
              </div>
              {selectedContact.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="mt-1">{selectedContact.notes}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button 
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                onClick={() => setSelectedContact(null)}
              >
                Close
              </button>
              <button 
                className="px-3 py-2 bg-emerald-600 text-white rounded-md text-sm"
                onClick={() => handleUpdateLastContacted(String(selectedContact.id))}
              >
                Mark Contacted
              </button>
              <button 
                className="px-3 py-2 bg-red-600 text-white rounded-md text-sm"
                onClick={() => {
                  handleDeleteContact(String(selectedContact.id));
                  setSelectedContact(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
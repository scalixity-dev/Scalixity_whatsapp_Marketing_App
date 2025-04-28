// frontend/src/services/contactService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Contact {
  id: number;
  name: string;
  phone: string;
  email?: string;
  status?: string;
  lastContacted?: string;
  [key: string]: string | number | undefined; // For additional dynamic properties
}

interface ContactStatus {
  status: string;
}

export const contactService = {
  /**
   * Get all contacts
   */
  getAllContacts: async (): Promise<Contact[]> => {
    try {
      const response = await axios.get(`${API_URL}/contacts`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching contacts', error);
      throw error;
    }
  },
  
  /**
   * Get a contact by ID
   */
  getContactById: async (id: number): Promise<Contact> => {
    try {
      const response = await axios.get(`${API_URL}/contacts/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}`, error);
      throw error;
    }
  },
  
  /**
   * Create a new contact
   */
  createContact: async (contactData: Partial<Contact>): Promise<Contact> => {
    try {
      const response = await axios.post(`${API_URL}/contacts`, contactData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating contact', error);
      throw error;
    }
  },
  
  /**
   * Update a contact
   */
  updateContact: async (id: number, contactData: Partial<Contact>): Promise<Contact> => {
    try {
      const response = await axios.put(`${API_URL}/contacts/${id}`, contactData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating contact ${id}`, error);
      throw error;
    }
  },
  
  /**
   * Delete a contact
   */
  deleteContact: async (id: number): Promise<void> => {
    try {
      const response = await axios.delete(`${API_URL}/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting contact ${id}`, error);
      throw error;
    }
  },
  
  /**
   * Import contacts from CSV
   */
  importContactsFromCSV: async (csvData: string): Promise<Contact[]> => {
    try {
      const response = await axios.post(`${API_URL}/contacts/import`, { csvData });
      return response.data.data.imported;
    } catch (error) {
      console.error('Error importing contacts', error);
      throw error;
    }
  },
  
  /**
   * Export contacts to CSV
   */
  exportContactsToCSV: async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_URL}/contacts/export/csv`, {
        responseType: 'blob'
      });
      
      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contacts.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error exporting contacts', error);
      throw error;
    }
  },
  
  /**
   * Update contact status
   */
  updateContactStatus: async (id: number, status: ContactStatus): Promise<Contact> => {
    try {
      const response = await axios.patch(`${API_URL}/contacts/${id}/status`, { status });
      return response.data.data;
    } catch (error) {
      console.error(`Error updating contact ${id} status`, error);
      throw error;
    }
  },
  
  /**
   * Update last contacted date to now
   */
  updateLastContacted: async (id: number): Promise<Contact> => {
    try {
      const response = await axios.patch(`${API_URL}/contacts/${id}/last-contacted`);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating last contacted for contact ${id}`, error);
      throw error;
    }
  }
};
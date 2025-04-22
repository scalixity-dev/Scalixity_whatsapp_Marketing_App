import { Contact } from '../types';

interface Group {
  id: string;
  name: string;
  description?: string;
  contacts?: Contact[];
  contactCount?: number;
}

interface CreateGroupData {
  name: string;
  description: string;
  contactIds: string[];
}

const API_URL = 'http://localhost:5000/api';

export const groupService = {
  getAllGroups: async (): Promise<Group[]> => {
    try {
      const response = await fetch(`${API_URL}/groups`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // Return the data directly as the backend doesn't wrap it in a data property
      return data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  getGroupById: async (id: string): Promise<Group> => {
    try {
      const response = await fetch(`${API_URL}/groups/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // Return the data directly as the backend doesn't wrap it in a data property
      return data;
    } catch (error) {
      console.error(`Error fetching group ${id}:`, error);
      throw error;
    }
  },

  createGroup: async (groupData: CreateGroupData): Promise<Group> => {
    try {
      const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // Return the data directly as the backend doesn't wrap it in a data property
      return data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  updateGroup: async (id: string, groupData: Partial<CreateGroupData>): Promise<Group> => {
    try {
      const response = await fetch(`${API_URL}/groups/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // Return the data directly as the backend doesn't wrap it in a data property
      return data;
    } catch (error) {
      console.error(`Error updating group ${id}:`, error);
      throw error;
    }
  },

  deleteGroup: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/groups/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting group ${id}:`, error);
      throw error;
    }
  },

  addContactsToGroup: async (groupId: string, contactIds: string[]): Promise<Group> => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupId}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contactIds }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // Return the data directly as the backend doesn't wrap it in a data property
      return data;
    } catch (error) {
      console.error(`Error adding contacts to group ${groupId}:`, error);
      throw error;
    }
  },

  removeContactFromGroup: async (groupId: string, contactId: string): Promise<Group> => {
    try {
      // Fix the endpoint to match what the backend expects - send the contactIds array
      const response = await fetch(`${API_URL}/groups/${groupId}/contacts`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contactIds: [contactId] }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // Return the data directly as the backend doesn't wrap it in a data property
      return data;
    } catch (error) {
      console.error(`Error removing contact from group:`, error);
      throw error;
    }
  }
};
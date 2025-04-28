import { Group } from '../types';

interface CreateGroupData {
  name: string;
  description: string;
  contactIds: number[];
}

const API_URL = 'http://kea.mywire.org:5100/api';

export const groupService = {
  getAllGroups: async (): Promise<Group[]> => {
    try {
      const response = await fetch(`${API_URL}/groups`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('getAllGroups response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  getGroupById: async (id: number): Promise<Group> => {
    try {
      const response = await fetch(`${API_URL}/groups/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`getGroupById(${id}) response:`, data);
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
      console.log('createGroup response:', data);
      return data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  updateGroup: async (id: number, groupData: Partial<CreateGroupData>): Promise<Group> => {
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
      console.log(`updateGroup(${id}) response:`, data);
      return data;
    } catch (error) {
      console.error(`Error updating group ${id}:`, error);
      throw error;
    }
  },

  deleteGroup: async (id: number): Promise<void> => {
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

  addContactsToGroup: async (groupId: number, contactIds: number[]): Promise<Group> => {
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
      console.log(`addContactsToGroup(${groupId}) response:`, data);
      return data;
    } catch (error) {
      console.error(`Error adding contacts to group ${groupId}:`, error);
      throw error;
    }
  },

  removeContactFromGroup: async (groupId: number, contactId: number): Promise<Group> => {
    try {
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
      console.log(`removeContactFromGroup(${groupId}, ${contactId}) response:`, data);
      return data;
    } catch (error) {
      console.error(`Error removing contact from group:`, error);
      throw error;
    }
  }
};
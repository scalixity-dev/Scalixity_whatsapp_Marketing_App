// Dummy API service for development without backend
// This file provides mock data and simulated API responses

// Define types for our mock data
interface MockGroup {
  id: string;
  name: string;
  description?: string;
  contacts: string[];
  contactCount: number;
}

interface MockContact {
  id: number;
  name: string;
  phone: string;
  email?: string;
  status: string;
  created_at: string;
  importedFrom: string;
  importedAt: Date;
}

interface MockCampaign {
  id: number;
  name: string;
  description?: string;
  template_message: string;
  status: string;
  created_at: string;
  scheduled_at?: string;
  contact_count: number;
}

// Mock data
const mockData = {
  groups: [
    { id: '1', name: 'Marketing Team', description: 'Team for marketing campaigns', contacts: [], contactCount: 0 },
    { id: '2', name: 'Sales Team', description: 'Team for sales outreach', contacts: [], contactCount: 0 },
    { id: '3', name: 'Support Team', description: 'Customer support team', contacts: [], contactCount: 0 },
  ] as MockGroup[],
  contacts: [
    { id: 1, name: 'John Doe', phone: '+1234567890', email: 'john@example.com', status: 'active', created_at: '2023-01-01', importedFrom: 'manual', importedAt: new Date() },
    { id: 2, name: 'Jane Smith', phone: '+0987654321', email: 'jane@example.com', status: 'active', created_at: '2023-01-02', importedFrom: 'manual', importedAt: new Date() },
    { id: 3, name: 'Bob Johnson', phone: '+1122334455', email: 'bob@example.com', status: 'inactive', created_at: '2023-01-03', importedFrom: 'manual', importedAt: new Date() },
  ] as MockContact[],
  campaigns: [
    { id: 1, name: 'Summer Sale', description: 'Promotion for summer products', template_message: 'Check out our summer deals!', status: 'draft', created_at: '2023-05-01', contact_count: 0 },
    { id: 2, name: 'Holiday Special', description: 'Holiday season promotion', template_message: 'Happy holidays from our team!', status: 'scheduled', scheduled_at: '2023-12-01', created_at: '2023-06-01', contact_count: 0 },
  ] as MockCampaign[],
};

// Helper function to simulate network delay
const delay = (ms = 500): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to find an item by ID
const findById = <T extends { id: string | number }>(collection: T[], id: string | number): T => {
  const item = collection.find(item => String(item.id) === String(id));
  if (!item) throw new Error(`Item with ID ${id} not found`);
  return item;
};

// Dummy API implementation
const api = {
  get: async (url: string) => {
    await delay();
    
    if (url === '/groups') {
      return { data: mockData.groups };
    }
    
    if (url.startsWith('/groups/')) {
      const id = url.split('/')[2];
      const group = findById(mockData.groups, id);
      return { data: group };
    }
    
    if (url === '/contacts') {
      return { data: mockData.contacts };
    }
    
    if (url.startsWith('/contacts/')) {
      const id = url.split('/')[2];
      const contact = findById(mockData.contacts, id);
      return { data: contact };
    }
    
    if (url === '/campaigns') {
      return { data: mockData.campaigns };
    }
    
    if (url.startsWith('/campaigns/')) {
      const id = url.split('/')[2];
      const campaign = findById(mockData.campaigns, id);
      return { data: campaign };
    }
    
    throw new Error(`Endpoint ${url} not implemented in mock API`);
  },
  
  post: async (url: string, data: any) => {
    await delay();
    
    if (url === '/groups') {
      const newGroup: MockGroup = {
        id: String(mockData.groups.length + 1),
        name: data.name,
        description: data.description,
        contacts: [],
        contactCount: 0
      };
      mockData.groups.push(newGroup);
      return { data: newGroup };
    }
    
    if (url.startsWith('/groups/') && url.endsWith('/contacts')) {
      const groupId = url.split('/')[2];
      const group = findById(mockData.groups, groupId);
      
      // Add contacts to group
      const contactIds = data.contactIds || [];
      group.contacts = [...group.contacts, ...contactIds];
      group.contactCount = group.contacts.length;
      
      return { data: group };
    }
    
    if (url === '/contacts') {
      const newContact: MockContact = {
        id: mockData.contacts.length + 1,
        name: data.name,
        phone: data.phone,
        email: data.email,
        status: 'active',
        created_at: new Date().toISOString(),
        importedFrom: 'manual',
        importedAt: new Date()
      };
      mockData.contacts.push(newContact);
      return { data: newContact };
    }
    
    if (url === '/campaigns') {
      const newCampaign: MockCampaign = {
        id: mockData.campaigns.length + 1,
        name: data.name,
        description: data.description,
        template_message: data.template_message,
        status: 'draft',
        created_at: new Date().toISOString(),
        contact_count: 0
      };
      mockData.campaigns.push(newCampaign);
      return { data: newCampaign };
    }
    
    throw new Error(`Endpoint ${url} not implemented in mock API`);
  },
  
  put: async (url: string, data: any) => {
    await delay();
    
    if (url.startsWith('/groups/')) {
      const id = url.split('/')[2];
      const group = findById(mockData.groups, id);
      
      // Update group
      group.name = data.name || group.name;
      group.description = data.description || group.description;
      
      return { data: group };
    }
    
    if (url.startsWith('/contacts/')) {
      const id = url.split('/')[2];
      const contact = findById(mockData.contacts, id);
      
      // Update contact
      contact.name = data.name || contact.name;
      contact.phone = data.phone || contact.phone;
      contact.email = data.email || contact.email;
      contact.status = data.status || contact.status;
      
      return { data: contact };
    }
    
    if (url.startsWith('/campaigns/')) {
      const id = url.split('/')[2];
      const campaign = findById(mockData.campaigns, id);
      
      // Update campaign
      campaign.name = data.name || campaign.name;
      campaign.description = data.description || campaign.description;
      campaign.template_message = data.template_message || campaign.template_message;
      campaign.status = data.status || campaign.status;
      
      return { data: campaign };
    }
    
    throw new Error(`Endpoint ${url} not implemented in mock API`);
  },
  
  delete: async (url: string, config?: any) => {
    await delay();
    
    if (url.startsWith('/groups/')) {
      const id = url.split('/')[2];
      const index = mockData.groups.findIndex(group => String(group.id) === String(id));
      
      if (index === -1) {
        throw new Error(`Group with ID ${id} not found`);
      }
      
      mockData.groups.splice(index, 1);
      return { data: { success: true } };
    }
    
    if (url.startsWith('/groups/') && url.includes('/contacts')) {
      const [groupId, , contactId] = url.split('/');
      const group = findById(mockData.groups, groupId);
      
      // Remove contact from group
      group.contacts = group.contacts.filter(id => String(id) !== String(contactId));
      group.contactCount = group.contacts.length;
      
      return { data: group };
    }
    
    if (url.startsWith('/contacts/')) {
      const id = url.split('/')[2];
      const index = mockData.contacts.findIndex(contact => String(contact.id) === String(id));
      
      if (index === -1) {
        throw new Error(`Contact with ID ${id} not found`);
      }
      
      mockData.contacts.splice(index, 1);
      return { data: { success: true } };
    }
    
    if (url.startsWith('/campaigns/')) {
      const id = url.split('/')[2];
      const index = mockData.campaigns.findIndex(campaign => String(campaign.id) === String(id));
      
      if (index === -1) {
        throw new Error(`Campaign with ID ${id} not found`);
      }
      
      mockData.campaigns.splice(index, 1);
      return { data: { success: true } };
    }
    
    throw new Error(`Endpoint ${url} not implemented in mock API`);
  }
};

export default api; 
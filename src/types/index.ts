// Define types for the WhatsApp Marketing System

export type ContactStatus = 'active' | 'inactive' | 'blocked' | 'responded';

export interface Contact {
  id: number;
  name: string;
  phone_number: string;
  email?: string;
  company?: string;
  position?: string;
  created_at: string;
  updated_at: string;
  imported_from: string;
  imported_at: Date;
  last_contacted?: Date;
  status: 'active' | 'inactive' | 'blocked' | 'responded';
  notes?: string;
}

export type CampaignStatus = 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Group {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Campaign {
  id: number;
  name: string;
  description?: string;
  template_id: number;
  template_message: string;
  status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  contact_count: number;
  delivered_count: number;
  read_count: number;
  replied_count: number;
  created_at: string;
  updated_at: string;
  template?: Template;
  groups?: Group[];
  contacts?: Contact[];
}

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
export type MessageDirection = 'incoming' | 'outgoing';
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'document';

export interface Message {
  id: number;
  contactId: number;
  campaignId?: number;
  direction: MessageDirection;
  content: string;
  messageType: MessageType;
  mediaUrl?: string;
  timestamp: string;
  status: MessageStatus;
  isCampaignMessage: boolean;
}

export interface Template {
  id: number;
  name: string;
  content: string;
  lastUsed?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CampaignContact {
  campaignId: number;
  contactId: number;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'replied';
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  repliedAt?: string;
}

export interface DashboardStats {
  totalContacts: number;
  activeContacts: number;
  totalCampaigns: number;
  activeCampaigns: number;
  messagesSent: number;
  messagesDelivered: number;
  responseRate: number;
}
export interface ContactCardProps {
  contact: Contact;
  onClick: (contact: Contact) => void;
  onDelete: (id: string) => Promise<void>;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onUpdateLastContacted: (id: string) => Promise<void>;
}
export interface ImportCSVFormProps {
  onImport: (csvData: string) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}
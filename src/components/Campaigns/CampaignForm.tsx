import React, { useState, useEffect } from 'react';
import { Campaign, Template, Contact } from '../../types';
import { Calendar, Clock, Users, Send } from 'lucide-react';
import ContactList from '../Contacts/ContactList';

interface CampaignFormProps {
  templates: Template[];
  contacts: Contact[];
  onSubmit: (campaign: Omit<Campaign, 'id' | 'created_at'>, selectedContactIds: number[]) => void;
  initialCampaign?: Campaign;
  isLoading?: boolean;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ 
  templates, 
  contacts,
  onSubmit,
  initialCampaign,
  isLoading = false
}) => {
  const [name, setName] = useState(initialCampaign?.name || '');
  const [description, setDescription] = useState(initialCampaign?.description || '');
  const [templateMessage, setTemplateMessage] = useState(initialCampaign?.template_message || '');
  const [scheduleDate, setScheduleDate] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);
  const [showContactSelector, setShowContactSelector] = useState(false);
  
  useEffect(() => {
    if (initialCampaign?.scheduled_at) {
      const scheduledDate = new Date(initialCampaign.scheduled_at);
      
      // Format date as YYYY-MM-DD
      const dateStr = scheduledDate.toISOString().split('T')[0];
      setScheduleDate(dateStr);
      
      // Format time as HH:MM
      const hours = scheduledDate.getHours().toString().padStart(2, '0');
      const minutes = scheduledDate.getMinutes().toString().padStart(2, '0');
      setScheduleTime(`${hours}:${minutes}`);
    }
  }, [initialCampaign]);
  
  const handleSelectTemplate = (templateId: number) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setTemplateMessage(template.content);
    }
  };
  
  const handleContactToggle = (contact: Contact) => {
    setSelectedContactIds(prevSelected => {
      if (prevSelected.includes(contact.id)) {
        return prevSelected.filter(id => id !== contact.id);
      } else {
        return [...prevSelected, contact.id];
      }
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let scheduled_at: string | undefined = undefined;
    
    // If both date and time are set, create a scheduled timestamp
    if (scheduleDate && scheduleTime) {
      const dateTimeStr = `${scheduleDate}T${scheduleTime}:00`;
      scheduled_at = new Date(dateTimeStr).toISOString();
    }
    
    // Ensure all required fields are present
    const campaignData: Omit<Campaign, 'id' | 'created_at'> = {
      name: name.trim(),
      description: description?.trim(),
      template_message: templateMessage.trim(),
      status: scheduled_at ? 'scheduled' : 'draft',
      scheduled_at,
      contact_ids: selectedContactIds
    };
    
    console.log('Submitting campaign data:', campaignData);
    onSubmit(campaignData, selectedContactIds);
  };
  
  const isFormValid = name.trim() !== '' && templateMessage.trim() !== '' && selectedContactIds.length > 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Campaign Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter campaign name"
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
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Brief description of this campaign"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Template <span className="text-red-500">*</span>
            </label>
            
            <div className="mb-3">
              <select
                value={selectedTemplate || ''}
                onChange={(e) => handleSelectTemplate(Number(e.target.value))}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select a template or create custom</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            
            <textarea
              value={templateMessage}
              onChange={(e) => setTemplateMessage(e.target.value)}
              rows={5}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter your message with placeholders like {{name}}, {{company}}"
              required
            />
            
            <div className="mt-2 text-xs text-gray-500">
              <p className="font-medium">Available placeholders:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>{"{{name}}"} - Contact's name</li>
                <li>{"{{company}}"} - Contact's company</li>
                <li>{"{{position}}"} - Contact's position</li>
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule Date
                </div>
              </label>
              <input
                id="scheduleDate"
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Schedule Time
                </div>
              </label>
              <input
                id="scheduleTime"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Select Recipients <span className="text-red-500">*</span>
                </div>
              </label>
              {selectedContactIds.length > 0 && (
                <span className="text-xs text-gray-500">
                  {selectedContactIds.length} contact{selectedContactIds.length !== 1 ? 's' : ''} selected
                </span>
              )}
            </div>
            
            <button
              type="button"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              onClick={() => setShowContactSelector(!showContactSelector)}
            >
              {selectedContactIds.length > 0 
                ? `${selectedContactIds.length} contacts selected` 
                : 'Select Contacts'}
            </button>
            
            {showContactSelector && (
              <div className="mt-3 border border-gray-200 rounded-md overflow-hidden">
                <ContactList 
                  contacts={contacts} 
                  onSelectContact={handleContactToggle}
                  selectedContactIds={selectedContactIds}
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isFormValid && !isLoading
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {scheduleDate && scheduleTime ? 'Schedule Campaign' : 'Save as Draft'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CampaignForm;
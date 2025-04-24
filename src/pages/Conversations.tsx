import React, { useState, useEffect, useRef } from 'react';
import { Contact, Message } from '../types';
import ContactListSidebar from '../components/Messages/ContactListSidebar';
import ChatInterface from '../components/Messages/ChatInterface';
import { contactService } from '../services/contactService';
import { messageService } from '../services/messageService';

const Conversations: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastMessageTimestamps, setLastMessageTimestamps] = useState<Record<number, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<Message['messageType']>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch contacts on component mount
  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      try {
        const contactsData = await contactService.getAllContacts();
        setContacts(contactsData);
        
        // If we have contacts, select the first one by default
        if (contactsData.length > 0) {
          setSelectedContact(contactsData[0]);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContacts();
  }, []);
  
  // Fetch messages when selected contact changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedContact) {
        try {
          const messagesData = await messageService.getMessagesByContact(selectedContact.id);
          setMessages(messagesData);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      } else {
        setMessages([]);
      }
    };
    
    fetchMessages();
  }, [selectedContact]);
  
  // Calculate last message timestamp for each contact
  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const allMessages = await messageService.getAllMessages();
        
        // Create a map of contactId to the timestamp of their most recent message
        const timestamps: Record<number, string> = {};
        
        allMessages.forEach(message => {
          const contactId = message.contactId;
          const timestamp = message.timestamp;
          
          if (!timestamps[contactId] || new Date(timestamp) > new Date(timestamps[contactId])) {
            timestamps[contactId] = timestamp;
          }
        });
        
        setLastMessageTimestamps(timestamps);
      } catch (error) {
        console.error('Error fetching all messages:', error);
      }
    };
    
    fetchAllMessages();
  }, []);
  
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    
    // Determine message type based on file type
    if (file.type.startsWith('image/')) {
      setMessageType('image');
    } else if (file.type.startsWith('audio/')) {
      setMessageType('audio');
    } else if (file.type.startsWith('video/')) {
      setMessageType('video');
    } else {
      setMessageType('document');
    }

    // Create preview URL for images and videos
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSendMessage = async (content: string, type: Message['messageType'] = 'text') => {
    if (!selectedContact) return;
    
    let messageContent = content;
    let mediaUrl: string | undefined;

    // If we have a selected file, upload it first
    if (selectedFile) {
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('messageType', type);

        // Upload the file
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }

        const { url } = await uploadResponse.json();
        mediaUrl = url;
        messageContent = selectedFile.name; // Use filename as content for non-text messages

        // Reset file selection
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        return;
      }
    }
    
    // Create a temporary message object to show immediately
    const tempMessage: Message = {
      id: Date.now(), // Temporary ID
      contactId: selectedContact.id,
      direction: 'outgoing',
      content: messageContent,
      messageType: type,
      timestamp: new Date().toISOString(),
      status: 'pending',
      isCampaignMessage: false
    };

    // Update the messages state immediately with the temporary message
    setMessages(prevMessages => [...prevMessages, tempMessage]);
    
    // Update the last message timestamp for this contact
    setLastMessageTimestamps(prev => ({
      ...prev,
      [selectedContact.id]: tempMessage.timestamp
    }));

    try {
      // Send the message to the backend
      const newMessage = await messageService.sendMessage({
        contactId: selectedContact.id,
        direction: 'outgoing',
        content: messageContent,
        messageType: type,
        mediaUrl,
        isCampaignMessage: false
      });
      
      // Replace the temporary message with the actual message from the backend
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === tempMessage.id ? newMessage : msg
        )
      );
      
      // Update the last message timestamp with the actual message timestamp
      setLastMessageTimestamps(prev => ({
        ...prev,
        [selectedContact.id]: newMessage.timestamp
      }));
      
      // Update the contact's lastContacted field
      await contactService.updateContact(selectedContact.id, {
        lastContacted: new Date()
      });
      
      // Simulate a reply after a random delay (for demo purposes)
      if (Math.random() > 0.7) {
        const replyDelay = Math.floor(Math.random() * 10000) + 5000; // 5-15 seconds
        setTimeout(async () => {
          const replies = [
            "Thanks for reaching out!",
            "I'll get back to you soon.",
            "That sounds interesting.",
            "Could you provide more details?",
            "I appreciate the information.",
            "Let me think about it and get back to you.",
            "I'm interested in learning more.",
            "That works for me."
          ];
          
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          const replyMessage = await messageService.receiveMessage(
            selectedContact.id,
            randomReply
          );
          
          setMessages(prevMessages => [...prevMessages, replyMessage]);
          
          // Update the last message timestamp for this contact
          setLastMessageTimestamps(prev => ({
            ...prev,
            [selectedContact.id]: replyMessage.timestamp
          }));
          
          // Update the contact's status to 'responded'
          await contactService.updateContact(selectedContact.id, {
            status: 'responded',
            lastContacted: new Date()
          });
          
          // Update the contacts state to reflect the status change
          setContacts(prevContacts => 
            prevContacts.map(c => 
              c.id === selectedContact.id 
                ? { ...c, status: 'responded', lastContacted: new Date() } 
                : c
            )
          );
        }, replyDelay);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // If there's an error, remove the temporary message
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== tempMessage.id)
      );
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
          <p className="mt-2 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-[calc(100vh-160px)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <div className="md:col-span-1 overflow-hidden">
          <ContactListSidebar 
            contacts={contacts} 
            onSelectContact={handleSelectContact} 
            selectedContactId={selectedContact?.id}
            lastMessageTimestamps={lastMessageTimestamps}
          />
        </div>
        
        <div className="md:col-span-2 overflow-hidden">
          {selectedContact ? (
            <ChatInterface 
              messages={messages} 
              contact={selectedContact} 
              onSendMessage={handleSendMessage}
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              onFileSelect={handleFileSelect}
              fileInputRef={fileInputRef}
              messageType={messageType}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">Select a contact to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
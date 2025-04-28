import React, { useState, useRef, useEffect } from 'react';
import { Message, Contact } from '../../types';
import { Send, Paperclip, X, File, Mic } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  contact: Contact;
  onSendMessage: (message: string, type: Message['messageType']) => void;
  selectedFile: File | null;
  previewUrl: string | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  messageType: Message['messageType'];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  contact, 
  onSendMessage,
  selectedFile,
  previewUrl,
  onFileSelect,
  fileInputRef,
  messageType
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() || selectedFile) {
      onSendMessage(newMessage, messageType);
      setNewMessage('');
    }
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect({ target: { files: null } } as React.ChangeEvent<HTMLInputElement>);
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Group messages by date
  const groupedMessages: Record<string, Message[]> = {};
  messages.forEach(message => {
    const date = new Date(message.timestamp).toDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });
  
  const renderMessageStatus = (message: Message) => {
    if (message.direction === 'incoming') return null;
    
    switch(message.status) {
      case 'pending':
        return <span className="text-gray-400 ml-1">●</span>;
      case 'sent':
        return <span className="text-blue-400 ml-1">✓</span>;
      case 'delivered':
        return <span className="text-emerald-400 ml-1">✓✓</span>;
      case 'read':
        return <span className="text-emerald-600 ml-1">✓✓</span>;
      case 'failed':
        return <span className="text-red-400 ml-1">!</span>;
      default:
        return null;
    }
  };

  const renderMessageContent = (message: Message) => {
    switch (message.messageType) {
      case 'image':
        return (
          <div className="mt-2">
            <img 
              src={message.content} 
              alt="Shared image" 
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        );
      case 'video':
        return (
          <div className="mt-2">
            <video 
              src={message.content} 
              controls 
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        );
      case 'audio':
        return (
          <div className="mt-2">
            <audio 
              src={message.content} 
              controls 
              className="w-full"
            />
          </div>
        );
      case 'document':
        return (
          <div className="mt-2 flex items-center text-blue-600">
            <File className="h-5 w-5 mr-2" />
            <a href={message.content} target="_blank" rel="noopener noreferrer">
              {message.content.split('/').pop()}
            </a>
          </div>
        );
      default:
        return <p className="whitespace-pre-wrap">{message.content}</p>;
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg shadow-md overflow-hidden">
      {/* Chat header */}
      <div className="bg-emerald-600 text-white p-3 flex items-center">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-600 font-medium">
          {contact.name.charAt(0)}
        </div>
        <div className="ml-3">
          <p className="font-medium">{contact.name}</p>
          <p className="text-xs text-emerald-100">{contact.phone_number}</p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5]">
        {Object.keys(groupedMessages).map(date => (
          <div key={date}>
            {/* Date divider */}
            <div className="flex justify-center my-3">
              <div className="px-3 py-1 bg-white rounded-full text-xs text-gray-500 shadow-sm">
                {formatDate(new Date(date).toISOString())}
              </div>
            </div>
            
            {groupedMessages[date].map(message => (
              <div 
                key={message.id} 
                className={`mb-3 flex ${message.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`rounded-lg px-3 py-2 max-w-[75%] shadow-sm ${
                    message.direction === 'outgoing' 
                      ? 'bg-[#dcf8c6] text-gray-800' 
                      : 'bg-white text-gray-800'
                  }`}
                >
                  {message.isCampaignMessage && (
                    <div className="text-xs text-gray-500 mb-1">Campaign Message</div>
                  )}
                  
                  {renderMessageContent(message)}
                  
                  <div className="text-right mt-1">
                    <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                    {renderMessageStatus(message)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-500">
            No messages yet
          </div>
        )}
        
        <div ref={messageEndRef} />
      </div>
      
      {/* File preview */}
      {selectedFile && (
        <div className="bg-gray-50 border-t border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {messageType === 'image' && previewUrl && (
                <img src={previewUrl} alt="Preview" className="h-10 w-10 object-cover rounded" />
              )}
              {messageType === 'video' && previewUrl && (
                <video src={previewUrl} className="h-10 w-10 object-cover rounded" />
              )}
              {messageType === 'audio' && (
                <Mic className="h-5 w-5 text-gray-500 mr-2" />
              )}
              {messageType === 'document' && (
                <File className="h-5 w-5 text-gray-500 mr-2" />
              )}
              <span className="text-sm text-gray-600 truncate">{selectedFile.name}</span>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Message input */}
      <div className="bg-gray-50 border-t border-gray-200 p-3">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileSelect}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200 focus:outline-none"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md py-2 px-3 mx-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder={selectedFile ? "Add a caption..." : "Type a message..."}
          />
          <button 
            type="submit" 
            className="p-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            disabled={!newMessage.trim() && !selectedFile}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
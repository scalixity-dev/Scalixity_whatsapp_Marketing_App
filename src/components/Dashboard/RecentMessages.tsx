import React from 'react';
import { Message } from '../../types';
import { useNavigate } from 'react-router-dom';

interface RecentMessagesProps {
  messages: Message[];
  contacts: { id: number; name: string }[];
}

const RecentMessages: React.FC<RecentMessagesProps> = ({ messages, contacts }) => {
  const navigate = useNavigate();
  
  const getContactName = (contactId: number) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Unknown Contact';
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleMessageClick = (contactId: number) => {
    navigate(`/conversations/${contactId}`);
  };
  
  const getMessageStatusIcon = (status: Message['status']) => {
    switch(status) {
      case 'pending':
        return <span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span>;
      case 'sent':
        return <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>;
      case 'delivered':
        return <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>;
      case 'read':
        return <span className="inline-block w-2 h-2 rounded-full bg-indigo-400"></span>;
      case 'failed':
        return <span className="inline-block w-2 h-2 rounded-full bg-red-400"></span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Messages</h3>
        <button 
          className="text-sm text-emerald-600 hover:text-emerald-700"
          onClick={() => navigate('/conversations')}
        >
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleMessageClick(message.contactId)}
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                {getContactName(message.contactId).charAt(0)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getContactName(message.contactId)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTime(message.timestamp)}
                </p>
              </div>
              <div className="flex items-center mt-1">
                {message.direction === 'incoming' ? (
                  <span className="text-xs bg-emerald-100 text-emerald-800 rounded-full px-2 py-0.5 mr-2">
                    Received
                  </span>
                ) : (
                  <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 mr-2 flex items-center">
                    Sent 
                    <span className="ml-1">{getMessageStatusIcon(message.status)}</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate mt-1">
                {message.content}
              </p>
            </div>
          </div>
        ))}
        
        {messages.length === 0 && (
          <div className="py-3 text-center text-sm text-gray-500">
            No messages found
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentMessages;
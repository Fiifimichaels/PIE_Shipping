import React, { useState } from 'react';
import { Mail, Phone, Calendar, Eye, Trash2, Reply } from 'lucide-react';
import { contactService } from '../../services/contactService';
import { ContactMessage } from '../../lib/supabase';

const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const data = await contactService.getMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMessages = messages.filter(message => 
    filter === 'all' || message.status === filter
  );

  const updateMessageStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      const result = await contactService.updateMessageStatus(id, status);
      if (result.success) {
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, status } : msg
        ));
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, status });
        }
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const result = await contactService.deleteMessage(id);
      if (result.success) {
        setMessages(messages.filter(msg => msg.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'read': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'replied': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Messages List */}
      <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Messages</h3>
          <div className="mt-2 flex space-x-2">
            {['all', 'unread', 'read', 'replied'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-3 py-1 text-xs rounded-full capitalize ${
                  filter === status
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {status} ({messages.filter(m => status === 'all' || m.status === status).length})
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto max-h-96">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Loading messages...
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No messages found
            </div>
          ) : (
            filteredMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedMessage?.id === message.id ? 'bg-blue-50 dark:bg-blue-900' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{message.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(message.status)}`}>
                  {message.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{message.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 truncate">{message.message}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(message.created_at).toLocaleString()}</p>
            </div>
          )))}
        </div>
      </div>

      {/* Message Detail */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
        {selectedMessage ? (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedMessage.name}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
                    title="Mark as read"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                    className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg"
                    title="Mark as replied"
                  >
                    <Reply className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                    title="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{selectedMessage.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{selectedMessage.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{new Date(selectedMessage.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedMessage.status)}`}>
                    {selectedMessage.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 p-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Message:</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedMessage.message}
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <textarea
                placeholder="Type your reply..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                rows={3}
              />
              <div className="mt-3 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Select a message to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessages;
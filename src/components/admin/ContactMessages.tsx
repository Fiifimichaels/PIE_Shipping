import React, { useState } from 'react';
import { Mail, Phone, Calendar, Eye, Trash2, Reply } from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      message: 'I need a quote for shipping 50 containers from New York to Shanghai.',
      status: 'unread',
      createdAt: '2024-01-15 10:30:00',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@company.com',
      phone: '+1 (555) 987-6543',
      message: 'Can you provide information about your air freight services to Europe?',
      status: 'read',
      createdAt: '2024-01-14 15:45:00',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@business.com',
      phone: '+1 (555) 456-7890',
      message: 'I have a time-sensitive shipment that needs to reach Tokyo by Friday.',
      status: 'replied',
      createdAt: '2024-01-13 09:15:00',
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');

  const filteredMessages = messages.filter(message => 
    filter === 'all' || message.status === filter
  );

  const updateMessageStatus = (id: number, status: Message['status']) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, status } : msg
    ));
  };

  const deleteMessage = (id: number) => {
    setMessages(messages.filter(msg => msg.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
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
          {filteredMessages.map((message) => (
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
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{message.createdAt}</p>
            </div>
          ))}
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
                  <span className="text-gray-600 dark:text-gray-400">{selectedMessage.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{selectedMessage.createdAt}</span>
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
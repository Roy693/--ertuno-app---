import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { ChatService } from '../../services/chat';
import type { Conversation } from '../../types';

interface ChatListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

export const ChatList: React.FC<ChatListProps> = ({ 
  onSelectConversation, 
  selectedConversationId 
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = ChatService.getUserConversations(user.id, (convs) => {
      setConversations(convs);
      setLoading(false);
    });

    return unsubscribe;
  }, [user?.id]);

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    
    // Filter by participant names or last message content
    const query = searchQuery.toLowerCase();
    return conv.lastMessage?.content.toLowerCase().includes(query) ||
           conv.metadata?.title?.toLowerCase().includes(query);
  });

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.metadata?.title) {
      return conversation.metadata.title;
    }
    
    if (conversation.type === 'service_request') {
      return `Service Request #${conversation.serviceRequestId?.slice(-6)}`;
    }
    
    // For direct messages, show other participant's name
    // This would need user data fetching in a real implementation
    return 'Direct Message';
  };

  const getConversationAvatar = (conversation: Conversation) => {
    // In a real implementation, fetch other participant's avatar
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(getConversationTitle(conversation))}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Messages
          </h2>
          <Button variant="ghost" size="sm" className="p-2">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start a conversation with a service provider or post a service request'
              }
            </p>
            {!searchQuery && (
              <Button variant="primary">
                Start Your First Conversation
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedConversationId === conversation.id
                    ? 'bg-primary-50 dark:bg-primary-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={getConversationAvatar(conversation)}
                      alt={getConversationTitle(conversation)}
                      className="w-12 h-12 rounded-full"
                    />
                    {conversation.type === 'service_request' && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                        S
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {getConversationTitle(conversation)}
                      </h4>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatLastMessageTime(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>

                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {conversation.lastMessage.type === 'text' 
                          ? conversation.lastMessage.content
                          : `${conversation.lastMessage.type === 'image' ? '📷 ' : '📎 '}${
                              conversation.lastMessage.content || 'Media'
                            }`
                        }
                      </p>
                    )}

                    {conversation.metadata?.category && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100">
                          {conversation.metadata.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Unread indicator placeholder */}
                  {conversation.lastMessage && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
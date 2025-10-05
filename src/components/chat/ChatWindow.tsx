import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Image, 
  Paperclip, 
  MapPin, 
  Phone, 
  Video,
  MoreVertical,
  ArrowLeft 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { ChatService } from '../../services/chat';
import type { ChatMessage, Conversation } from '../../types';

interface ChatWindowProps {
  conversation: Conversation;
  onBack: () => void;
  otherParticipant?: {
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  conversation, 
  onBack,
  otherParticipant 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!conversation.id) return;

    const unsubscribe = ChatService.getConversationMessages(conversation.id, (msgs) => {
      setMessages(msgs);
      // Mark messages as read
      if (user?.id) {
        ChatService.markAsRead(conversation.id, user.id);
      }
    });

    return unsubscribe;
  }, [conversation.id, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id) return;

    try {
      await ChatService.sendMessage(
        conversation.id,
        user.id,
        newMessage.trim()
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const isOwnMessage = (message: ChatMessage) => message.senderId === user?.id;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1 md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          {otherParticipant && (
            <>
              <div className="relative">
                <img
                  src={otherParticipant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant.name)}`}
                  alt={otherParticipant.name}
                  className="w-10 h-10 rounded-full"
                />
                {otherParticipant.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {otherParticipant.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {otherParticipant.isOnline ? 'Online' : 'Last seen recently'}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isOwnMessage(message)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}>
                {/* Message Content */}
                <div className="mb-1">
                  {message.type === 'text' && (
                    <p className="text-sm">{message.content}</p>
                  )}
                  
                  {message.type === 'image' && message.metadata?.imageUrl && (
                    <div>
                      <img
                        src={message.metadata.imageUrl}
                        alt="Shared image"
                        className="rounded-lg max-w-full h-auto mb-2"
                      />
                      {message.content && (
                        <p className="text-sm">{message.content}</p>
                      )}
                    </div>
                  )}
                  
                  {message.type === 'quote' && (
                    <div className={`p-3 rounded border-l-4 ${
                      isOwnMessage(message)
                        ? 'bg-primary-600 border-primary-300'
                        : 'bg-gray-50 dark:bg-gray-600 border-primary-500'
                    }`}>
                      <p className="text-sm font-medium">Service Quote</p>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  )}
                  
                  {message.type === 'location' && message.metadata?.location && (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">Location shared</span>
                      </div>
                      {message.metadata.location.address && (
                        <p className="text-sm">{message.metadata.location.address}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Message Time */}
                <p className={`text-xs ${
                  isOwnMessage(message) 
                    ? 'text-primary-100' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {formatMessageTime(message.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                // Handle file upload
                console.log('File selected:', e.target.files?.[0]);
              }}
            />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              className="p-2"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleFileUpload}
              className="p-2"
            >
              <Image className="w-5 h-5" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <MapPin className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 rounded-full"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
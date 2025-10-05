import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot,
  User,
  Minimize2,
  Volume2,
  VolumeX,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { collection, addDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore';
// Firebase integration - connect to existing Firebase instance
// import { db } from '../../lib/firebase';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  userId?: string;
  rating?: 'helpful' | 'not_helpful';
  metadata?: {
    intent?: string;
    confidence?: number;
    suggested_actions?: Array<{
      label: string;
      action: string;
      data?: any;
    }>;
  };
}

interface ChatBotProps {
  onClose?: () => void;
  initialMessage?: string;
  context?: 'onboarding' | 'booking' | 'support' | 'general';
}

const PREDEFINED_RESPONSES = {
  greeting: {
    responses: [
      "Ciao! 👋 Sono l'assistente AI di ERTUNO. Come posso aiutarti oggi?",
      "Benvenuto su ERTUNO! Sono qui per aiutarti con qualsiasi domanda sui nostri servizi.",
      "Salve! Posso assisterti con prenotazioni, provider o qualsiasi altra domanda."
    ],
    suggestions: [
      { label: "Come funziona ERTUNO?", action: "explain_platform" },
      { label: "Voglio prenotare un servizio", action: "start_booking" },
      { label: "Sono un provider", action: "provider_info" },
      { label: "Problemi con il pagamento", action: "payment_help" }
    ]
  },
  booking_help: {
    responses: [
      "Ti aiuto con la prenotazione! Puoi cercare servizi per categoria, leggere le recensioni dei provider e confrontare i prezzi. Cosa stai cercando?",
      "Per prenotare un servizio: 1) Cerca nella categoria desiderata 2) Confronta i provider 3) Seleziona e prenota. Su cosa hai bisogno di aiuto?"
    ],
    suggestions: [
      { label: "Come scegliere un provider?", action: "provider_selection" },
      { label: "Come funzionano i pagamenti?", action: "payment_info" },
      { label: "Posso annullare una prenotazione?", action: "cancellation_policy" }
    ]
  },
  provider_help: {
    responses: [
      "Perfetto! Come provider su ERTUNO puoi accedere a clienti verificati, gestire le tue prenotazioni e far crescere il tuo business. Cosa vuoi sapere?",
      "Benvenuto nel mondo dei provider ERTUNO! Offriamo strumenti professionali per gestire clienti, prenotazioni e pagamenti. Come posso aiutarti?"
    ],
    suggestions: [
      { label: "Come registro la mia attività?", action: "provider_registration" },
      { label: "Quanto costa l'abbonamento?", action: "pricing_info" },
      { label: "Come ricevo i pagamenti?", action: "payment_provider" },
      { label: "Gestione del calendario", action: "calendar_help" }
    ]
  }
};

export const ChatBot: React.FC<ChatBotProps> = ({ 
  onClose, 
  initialMessage,
  context = 'general' 
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Initialize conversation
  useEffect(() => {
    initializeConversation();
  }, [user]);

  // Load previous messages if user is logged in
  useEffect(() => {
    if (user && conversationId) {
      const messagesQuery = query(
        collection(db, 'support_conversations', conversationId, 'messages'),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
        const loadedMessages: ChatMessage[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          loadedMessages.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate() || new Date()
          } as ChatMessage);
        });
        
        if (loadedMessages.length > 0) {
          setMessages(loadedMessages);
        }
      });

      return () => unsubscribe();
    }
  }, [user, conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeConversation = async () => {
    let welcomeMessage: ChatMessage;

    if (initialMessage) {
      welcomeMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: initialMessage,
        timestamp: new Date()
      };
    } else {
      const greeting = PREDEFINED_RESPONSES.greeting;
      welcomeMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: greeting.responses[Math.floor(Math.random() * greeting.responses.length)],
        timestamp: new Date(),
        metadata: {
          intent: 'greeting',
          confidence: 1.0,
          suggested_actions: greeting.suggestions
        }
      };
    }

    setMessages([welcomeMessage]);

    // Create conversation in Firestore if user is logged in
    if (user) {
      try {
        const conversationDoc = await addDoc(collection(db, 'support_conversations'), {
          userId: user.id,
          userEmail: user.email,
          context: context,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        setConversationId(conversationDoc.id);

        // Save welcome message
        await addDoc(collection(db, 'support_conversations', conversationDoc.id, 'messages'), {
          ...welcomeMessage,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    }
  };

  const generateAIResponse = async (userMessage: string): Promise<ChatMessage> => {
    // Simple AI logic - in production, integrate with OpenAI/Claude API
    const lowerMessage = userMessage.toLowerCase();
    
    let responseData = PREDEFINED_RESPONSES.greeting;
    let intent = 'general';

    if (lowerMessage.includes('prenotare') || lowerMessage.includes('booking') || lowerMessage.includes('servizio')) {
      responseData = PREDEFINED_RESPONSES.booking_help;
      intent = 'booking_help';
    } else if (lowerMessage.includes('provider') || lowerMessage.includes('fornitore') || lowerMessage.includes('business')) {
      responseData = PREDEFINED_RESPONSES.provider_help;
      intent = 'provider_help';
    } else if (lowerMessage.includes('pagamento') || lowerMessage.includes('payment') || lowerMessage.includes('costo')) {
      intent = 'payment_help';
      responseData = {
        responses: [
          "I pagamenti su ERTUNO sono sicuri e processati tramite Stripe. Accettiamo tutte le carte principali e PayPal. I pagamenti vengono trattenuti fino al completamento del servizio.",
          "Per i pagamenti: 1) Seleziona il provider 2) Conferma il servizio 3) Paga in sicurezza 4) Il pagamento viene rilasciato dopo il completamento"
        ],
        suggestions: [
          { label: "Metodi di pagamento accettati", action: "payment_methods" },
          { label: "Quando viene addebitato?", action: "payment_timing" },
          { label: "Rimborsi e cancellazioni", action: "refund_policy" }
        ]
      };
    }

    return {
      id: Date.now().toString() + '_bot',
      type: 'bot',
      content: responseData.responses[Math.floor(Math.random() * responseData.responses.length)],
      timestamp: new Date(),
      metadata: {
        intent,
        confidence: 0.85,
        suggested_actions: responseData.suggestions
      }
    };
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
      userId: user?.id
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Save user message to Firestore
    if (user && conversationId) {
      try {
        await addDoc(collection(db, 'support_conversations', conversationId, 'messages'), {
          ...userMessage,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error saving message:', error);
      }
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const botResponse = await generateAIResponse(userMessage.content);
      setMessages(prev => [...prev, botResponse]);

      // Save bot response to Firestore
      if (user && conversationId) {
        await addDoc(collection(db, 'support_conversations', conversationId, 'messages'), {
          ...botResponse,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '_error',
        type: 'bot',
        content: 'Mi dispiace, ho avuto un problema tecnico. Puoi riprovare o contattare il nostro team di supporto direttamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (action: string, data?: any) => {
    const suggestions: Record<string, string> = {
      explain_platform: "Come funziona ERTUNO?",
      start_booking: "Voglio prenotare un servizio",
      provider_info: "Informazioni per diventare provider",
      payment_help: "Help con i pagamenti",
      provider_selection: "Come scegliere il provider giusto?",
      payment_info: "Come funzionano i pagamenti?",
      cancellation_policy: "Politica di cancellazione",
      provider_registration: "Come registro la mia attività?",
      pricing_info: "Quanto costa l'abbonamento?",
      payment_provider: "Come ricevo i pagamenti come provider?",
      calendar_help: "Come gestisco il calendario?",
      payment_methods: "Quali metodi di pagamento accettate?",
      payment_timing: "Quando viene addebitato il pagamento?",
      refund_policy: "Come funzionano i rimborsi?"
    };

    const suggestionText = suggestions[action] || action;
    setInput(suggestionText);
  };

  const handleRateMessage = async (messageId: string, rating: 'helpful' | 'not_helpful') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, rating } : msg
    ));

    // Save rating to Firestore
    if (user && conversationId) {
      try {
        await addDoc(collection(db, 'support_feedback'), {
          conversationId,
          messageId,
          userId: user.id,
          rating,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Error saving feedback:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setConversationId(null);
    initializeConversation();
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={chatRef}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden"
      style={{ height: 'calc(100vh - 8rem)', maxHeight: '600px' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Assistente ERTUNO</h3>
            <p className="text-xs opacity-90">Sempre qui per aiutarti</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 hover:bg-white/10 rounded"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={resetConversation}
            className="p-1 hover:bg-white/10 rounded"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-white/10 rounded"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 140px)' }}>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString('it-IT', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {message.type === 'bot' && (
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          onClick={() => handleRateMessage(message.id, 'helpful')}
                          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                            message.rating === 'helpful' ? 'text-green-600' : 'text-gray-400'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRateMessage(message.id, 'not_helpful')}
                          className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                            message.rating === 'not_helpful' ? 'text-red-600' : 'text-gray-400'
                          }`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Suggested Actions */}
                {message.type === 'bot' && message.metadata?.suggested_actions && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.metadata.suggested_actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(action.action, action.data)}
                        className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' ? 'order-1 ml-2 bg-primary-100' : 'order-2 mr-2 bg-gray-200'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-primary-600" />
                ) : (
                  <Bot className="w-4 h-4 text-gray-600" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
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

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Scrivi il tuo messaggio..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
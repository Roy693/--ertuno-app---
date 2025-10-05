import React, { useState, useEffect } from 'react';
import { ChatBot } from './ChatBot';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';

interface SupportWidgetProps {
  autoOpen?: boolean;
  context?: 'onboarding' | 'booking' | 'support' | 'general';
}

const CONTEXT_MESSAGES = {
  onboarding: "Benvenuto su ERTUNO! 🎉 Sono qui per guidarti nei primi passi. Vuoi sapere come funziona la piattaforma?",
  booking: "Ti aiuto con la prenotazione! 📅 Posso spiegarti come scegliere il provider giusto, confrontare i prezzi o completare il pagamento.",
  support: "Sono qui per risolvere qualsiasi problema! 🔧 Dimmi cosa non sta funzionando e ti aiuto subito.",
  general: undefined
};

export const SupportWidget: React.FC<SupportWidgetProps> = ({ 
  autoOpen = false, 
  context = 'general' 
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-open logic based on user behavior
  useEffect(() => {
    if (autoOpen && !hasInteracted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasInteracted(true);
      }, 3000); // Open after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [autoOpen, hasInteracted]);

  // Context-based auto-open for new users
  useEffect(() => {
    if (user && !hasInteracted) {
      const userCreatedAt = new Date(user.createdAt || '');
      const isNewUser = Date.now() - userCreatedAt.getTime() < 24 * 60 * 60 * 1000; // 24 hours

      if (isNewUser && location.pathname === '/dashboard') {
        const timer = setTimeout(() => {
          setIsOpen(true);
          setHasInteracted(true);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [user, location.pathname, hasInteracted]);

  // Context-based messaging for specific pages
  useEffect(() => {
    if (location.pathname.includes('/services') && context !== 'booking') {
      // User is browsing services, could offer booking help
    }
  }, [location.pathname, context]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasInteracted(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Don't show widget on certain pages
  const hiddenPages = ['/login', '/signup', '/admin'];
  if (hiddenPages.some(page => location.pathname.includes(page))) {
    return null;
  }

  return (
    <>
      {isOpen ? (
        <ChatBot
          onClose={handleClose}
          initialMessage={CONTEXT_MESSAGES[context]}
          context={context}
        />
      ) : (
        // Floating action button when closed
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={handleOpen}
            className="group relative w-14 h-14 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center"
          >
            {/* Notification dot for new users */}
            {user && !hasInteracted && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white" />
            )}
            
            {/* Message icon with animation */}
            <svg
              className="w-6 h-6 transform group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Hai bisogno di aiuto?
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black" />
            </div>
          </button>
        </div>
      )}
    </>
  );
};
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, Settings, X, Check, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

interface CookieConsentProps {
  onConsentGiven: (preferences: CookiePreferences) => void;
}

const COOKIE_CONSENT_KEY = 'ertuno_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'ertuno_cookie_preferences';

export const CookieConsent: React.FC<CookieConsentProps> = ({ onConsentGiven }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    personalization: false
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else if (savedPreferences) {
      // Load saved preferences
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
        onConsentGiven(parsed);
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
  }, [onConsentGiven]);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true
    };
    
    saveConsent(allAccepted);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false
    };
    
    saveConsent(necessaryOnly);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    localStorage.setItem('ertuno_consent_date', new Date().toISOString());
    
    setPreferences(prefs);
    onConsentGiven(prefs);
    setShowBanner(false);
    setShowDetails(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden"
        >
          {!showDetails ? (
            /* Simple Banner */
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Rispettiamo la tua Privacy
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Utilizziamo cookie per migliorare la tua esperienza, analizzare il traffico e personalizzare i contenuti. 
                    Puoi scegliere quali cookie accettare.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleAcceptAll}
                      className="flex-1"
                    >
                      Accetta Tutti
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAcceptNecessary}
                      className="flex-1"
                    >
                      Solo Necessari
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setShowDetails(true)}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Personalizza
                    </button>
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center"
                    >
                      Privacy Policy <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Detailed Preferences */
            <div>
              {/* Header */}
              <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Impostazioni Cookie
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Cookie Categories */}
              <div className="p-6 space-y-6">
                {/* Necessary Cookies */}
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-green-100 border-2 border-green-500 rounded flex items-center justify-center mt-1">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Cookie Necessari
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Essenziali per il funzionamento del sito. Include autenticazione, sicurezza e preferenze di base.
                    </p>
                    <span className="inline-block mt-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded">
                      Sempre attivo
                    </span>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => togglePreference('analytics')}
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center mt-1 transition-colors ${
                      preferences.analytics
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                    }`}
                  >
                    {preferences.analytics && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Cookie Analytics
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Ci aiutano a capire come usi il sito per migliorare l'esperienza. Dati anonimi e aggregati.
                    </p>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => togglePreference('marketing')}
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center mt-1 transition-colors ${
                      preferences.marketing
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                    }`}
                  >
                    {preferences.marketing && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Cookie Marketing
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Utilizzati per mostrare annunci pertinenti e misurare l'efficacia delle campagne pubblicitarie.
                    </p>
                  </div>
                </div>

                {/* Personalization Cookies */}
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => togglePreference('personalization')}
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center mt-1 transition-colors ${
                      preferences.personalization
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                    }`}
                  >
                    {preferences.personalization && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Cookie Personalizzazione
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Ricordano le tue preferenze per personalizzare contenuti e raccomandazioni.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSavePreferences}
                    className="flex-1"
                  >
                    Salva Preferenze
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAcceptAll}
                    className="flex-1"
                  >
                    Accetta Tutti
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Puoi modificare queste impostazioni in qualsiasi momento dalle impostazioni dell'account.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
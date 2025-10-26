import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, BarChart3, Target, Info } from 'lucide-react';
import { useCookieConsent, CookieConsent } from '../../hooks/useCookieConsent';
import { useI18n } from '../../hooks/useI18n';

export const CookieSettingsModal: React.FC = () => {
  const { showSettings, closeSettings, consent, updateConsent } = useCookieConsent();
  const { t } = useI18n();
  
  const [localConsent, setLocalConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false
  });

  // Update local state when consent changes
  useEffect(() => {
    if (consent) {
      setLocalConsent(consent);
    }
  }, [consent]);

  if (!showSettings) return null;

  const handleToggle = (category: keyof CookieConsent) => {
    if (category === 'necessary') return; // Cannot disable necessary cookies
    
    setLocalConsent(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSave = () => {
    updateConsent(localConsent);
  };

  const cookieCategories = [
    {
      key: 'necessary' as keyof CookieConsent,
      icon: Shield,
      title: t('cookies.category.necessary'),
      description: t('cookies.category.necessary.description'),
      required: true,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      key: 'analytics' as keyof CookieConsent,
      icon: BarChart3,
      title: t('cookies.category.analytics'),
      description: t('cookies.category.analytics.description'),
      required: false,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      key: 'marketing' as keyof CookieConsent,
      icon: Target,
      title: t('cookies.category.marketing'),
      description: t('cookies.category.marketing.description'),
      required: false,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-labelledby="cookie-settings-title"
        aria-describedby="cookie-settings-description"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={closeSettings}
        />

        {/* Modal */}
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 
                  id="cookie-settings-title"
                  className="text-2xl font-bold text-ertuno-navy"
                >
                  {t('cookies.settings.title')}
                </h2>
                <p 
                  id="cookie-settings-description"
                  className="text-gray-600 mt-1"
                >
                  {t('cookies.settings.description')}
                </p>
              </div>
              <button
                onClick={closeSettings}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label={t('cookies.settings.close')}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cookie Categories */}
            <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
              {cookieCategories.map(category => {
                const IconComponent = category.icon;
                const isEnabled = localConsent[category.key];
                
                return (
                  <div key={category.key} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-2 ${category.bgColor} rounded-lg flex-shrink-0`}>
                          <IconComponent className={`w-5 h-5 ${category.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-ertuno-navy">
                              {category.title}
                            </h3>
                            {category.required && (
                              <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                Necessario
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {category.description}
                          </p>
                          
                          {/* Additional info for each category */}
                          <div className="mt-3 text-xs text-gray-500 flex items-start gap-2">
                            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <div>
                              {category.key === 'necessary' && (
                                <>Cookie di sessione, autenticazione, sicurezza e funzionalità base del sito.</>
                              )}
                              {category.key === 'analytics' && (
                                <>Google Analytics per statistiche anonime di utilizzo. Dati aggregati senza identificazione personale.</>
                              )}
                              {category.key === 'marketing' && (
                                <>Cookie pubblicitari di terze parti per annunci personalizzati. Attualmente non utilizzati.</>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Toggle Switch */}
                      <div className="flex-shrink-0 ml-4">
                        <button
                          onClick={() => handleToggle(category.key)}
                          disabled={category.required}
                          className={`
                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ertuno-teal focus:ring-offset-2
                            ${isEnabled 
                              ? 'bg-ertuno-teal' 
                              : 'bg-gray-300'
                            }
                            ${category.required 
                              ? 'cursor-not-allowed opacity-75' 
                              : 'cursor-pointer'
                            }
                          `}
                          role="switch"
                          aria-checked={isEnabled}
                          aria-label={`${category.title} ${isEnabled ? 'abilitato' : 'disabilitato'}`}
                        >
                          <span
                            className={`
                              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                              ${isEnabled ? 'translate-x-6' : 'translate-x-1'}
                            `}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="text-xs text-gray-500">
                Le modifiche saranno applicate immediatamente al salvataggio
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeSettings}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ertuno-teal/50"
                >
                  {t('cookies.settings.close')}
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 text-sm font-medium text-white bg-ertuno-teal hover:bg-ertuno-teal/90 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-ertuno-teal/50"
                >
                  {t('cookies.settings.save')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
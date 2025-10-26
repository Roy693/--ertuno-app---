import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, Shield, ExternalLink } from 'lucide-react';
import { useCookieConsent } from '../../hooks/useCookieConsent';
import { useI18n } from '../../hooks/useI18n';

export const CookieConsentBanner: React.FC = () => {
  const { showBanner, acceptAll, rejectAll, openSettings } = useCookieConsent();
  const { t } = useI18n();

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-ertuno-navy/10 shadow-2xl"
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-describedby="cookie-banner-description"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Icon and Content */}
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 mt-1">
                <div className="p-2 bg-ertuno-teal/10 rounded-lg">
                  <Cookie className="w-6 h-6 text-ertuno-teal" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 
                  id="cookie-banner-title"
                  className="text-lg font-semibold text-ertuno-navy mb-2"
                >
                  {t('cookies.banner.title')}
                </h3>
                <p 
                  id="cookie-banner-description"
                  className="text-gray-600 text-sm leading-relaxed"
                >
                  {t('cookies.banner.message')}
                </p>
                
                {/* View Cookie Policy Link */}
                <button
                  onClick={() => window.open('/cookie-policy', '_blank')}
                  className="inline-flex items-center gap-1 mt-2 text-ertuno-teal hover:text-ertuno-teal/80 text-sm font-medium transition-colors"
                  aria-label={t('cookies.banner.viewPolicy')}
                >
                  <ExternalLink className="w-3 h-3" />
                  {t('cookies.banner.viewPolicy')}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              {/* Customize Button */}
              <button
                onClick={openSettings}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-ertuno-navy bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ertuno-teal/50 focus:ring-offset-2"
                aria-label={t('cookies.banner.customize')}
              >
                <Settings className="w-4 h-4" />
                {t('cookies.banner.customize')}
              </button>

              {/* Reject All Button */}
              <button
                onClick={rejectAll}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ertuno-teal/50 focus:ring-offset-2"
                aria-label={t('cookies.banner.rejectAll')}
              >
                {t('cookies.banner.rejectAll')}
              </button>

              {/* Accept All Button */}
              <button
                onClick={acceptAll}
                className="px-6 py-2.5 text-sm font-medium text-white bg-ertuno-teal hover:bg-ertuno-teal/90 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-ertuno-teal/50 focus:ring-offset-2"
                aria-label={t('cookies.banner.acceptAll')}
              >
                {t('cookies.banner.acceptAll')}
              </button>
            </div>
          </div>

          {/* GDPR Compliance Notice */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-3 h-3 text-ertuno-teal" />
            <span>
              Conforme al GDPR (Regolamento UE 2016/679) - 
              <a 
                href="/privacy-policy" 
                className="text-ertuno-teal hover:underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                Leggi la Privacy Policy
              </a>
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
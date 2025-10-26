import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentContextType {
  consent: CookieConsent | null;
  showBanner: boolean;
  showSettings: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updateConsent: (consent: CookieConsent) => void;
  openSettings: () => void;
  closeSettings: () => void;
  resetConsent: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | null>(null);

// Default consent state
const DEFAULT_CONSENT: CookieConsent = {
  necessary: true, // Always true - cannot be disabled
  analytics: false,
  marketing: false
};

// Cookie consent provider
export const CookieConsentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load consent from localStorage on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem('ertuno-cookie-consent');
    if (savedConsent) {
      try {
        const parsedConsent = JSON.parse(savedConsent);
        setConsent({
          necessary: true, // Always ensure necessary is true
          analytics: parsedConsent.analytics || false,
          marketing: parsedConsent.marketing || false
        });
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
        setShowBanner(true);
      }
    } else {
      // First visit - show banner
      setShowBanner(true);
    }
  }, []);

  // Save consent to localStorage and apply settings
  const saveConsent = (newConsent: CookieConsent) => {
    const consentToSave = {
      ...newConsent,
      necessary: true, // Always ensure necessary is true
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('ertuno-cookie-consent', JSON.stringify(consentToSave));
    setConsent(consentToSave);
    setShowBanner(false);
    setShowSettings(false);
    
    // Apply or remove third-party scripts based on consent
    applyConsentSettings(consentToSave);
  };

  // Apply consent settings to third-party services
  const applyConsentSettings = (consent: CookieConsent) => {
    // Google Analytics
    if (consent.analytics) {
      // Enable Google Analytics if not already loaded
      if (typeof window !== 'undefined' && !window.gtag) {
        loadGoogleAnalytics();
      }
    } else {
      // Disable Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied'
        });
      }
    }

    // Marketing/Advertising cookies
    if (!consent.marketing) {
      // Clear marketing-related cookies
      clearMarketingCookies();
    }

    // Set consent mode for Google services
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        ad_user_data: consent.marketing ? 'granted' : 'denied',
        ad_personalization: consent.marketing ? 'granted' : 'denied'
      });
    }
  };

  // Load Google Analytics
  const loadGoogleAnalytics = () => {
    // Add Google Analytics script if GA_MEASUREMENT_ID is available
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual GA ID
    
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      window.gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        anonymize_ip: true,
        cookie_flags: 'SameSite=Strict;Secure'
      });
    };
  };

  // Clear marketing-related cookies
  const clearMarketingCookies = () => {
    const marketingCookies = [
      '_ga', '_gid', '_gat', '_gac_', '_utm_', '_fbp', '_fbc',
      'fr', 'tr', 'ads', 'datr', 'sb', 'wd'
    ];

    marketingCookies.forEach(cookieName => {
      // Clear cookie for current domain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      // Clear cookie for parent domain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname.split('.').slice(-2).join('.')};`;
    });
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true
    });
  };

  const rejectAll = () => {
    saveConsent(DEFAULT_CONSENT);
  };

  const updateConsent = (newConsent: CookieConsent) => {
    saveConsent(newConsent);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  const resetConsent = () => {
    localStorage.removeItem('ertuno-cookie-consent');
    setConsent(null);
    setShowBanner(true);
    setShowSettings(false);
    
    // Clear all non-necessary cookies
    clearMarketingCookies();
  };

  const value: CookieConsentContextType = {
    consent,
    showBanner,
    showSettings,
    acceptAll,
    rejectAll,
    updateConsent,
    openSettings,
    closeSettings,
    resetConsent
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};

// Hook to use cookie consent context
export const useCookieConsent = (): CookieConsentContextType => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};

// Declare global types for Google Analytics
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
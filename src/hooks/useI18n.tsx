import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  LanguageCode, 
  TranslationKey, 
  SUPPORTED_LANGUAGES, 
  DEFAULT_LANGUAGE,
  loadTranslations, 
  translateKey,
  getBrowserLanguage,
  isValidLanguageCode,
  getLanguageInfo,
  getAllLanguages,
  initializeI18n
} from '../i18n';

interface I18nContextType {
  // Current language state
  currentLanguage: LanguageCode;
  isLoading: boolean;
  
  // Language management
  setLanguage: (lang: LanguageCode) => Promise<void>;
  
  // Translation function
  t: (key: TranslationKey, fallback?: string) => string;
  
  // Utility functions  
  getLanguageInfo: (code: LanguageCode) => typeof SUPPORTED_LANGUAGES[LanguageCode];
  getAllLanguages: () => typeof SUPPORTED_LANGUAGES[LanguageCode][];
  
  // Constants
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
  defaultLanguage: LanguageCode;
}

const I18nContext = createContext<I18nContextType | null>(null);

// Storage keys
const STORAGE_KEY = 'ertuno-language';
const URL_PARAM = 'lang';

/**
 * I18n Provider Component
 * Manages language state, loading, and persistence
 */
export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize i18n system and load initial language
  useEffect(() => {
    const initLanguage = async () => {
      try {
        // Initialize the i18n system
        await initializeI18n();
        
        // Determine initial language
        const initialLang = getInitialLanguage();
        
        // Load translations for initial language
        await loadTranslations(initialLang);
        
        // Set current language
        setCurrentLanguage(initialLang);
        
        // Update document and URL
        updateDocumentLanguage(initialLang);
        updateURL(initialLang);
        
      } catch (error) {
        console.error('Failed to initialize language:', error);
        setCurrentLanguage(DEFAULT_LANGUAGE);
      } finally {
        setIsLoading(false);
      }
    };

    initLanguage();
  }, []);

  // Get initial language from URL, localStorage, or browser
  const getInitialLanguage = (): LanguageCode => {
    // 1. Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get(URL_PARAM);
    if (urlLang && isValidLanguageCode(urlLang)) {
      return urlLang;
    }

    // 2. Check localStorage
    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && isValidLanguageCode(savedLang)) {
      return savedLang as LanguageCode;
    }

    // 3. Check browser language
    return getBrowserLanguage();
  };

  // Update document language attributes
  const updateDocumentLanguage = (lang: LanguageCode) => {
    if (typeof document !== 'undefined') {
      const langInfo = getLanguageInfo(lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = langInfo.dir;
    }
  };

  // Update URL with language parameter (without page refresh)
  const updateURL = (lang: LanguageCode) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      
      if (lang === DEFAULT_LANGUAGE) {
        // Remove language parameter for default language
        url.searchParams.delete(URL_PARAM);
      } else {
        // Set language parameter for non-default languages
        url.searchParams.set(URL_PARAM, lang);
      }
      
      // Update URL without refreshing page
      window.history.replaceState(null, '', url.toString());
    }
  };

  // Change language function
  const setLanguage = useCallback(async (lang: LanguageCode) => {
    if (lang === currentLanguage) return;

    setIsLoading(true);
    
    try {
      // Load translations for new language
      await loadTranslations(lang);
      
      // Update state
      setCurrentLanguage(lang);
      
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, lang);
      
      // Update document attributes
      updateDocumentLanguage(lang);
      
      // Update URL
      updateURL(lang);
      
      console.log(`Language changed to: ${lang}`);
      
    } catch (error) {
      console.error(`Failed to change language to ${lang}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage]);

  // Translation function
  const t = useCallback((key: TranslationKey, fallback?: string): string => {
    const translation = translateKey(key, currentLanguage, DEFAULT_LANGUAGE);
    
    // Return fallback if provided and translation equals the key (meaning not found)
    if (fallback && translation === key) {
      return fallback;
    }
    
    return translation;
  }, [currentLanguage]);

  const contextValue: I18nContextType = {
    currentLanguage,
    isLoading,
    setLanguage,
    t,
    getLanguageInfo,
    getAllLanguages,
    supportedLanguages: SUPPORTED_LANGUAGES,
    defaultLanguage: DEFAULT_LANGUAGE
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

/**
 * Hook to use i18n context
 */
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

/**
 * Hook for translation function only (lighter alternative)
 */
export const useTranslation = () => {
  const { t } = useI18n();
  return { t };
};

/**
 * Higher-order component to wrap components with i18n
 */
export function withI18n<P extends object>(Component: React.ComponentType<P>) {
  return function WrappedComponent(props: P) {
    return (
      <I18nProvider>
        <Component {...props} />
      </I18nProvider>
    );
  };
}

// Re-export types and constants for convenience
export type { LanguageCode, TranslationKey } from '../i18n';
export { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE };
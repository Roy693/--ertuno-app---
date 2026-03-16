// Central i18n system for ERTUNO platform
// Supports dynamic loading, nested keys, and fallback to default language

// Re-export everything from the modular translations system
export * from './translations';

// Keep backward compatibility
export type { LanguageCode, TranslationKey, TranslationObject } from './translations';
export { 
  SUPPORTED_LANGUAGES, 
  DEFAULT_LANGUAGE,
  loadTranslations,
  translateKey,
  initializeI18n,
  getBrowserLanguage,
  isValidLanguageCode,
  getLanguageInfo,
  getAllLanguages,
  batchTranslate,
  hasTranslation
} from './translations';
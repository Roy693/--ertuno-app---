// Central i18n system for ERTUNO platform
// Supports dynamic loading, nested keys, and fallback to default language

export type LanguageCode = 'it' | 'en';
export type TranslationKey = string;

// Language configurations
export const SUPPORTED_LANGUAGES = {
  it: {
    code: 'it',
    name: 'Italiano',
    flag: '🇮🇹',
    dir: 'ltr',
    nativeName: 'Italiano'
  },
  en: {
    code: 'en', 
    name: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
    nativeName: 'English'
  }
} as const;

// Default language (Italian)
export const DEFAULT_LANGUAGE: LanguageCode = 'it';

// Translation type definition
export type TranslationObject = {
  [key: string]: string | TranslationObject;
};

// Global translations cache
let translationsCache: Partial<Record<LanguageCode, TranslationObject>> = {};

/**
 * Load translations for a specific language
 */
export async function loadTranslations(languageCode: LanguageCode): Promise<TranslationObject> {
  // Return from cache if already loaded
  if (translationsCache[languageCode]) {
    return translationsCache[languageCode]!;
  }

  try {
    // Dynamic import based on language code
    const translations = await import(`./locales/${languageCode}.json`);
    const translationData = translations.default;
    
    // Cache the loaded translations
    translationsCache[languageCode] = translationData;
    
    return translationData;
  } catch (error) {
    console.warn(`Failed to load translations for ${languageCode}:`, error);
    
    // Fallback to default language if not already loading it
    if (languageCode !== DEFAULT_LANGUAGE) {
      return await loadTranslations(DEFAULT_LANGUAGE);
    }
    
    // Return empty object as last resort
    return {};
  }
}

/**
 * Get nested value from object using dot notation
 * Examples: 'nav.home', 'hero.cta.primary', 'cookies.banner.title'
 */
function getNestedValue(obj: TranslationObject, path: string): string | undefined {
  return path.split('.').reduce((current: any, key: string) => {
    return current && typeof current === 'object' ? current[key] : undefined;
  }, obj) as string | undefined;
}

/**
 * Translate a key to the current language
 * Supports nested keys (dot notation) and fallback to default language
 */
export function translateKey(
  key: TranslationKey, 
  languageCode: LanguageCode,
  fallbackLanguage: LanguageCode = DEFAULT_LANGUAGE
): string {
  // Get translations for current language
  const currentTranslations = translationsCache[languageCode];
  if (currentTranslations) {
    const translation = getNestedValue(currentTranslations, key);
    if (translation && typeof translation === 'string') {
      return translation;
    }
  }

  // Fallback to default language if different
  if (languageCode !== fallbackLanguage) {
    const fallbackTranslations = translationsCache[fallbackLanguage];
    if (fallbackTranslations) {
      const fallbackTranslation = getNestedValue(fallbackTranslations, key);
      if (fallbackTranslation && typeof fallbackTranslation === 'string') {
        return fallbackTranslation;
      }
    }
  }

  // Return key as fallback if no translation found
  console.warn(`Translation not found for key: ${key} (language: ${languageCode})`);
  return key;
}

/**
 * Initialize i18n system and load default language
 */
export async function initializeI18n(): Promise<void> {
  try {
    await loadTranslations(DEFAULT_LANGUAGE);
    console.log('i18n system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize i18n system:', error);
  }
}

/**
 * Get browser language preference
 */
export function getBrowserLanguage(): LanguageCode {
  if (typeof window !== 'undefined') {
    const browserLang = navigator.language.split('-')[0] as LanguageCode;
    return SUPPORTED_LANGUAGES[browserLang] ? browserLang : DEFAULT_LANGUAGE;
  }
  return DEFAULT_LANGUAGE;
}

/**
 * Validate if language code is supported
 */
export function isValidLanguageCode(code: string): code is LanguageCode {
  return Object.keys(SUPPORTED_LANGUAGES).includes(code);
}

/**
 * Get language info by code
 */
export function getLanguageInfo(code: LanguageCode) {
  return SUPPORTED_LANGUAGES[code];
}

/**
 * Get all supported languages
 */
export function getAllLanguages() {
  return Object.values(SUPPORTED_LANGUAGES);
}

// Export type TranslationObject is already exported above
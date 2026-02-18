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

  // Use inline translations for immediate loading
  const translations = getInlineTranslations(languageCode);
  translationsCache[languageCode] = translations;
  return translations;
}

/**
 * Get inline translations (faster loading for development)
 */
function getInlineTranslations(languageCode: LanguageCode): TranslationObject {
  const itTranslations = {
    nav: {
      home: 'Home',
      about: 'Chi Siamo',
      services: 'Servizi',
      research: 'Università & Ricerca',
      contact: 'Contatti',
      language: 'Lingua'
    },
    auth: {
      signin: 'Accedi',
      signup: 'Registrati',
      getstarted: 'Inizia Ora'
    },
    hero: {
      subtitle: 'Dove l\'eccellenza incontra la fiducia',
      magneticDescription: 'Come le antiche rotte commerciali che univano i popoli, ERTUNO crea ponti invisibili tra chi cerca e chi sa fare. Una rete di fiducia tessuta con il filo d\'oro della competenza italiana.',
      promise: 'Non solo un servizio, ma un\'esperienza che cambia la vita',
      stats: {
        providers: 'Professionisti',
        requests: 'Richieste Risolte',
        cities: 'Città Coperte',
        users: 'Utenti Soddisfatti'
      },
      cta: {
        primary: 'Entra nel Futuro',
        secondary: 'Scopri la Magia'
      }
    },
    landing: {
      search: {
        title: 'Ricerca Intelligente',
        description: 'AI-powered matching. Descrivi il problema, trova il professionista perfetto in secondi.',
        chatTitle: 'Chat Istantanea',
        chatSubtitle: 'Messaging istantaneo per professionisti',
        chatDescription: 'Chatta direttamente con i professionisti. Foto, vocali, preventivi. Zero intermediari, zero commissioni nascoste.',
        verifiedTitle: '100% Verificati',
        verifiedSubtitle: 'Documenti, recensioni, portfolio',
        verifiedDescription: 'Ogni professionista è verificato. Documenti controllati, recensioni vere, pagamenti garantiti.',
        trySearch: 'Prova la Ricerca Intelligente',
        searchExample: 'Ho bisogno di un elettricista per sostituire un quadro elettrico a Milano',
        findProvider: 'Trova Provider →'
      },
      testimonials: {
        title: 'Voci dal Cuore dell\'Eccellenza',
        subtitle: 'Migliaia di storie che parlano di trasformazione'
      },
      cta: {
        title: 'Il Tuo Momento è Arrivato',
        description: 'Unisciti alla famiglia di visionari che hanno scelto l\'eccellenza. Dove ogni connessione diventa leggenda.',
        getStarted: 'Abbraccia il Destino',
        learnMore: 'Svela i Segreti'
      }
    },
    cookies: {
      banner: {
        title: 'Utilizziamo i Cookie',
        message: 'Utilizziamo cookie tecnici necessari per il funzionamento del sito e cookie di analisi per migliorare la tua esperienza.',
        acceptAll: 'Accetta Tutti',
        rejectAll: 'Rifiuta Tutti',
        customize: 'Personalizza',
        viewPolicy: 'Visualizza Cookie Policy'
      }
    }
  };

  const enTranslations = {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      research: 'Universities & Research',
      contact: 'Contact',
      language: 'Language'
    },
    auth: {
      signin: 'Sign In',
      signup: 'Sign Up',
      getstarted: 'Get Started'
    },
    hero: {
      subtitle: 'Where excellence meets trust',
      magneticDescription: 'Like the ancient trade routes that united peoples, ERTUNO creates invisible bridges between those who seek and those who know how to do. A network of trust woven with the golden thread of Italian expertise.',
      promise: 'Not just a service, but a life-changing experience',
      stats: {
        providers: 'Professionals',
        requests: 'Requests Solved',
        cities: 'Cities Covered',
        users: 'Satisfied Users'
      },
      cta: {
        primary: 'Enter the Future',
        secondary: 'Discover the Magic'
      }
    },
    landing: {
      search: {
        title: 'Smart Search',
        description: 'AI-powered matching. Describe the problem, find the perfect professional in seconds.',
        chatTitle: 'Instant Chat',
        chatSubtitle: 'Instant messaging for professionals',
        chatDescription: 'Chat directly with professionals. Photos, voice messages, quotes. Zero intermediaries, zero hidden commissions.',
        verifiedTitle: '100% Verified',
        verifiedSubtitle: 'Documents, reviews, portfolio',
        verifiedDescription: 'Every professional is verified. Checked documents, real reviews, guaranteed payments.',
        trySearch: 'Try Smart Search',
        searchExample: 'I need an electrician to replace an electrical panel in Milan',
        findProvider: 'Find Provider →'
      },
      testimonials: {
        title: 'Voices from the Heart of Excellence',
        subtitle: 'Thousands of stories speaking of transformation'
      },
      cta: {
        title: 'Your Moment Has Arrived',
        description: 'Join the family of visionaries who have chosen excellence. Where every connection becomes legend.',
        getStarted: 'Embrace Destiny',
        learnMore: 'Unveil the Secrets'
      }
    },
    cookies: {
      banner: {
        title: 'We Use Cookies',
        message: 'We use necessary technical cookies for site functionality and analytics cookies to improve your experience.',
        acceptAll: 'Accept All',
        rejectAll: 'Reject All',
        customize: 'Customize',
        viewPolicy: 'View Cookie Policy'
      }
    }
  };

  return languageCode === 'it' ? itTranslations : enTranslations;
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
  let currentTranslations = translationsCache[languageCode];
  
  // If not in cache, load inline translations immediately
  if (!currentTranslations) {
    currentTranslations = getInlineTranslations(languageCode);
    translationsCache[languageCode] = currentTranslations;
  }
  
  if (currentTranslations) {
    const translation = getNestedValue(currentTranslations, key);
    if (translation && typeof translation === 'string') {
      return translation;
    }
  }

  // Fallback to default language if different
  if (languageCode !== fallbackLanguage) {
    let fallbackTranslations = translationsCache[fallbackLanguage];
    
    // If fallback not in cache, load inline translations immediately
    if (!fallbackTranslations) {
      fallbackTranslations = getInlineTranslations(fallbackLanguage);
      translationsCache[fallbackLanguage] = fallbackTranslations;
    }
    
    if (fallbackTranslations) {
      const fallbackTranslation = getNestedValue(fallbackTranslations, key);
      if (fallbackTranslation && typeof fallbackTranslation === 'string') {
        return fallbackTranslation;
      }
    }
  }

  // Log warning and return key as fallback if no translation found
  console.warn(`Translation not found for key: ${key} (language: ${languageCode})`);
  return key;
  console.warn(`Translation not found for key: ${key} (language: ${languageCode})`);
  return key;
}

/**
 * Initialize i18n system and load default language
 */
export async function initializeI18n(): Promise<void> {
  try {
    // Preload both languages
    await loadTranslations('it');
    await loadTranslations('en');
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
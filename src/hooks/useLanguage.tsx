import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Supported languages with their details
export const SUPPORTED_LANGUAGES = {
  it: {
    code: 'it',
    name: 'Italiano',
    flag: '🇮🇹',
    dir: 'ltr'
  },
  en: {
    code: 'en', 
    name: 'English',
    flag: '🇬🇧',
    dir: 'ltr'
  },
  es: {
    code: 'es',
    name: 'Español', 
    flag: '🇪🇸',
    dir: 'ltr'
  },
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷', 
    dir: 'ltr'
  },
  de: {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr'
  }
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  languages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Translation function
const getTranslation = (key: string, lang: LanguageCode): string => {
  const translations: Record<string, Record<LanguageCode, string>> = {
    // Navigation
    'nav.home': {
      it: 'Home',
      en: 'Home', 
      es: 'Inicio',
      fr: 'Accueil',
      de: 'Startseite'
    },
    'nav.services': {
      it: 'Servizi',
      en: 'Services',
      es: 'Servicios', 
      fr: 'Services',
      de: 'Dienstleistungen'
    },
    'nav.about': {
      it: 'Chi Siamo',
      en: 'About',
      es: 'Acerca de',
      fr: 'À propos',
      de: 'Über uns'
    },
    'nav.contact': {
      it: 'Contatti',
      en: 'Contact',
      es: 'Contacto',
      fr: 'Contact',
      de: 'Kontakt'
    },
    'nav.language': {
      it: 'Lingua',
      en: 'Language',
      es: 'Idioma',
      fr: 'Langue', 
      de: 'Sprache'
    },

    // Auth
    'auth.signin': {
      it: 'Accedi',
      en: 'Sign In',
      es: 'Iniciar Sesión',
      fr: 'Se connecter',
      de: 'Anmelden'
    },
    'auth.signup': {
      it: 'Registrati',
      en: 'Sign Up',
      es: 'Registrarse',
      fr: "S'inscrire",
      de: 'Registrieren'
    },
    'auth.getstarted': {
      it: 'Inizia Ora',
      en: 'Get Started',
      es: 'Comenzar',
      fr: 'Commencer',
      de: 'Loslegen'
    },

    // Homepage
    'hero.tagline': {
      it: 'Live Messaging & Professional Services',
      en: 'Live Messaging & Professional Services',
      es: 'Mensajería en Vivo y Servicios Profesionales',
      fr: 'Messagerie en Direct et Services Professionnels',
      de: 'Live-Messaging & Professionelle Dienstleistungen'
    },
    'hero.description': {
      it: 'Live Messaging incontra Trusted Providers. Chat istantanea con professionisti verificati. Trova, chatta, risolvi. Tutto in un\'app.',
      en: 'Live Messaging meets Trusted Providers. Instant chat with verified professionals. Find, chat, solve. All in one app.',
      es: 'Mensajería en Vivo se encuentra con Proveedores de Confianza. Chat instantáneo con profesionales verificados. Encuentra, chatea, resuelve. Todo en una app.',
      fr: 'La Messagerie en Direct rencontre les Fournisseurs de Confiance. Chat instantané avec des professionnels vérifiés. Trouvez, chattez, résolvez. Tout en une seule app.',
      de: 'Live-Messaging trifft auf vertrauenswürdige Anbieter. Sofortige Chat mit verifizierten Fachleuten. Finden, chatten, lösen. Alles in einer App.'
    },
    'hero.cta.primary': {
      it: 'Inizia Gratis',
      en: 'Start Free',
      es: 'Comenzar Gratis',
      fr: 'Commencer Gratuitement', 
      de: 'Kostenlos Starten'
    },
    'hero.cta.secondary': {
      it: 'Scopri di Più',
      en: 'Learn More',
      es: 'Saber Más',
      fr: 'En Savoir Plus',
      de: 'Mehr Erfahren'
    },

    // Stats
    'stats.providers': {
      it: 'Provider Verificati',
      en: 'Verified Providers',
      es: 'Proveedores Verificados',
      fr: 'Fournisseurs Vérifiés',
      de: 'Verifizierte Anbieter'
    },
    'stats.jobs': {
      it: 'Lavori Completati', 
      en: 'Completed Jobs',
      es: 'Trabajos Completados',
      fr: 'Travaux Terminés',
      de: 'Abgeschlossene Aufträge'
    },
    'stats.cities': {
      it: 'Città Europee',
      en: 'European Cities', 
      es: 'Ciudades Europeas',
      fr: 'Villes Européennes',
      de: 'Europäische Städte'
    },
    'stats.satisfaction': {
      it: 'Soddisfazione',
      en: 'Satisfaction',
      es: 'Satisfacción',
      fr: 'Satisfaction',
      de: 'Zufriedenheit'
    },

    // Features  
    'features.search.title': {
      it: 'Intelligent Match',
      en: 'Intelligent Match', 
      es: 'Coincidencia Inteligente',
      fr: 'Correspondance Intelligente',
      de: 'Intelligente Übereinstimmung'
    },
    'features.search.desc': {
      it: 'Messaging istantaneo per professionisti',
      en: 'Instant messaging for professionals',
      es: 'Mensajería instantánea para profesionales', 
      fr: 'Messagerie instantanée pour les professionnels',
      de: 'Sofortnachrichten für Fachleute'
    },

    // Mobile App
    'mobile.title': {
      it: 'Scarica l\'App Mobile',
      en: 'Download Mobile App',
      es: 'Descargar App Móvil',
      fr: 'Télécharger l\'App Mobile',
      de: 'Mobile App Herunterladen'
    },
    'mobile.install': {
      it: 'Installa App',
      en: 'Install App', 
      es: 'Instalar App',
      fr: 'Installer l\'App',
      de: 'App Installieren'
    },
    'mobile.web': {
      it: 'Versione Web Mobile',
      en: 'Mobile Web Version',
      es: 'Versión Web Móvil',
      fr: 'Version Web Mobile',
      de: 'Mobile Web-Version'
    },

    // About page
    'about.title': {
      it: 'Chi Siamo',
      en: 'About ERTUNO',
      es: 'Acerca de ERTUNO',
      fr: 'À propos d\'ERTUNO',
      de: 'Über ERTUNO'
    },
    'about.description': {
      it: 'ERTUNO è costruito per velocità, fiducia e semplicità. Colleghiamo cittadini con fornitori di servizi verificati in tutta Europa—istantaneamente.',
      en: 'ERTUNO is built for speed, trust, and simplicity. We connect citizens with verified service providers across Europe—instantly.',
      es: 'ERTUNO está construido para velocidad, confianza y simplicidad. Conectamos ciudadanos con proveedores de servicios verificados en toda Europa—instantáneamente.',
      fr: 'ERTUNO est conçu pour la rapidité, la confiance et la simplicité. Nous connectons les citoyens avec des fournisseurs de services vérifiés à travers l\'Europe—instantanément.',
      de: 'ERTUNO ist für Geschwindigkeit, Vertrauen und Einfachheit gebaut. Wir verbinden Bürger mit verifizierten Dienstleistern in ganz Europa—sofort.'
    }
  };

  return translations[key]?.[lang] || key;
};

// Language Provider Component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('it');

  // Load saved language or detect from browser
  useEffect(() => {
    const savedLang = localStorage.getItem('ertuno-language') as LanguageCode;
    if (savedLang && SUPPORTED_LANGUAGES[savedLang]) {
      setCurrentLanguage(savedLang);
    } else {
      // Detect from browser language
      const browserLang = navigator.language.split('-')[0] as LanguageCode;
      if (SUPPORTED_LANGUAGES[browserLang]) {
        setCurrentLanguage(browserLang);
      }
    }
  }, []);

  // Update document language and direction
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = SUPPORTED_LANGUAGES[currentLanguage].dir;
  }, [currentLanguage]);

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    localStorage.setItem('ertuno-language', lang);
    
    // Update URL for SEO (subdirectory structure)
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(it|en|es|fr|de)/, '');
    const newPath = lang === 'it' ? pathWithoutLang : `/${lang}${pathWithoutLang}`;
    
    window.history.replaceState(null, '', newPath || '/');
  };

  const t = (key: string) => getTranslation(key, currentLanguage);

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    languages: SUPPORTED_LANGUAGES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
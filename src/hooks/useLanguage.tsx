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
    'nav.research': {
      it: 'Università & Ricerca',
      en: 'Universities & Research',
      es: 'Universidades e Investigación',
      fr: 'Universités et Recherche',
      de: 'Universitäten & Forschung'
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

    // Settings
    'settings.title': {
      it: 'Impostazioni',
      en: 'Settings',
      es: 'Configuración',
      fr: 'Paramètres',
      de: 'Einstellungen'
    },
    'settings.preferences': {
      it: 'Preferenze Account',
      en: 'Account Preferences',
      es: 'Preferencias de Cuenta',
      fr: 'Préférences du Compte',
      de: 'Konto-Einstellungen'
    },
    'settings.role': {
      it: 'Gestione Ruolo',
      en: 'Role Management',
      es: 'Gestión de Roles',
      fr: 'Gestion des Rôles',
      de: 'Rollenverwaltung'
    },
    'settings.security': {
      it: 'Impostazioni Sicurezza',
      en: 'Security Settings',
      es: 'Configuración de Seguridad',
      fr: 'Paramètres de Sécurité',
      de: 'Sicherheitseinstellungen'
    },
    'settings.sessions': {
      it: 'Info Sessione',
      en: 'Session Info',
      es: 'Información de Sesión',
      fr: 'Informations de Session',
      de: 'Sitzungsinfo'
    },
    'settings.delete': {
      it: 'Elimina Account',
      en: 'Delete Account',
      es: 'Eliminar Cuenta',
      fr: 'Supprimer le Compte',
      de: 'Konto Löschen'
    },
    'settings.provider_dashboard': {
      it: 'Dashboard Provider',
      en: 'Provider Dashboard',
      es: 'Panel de Proveedor',
      fr: 'Tableau de Bord Fournisseur',
      de: 'Anbieter-Dashboard'
    },
    'settings.poster_dashboard': {
      it: 'Dashboard Richiedente',
      en: 'Poster Dashboard',
      es: 'Panel de Solicitante',
      fr: 'Tableau de Bord Demandeur',
      de: 'Anfragender-Dashboard'
    },
    'settings.provider_account': {
      it: 'Account Provider',
      en: 'Provider Account',
      es: 'Cuenta de Proveedor',
      fr: 'Compte Fournisseur',
      de: 'Anbieter-Konto'
    },
    'settings.seeker_account': {
      it: 'Cercatore Servizi',
      en: 'Service Seeker',
      es: 'Buscador de Servicios',
      fr: 'Demandeur de Services',
      de: 'Dienstleistungssucher'
    },

    // Footer sections
    'footer.product': {
      it: 'Prodotto',
      en: 'Product',
      es: 'Producto',
      fr: 'Produit',
      de: 'Produkt'
    },
    'footer.company': {
      it: 'Azienda',
      en: 'Company',
      es: 'Empresa',
      fr: 'Entreprise',
      de: 'Unternehmen'
    },
    'footer.legal': {
      it: 'Legale',
      en: 'Legal',
      es: 'Legal',
      fr: 'Légal',
      de: 'Rechtliches'
    },

    // Product section
    'footer.features': {
      it: 'Funzionalità',
      en: 'Features',
      es: 'Características',
      fr: 'Fonctionnalités',
      de: 'Funktionen'
    },
    'footer.features.tagline': {
      it: 'Live Messaging incontra Trusted Providers. Chat istantanea con professionisti verificati. Trova, chatta, risolvi. Tutto in un\'app.',
      en: 'Live Messaging meets Trusted Providers. Instant chat with verified professionals. Find, chat, solve. All in one app.',
      es: 'Live Messaging se encuentra con Trusted Providers. Chat instantáneo con profesionales verificados. Encuentra, chatea, resuelve. Todo en una app.',
      fr: 'Live Messaging rencontre Trusted Providers. Chat instantané avec des professionnels vérifiés. Trouvez, chattez, résolvez. Tout en une app.',
      de: 'Live Messaging trifft auf Trusted Providers. Sofort-Chat mit verifizierten Fachleuten. Finden, chatten, lösen. Alles in einer App.'
    },
    'footer.features.description': {
      it: 'Messaggistica live, marketplace dei servizi, verifica professionale — costruito per la collaborazione in tempo reale e la fiducia.',
      en: 'Live messaging, service marketplace, professional verification — built for real-time collaboration and trust.',
      es: 'Mensajería en vivo, marketplace de servicios, verificación profesional — construido para la colaboración en tiempo real y la confianza.',
      fr: 'Messagerie en direct, marketplace de services, vérification professionnelle — conçu pour la collaboration en temps réel et la confiance.',
      de: 'Live-Messaging, Service-Marktplatz, professionelle Verifizierung — entwickelt für Echtzeit-Zusammenarbeit und Vertrauen.'
    },
    'footer.pricing': {
      it: 'Prezzi',
      en: 'Pricing',
      es: 'Precios',
      fr: 'Tarifs',
      de: 'Preise'
    },
    'footer.pricing.description': {
      it: 'Gratuito per i richiedenti. Commissioni per i provider. Trasparente, scalabile, amico del fondatore.',
      en: 'Free for seekers. Commission-based for providers. Transparent, scalable, founder-friendly.',
      es: 'Gratis para los solicitantes. Basado en comisiones para los proveedores. Transparente, escalable, amigable para fundadores.',
      fr: 'Gratuit pour les demandeurs. Basé sur commission pour les fournisseurs. Transparent, évolutif, convivial pour les fondateurs.',
      de: 'Kostenlos für Suchende. Provisionsbasiert für Anbieter. Transparent, skalierbar, gründerfreundlich.'
    },
    'footer.api': {
      it: 'API',
      en: 'API',
      es: 'API',
      fr: 'API',
      de: 'API'
    },
    'footer.api.description': {
      it: 'API RESTful per integrazioni di terze parti. Endpoint sicuri per pubblicazione lavori, ruoli utente e messaggistica.',
      en: 'RESTful API for third-party integrations. Secure endpoints for job posting, user roles, and messaging.',
      es: 'API RESTful para integraciones de terceros. Endpoints seguros para publicación de trabajos, roles de usuario y mensajería.',
      fr: 'API RESTful pour les intégrations tierces. Points de terminaison sécurisés pour la publication d\'emplois, les rôles d\'utilisateur et la messagerie.',
      de: 'RESTful API für Drittanbieter-Integrationen. Sichere Endpunkte für Stellenausschreibungen, Benutzerrollen und Messaging.'
    },
    'footer.documentation': {
      it: 'Documentazione',
      en: 'Documentation',
      es: 'Documentación',
      fr: 'Documentation',
      de: 'Dokumentation'
    },
    'footer.documentation.description': {
      it: 'Guide tecniche, tutorial di integrazione e diagrammi di flusso backend per sviluppatori e architetti.',
      en: 'Technical guides, integration tutorials, and backend flowcharts for developers and architects.',
      es: 'Guías técnicas, tutoriales de integración y diagramas de flujo de backend para desarrolladores y arquitectos.',
      fr: 'Guides techniques, tutoriels d\'intégration et diagrammes de flux backend pour développeurs et architectes.',
      de: 'Technische Anleitungen, Integrations-Tutorials und Backend-Flussdiagramme für Entwickler und Architekten.'
    },

    // Company section
    'footer.about': {
      it: 'Chi Siamo',
      en: 'About',
      es: 'Acerca de',
      fr: 'À propos',
      de: 'Über uns'
    },
    'footer.about.description': {
      it: 'Il sito sacro dove connessioni, trader e deal prosperano. ERTUNO è costruito su grinta siciliana e tecnologia globale.',
      en: 'The holy site where connections, traders, and deals flourish. ERTUNO is built on Sicilian grit and global tech.',
      es: 'El sitio sagrado donde las conexiones, comerciantes y acuerdos florecen. ERTUNO está construido sobre determinación siciliana y tecnología global.',
      fr: 'Le site sacré où les connexions, les traders et les accords prospèrent. ERTUNO est construit sur la détermination sicilienne et la technologie mondiale.',
      de: 'Die heilige Stätte, wo Verbindungen, Händler und Deals gedeihen. ERTUNO basiert auf sizilianischer Entschlossenheit und globaler Technologie.'
    },
    'footer.blog': {
      it: 'Blog',
      en: 'Blog',
      es: 'Blog',
      fr: 'Blog',
      de: 'Blog'
    },
    'footer.blog.description': {
      it: 'Storie di successo, approfondimenti del settore e aggiornamenti della piattaforma dal team ERTUNO.',
      en: 'Success stories, industry insights, and platform updates from the ERTUNO team.',
      es: 'Historias de éxito, perspectivas de la industria y actualizaciones de la plataforma del equipo ERTUNO.',
      fr: 'Histoires de réussite, perspectives de l\'industrie et mises à jour de la plateforme de l\'équipe ERTUNO.',
      de: 'Erfolgsgeschichten, Brancheneinblicke und Plattform-Updates vom ERTUNO-Team.'
    },
    'footer.careers': {
      it: 'Carriere',
      en: 'Careers',
      es: 'Carreras',
      fr: 'Carrières',
      de: 'Karriere'
    },
    'footer.careers.description': {
      it: 'Unisciti alla missione sacra. Opportunità remote e europee disponibili per costruttori, designer e strateghi.',
      en: 'Join the sacred mission. Remote and European opportunities available for builders, designers, and strategists.',
      es: 'Únete a la misión sagrada. Oportunidades remotas y europeas disponibles para constructores, diseñadores y estrategas.',
      fr: 'Rejoignez la mission sacrée. Opportunités à distance et européennes disponibles pour les constructeurs, designers et stratèges.',
      de: 'Schließe dich der heiligen Mission an. Remote- und europäische Möglichkeiten für Entwickler, Designer und Strategen verfügbar.'
    },
    'footer.contact': {
      it: 'Contatti',
      en: 'Contact',
      es: 'Contacto',
      fr: 'Contact',
      de: 'Kontakt'
    },
    'footer.contact.description': {
      it: 'Mettiti in contatto: hello@ertuno.com — rispondiamo velocemente e costruiamo insieme.',
      en: 'Get in touch: hello@ertuno.com — we respond fast and build together.',
      es: 'Ponte en contacto: hello@ertuno.com — respondemos rápido y construimos juntos.',
      fr: 'Entrez en contact: hello@ertuno.com — nous répondons rapidement et construisons ensemble.',
      de: 'Kontaktiere uns: hello@ertuno.com — wir antworten schnell und bauen gemeinsam auf.'
    },

    // Legal section
    'footer.privacy': {
      it: 'Privacy Policy',
      en: 'Privacy Policy',
      es: 'Política de Privacidad',
      fr: 'Politique de Confidentialité',
      de: 'Datenschutzrichtlinie'
    },
    'footer.privacy.description': {
      it: 'Protezione dei dati conforme al GDPR e privacy degli utenti. Non vendiamo mai i tuoi dati.',
      en: 'GDPR-compliant data protection and user privacy. We never sell your data.',
      es: 'Protección de datos conforme al GDPR y privacidad del usuario. Nunca vendemos tus datos.',
      fr: 'Protection des données conforme au GDPR et confidentialité des utilisateurs. Nous ne vendons jamais vos données.',
      de: 'DSGVO-konforme Datenschutz und Benutzerprivatsphäre. Wir verkaufen niemals Ihre Daten.'
    },
    'footer.terms': {
      it: 'Termini di Servizio',
      en: 'Terms of Service',
      es: 'Términos de Servicio',
      fr: 'Conditions de Service',
      de: 'Nutzungsbedingungen'
    },
    'footer.terms.description': {
      it: 'Termini di utilizzo della piattaforma e accordi di servizio.',
      en: 'Platform usage terms and service agreements.',
      es: 'Términos de uso de la plataforma y acuerdos de servicio.',
      fr: 'Conditions d\'utilisation de la plateforme et accords de service.',
      de: 'Plattform-Nutzungsbedingungen und Service-Vereinbarungen.'
    },
    'footer.cookies': {
      it: 'Cookie Policy',
      en: 'Cookie Policy',
      es: 'Política de Cookies',
      fr: 'Politique des Cookies',
      de: 'Cookie-Richtlinie'
    },
    'footer.cookies.description': {
      it: 'Gestisci le preferenze. Usiamo i cookie per migliorare le prestazioni, non per tracciare.',
      en: 'Manage preferences. We use cookies to improve performance, not to track.',
      es: 'Gestionar preferencias. Usamos cookies para mejorar el rendimiento, no para rastrear.',
      fr: 'Gérer les préférences. Nous utilisons des cookies pour améliorer les performances, pas pour suivre.',
      de: 'Einstellungen verwalten. Wir verwenden Cookies zur Leistungsverbesserung, nicht zur Verfolgung.'
    },
    'footer.gdpr': {
      it: 'GDPR',
      en: 'GDPR',
      es: 'GDPR',
      fr: 'RGPD',
      de: 'DSGVO'
    },
    'footer.gdpr.description': {
      it: 'Piena conformità alle leggi europee sulla protezione dei dati. I tuoi diritti sono rispettati.',
      en: 'Full compliance with European data protection laws. Your rights are respected.',
      es: 'Cumplimiento completo con las leyes europeas de protección de datos. Tus derechos son respetados.',
      fr: 'Conformité complète aux lois européennes de protection des données. Vos droits sont respectés.',
      de: 'Vollständige Einhaltung der europäischen Datenschutzgesetze. Ihre Rechte werden respektiert.'
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
    },

    // Research & Academic Section
    'research.title': {
      it: 'ERTUNO x Ricerca',
      en: 'ERTUNO x Research',
      es: 'ERTUNO x Investigación',
      fr: 'ERTUNO x Recherche',
      de: 'ERTUNO x Forschung'
    },
    'research.subtitle': {
      it: 'Connettere il mondo accademico con l\'innovazione professionale',
      en: 'Connecting academia with professional innovation',
      es: 'Conectando la academia con la innovación profesional',
      fr: 'Connecter le monde académique avec l\'innovation professionnelle',
      de: 'Die Wissenschaft mit beruflicher Innovation verbinden'
    },
    'research.mission.title': {
      it: 'La Nostra Missione Accademica',
      en: 'Our Academic Mission',
      es: 'Nuestra Misión Académica',
      fr: 'Notre Mission Académique',
      de: 'Unsere Akademische Mission'
    },
    'research.mission.description': {
      it: 'Creiamo un ponte tra università, laboratori di ricerca e professionisti verificati, facilitando collaborazioni che trasformano la conoscenza teorica in soluzioni pratiche e innovative.',
      en: 'We create a bridge between universities, research labs and verified professionals, facilitating collaborations that transform theoretical knowledge into practical and innovative solutions.',
      es: 'Creamos un puente entre universidades, laboratorios de investigación y profesionales verificados, facilitando colaboraciones que transforman el conocimiento teórico en soluciones prácticas e innovadoras.',
      fr: 'Nous créons un pont entre les universités, les laboratoires de recherche et les professionnels vérifiés, facilitant les collaborations qui transforment les connaissances théoriques en solutions pratiques et innovantes.',
      de: 'Wir schaffen eine Brücke zwischen Universitäten, Forschungslabors und verifizierten Fachkräften und erleichtern Kooperationen, die theoretisches Wissen in praktische und innovative Lösungen verwandeln.'
    },
    'research.benefits.title': {
      it: 'Vantaggi per le Istituzioni',
      en: 'Benefits for Institutions',
      es: 'Beneficios para las Instituciones',
      fr: 'Avantages pour les Institutions',
      de: 'Vorteile für Institutionen'
    },
    'research.cta.title': {
      it: 'Vuoi diventare partner accademico?',
      en: 'Want to become an academic partner?',
      es: '¿Quieres convertirte en socio académico?',
      fr: 'Vous voulez devenir partenaire académique?',
      de: 'Möchten Sie akademischer Partner werden?'
    },
    'research.cta.description': {
      it: 'Inviaci una proposta o prenota una demo per scoprire come ERTUNO può potenziare la ricerca e l\'innovazione della tua istituzione.',
      en: 'Send us a proposal or book a demo to discover how ERTUNO can enhance your institution\'s research and innovation.',
      es: 'Envíanos una propuesta o reserva una demo para descubrir cómo ERTUNO puede potenciar la investigación e innovación de tu institución.',
      fr: 'Envoyez-nous une proposition ou réservez une démo pour découvrir comment ERTUNO peut améliorer la recherche et l\'innovation de votre institution.',
      de: 'Senden Sie uns einen Vorschlag oder buchen Sie eine Demo, um zu entdecken, wie ERTUNO die Forschung und Innovation Ihrer Institution verbessern kann.'
    },
    'research.cta.proposal': {
      it: 'Invia Proposta',
      en: 'Send Proposal',
      es: 'Enviar Propuesta',
      fr: 'Envoyer une Proposition',
      de: 'Vorschlag Senden'
    },
    'research.cta.demo': {
      it: 'Prenota Demo',
      en: 'Book Demo',
      es: 'Reservar Demo',
      fr: 'Réserver une Démo',
      de: 'Demo Buchen'
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
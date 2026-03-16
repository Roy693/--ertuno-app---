// Enhanced i18n system for ERTUNO platform
// Supports dynamic loading, nested keys, fallback to default language, and modular translations

export type LanguageCode = 'it' | 'en' | 'es';
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
  },
  es: {
    code: 'es', 
    name: 'Español',
    flag: '🇪🇸',
    dir: 'ltr',
    nativeName: 'Español'
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
 * Get inline translations - Complete translation system
 */
function getInlineTranslations(languageCode: LanguageCode): TranslationObject {
  const translations = {
    it: {
      nav: {
        home: 'Home',
        about: 'Chi Siamo',
        services: 'Servizi',
        research: 'Università & Ricerca',
        contact: 'Contatti',
        language: 'Lingua',
        dashboard: 'Dashboard',
        browse: 'Esplora'
      },
      auth: {
        signin: 'Accedi',
        signup: 'Registrati',
        getstarted: 'Inizia Ora',
        getStarted: 'Inizia Ora',
        login: 'Accedi',
        createAccount: 'Crea Account',
        welcomeBack: 'Bentornato',
        email: 'Email',
        password: 'Password',
        fullName: 'Nome Completo',
        confirmPassword: 'Conferma Password',
        forgotPassword: 'Password dimenticata?',
        sendResetEmail: 'Invia Email di Reset',
        backToLogin: 'Torna al Login',
        resetEmailSent: 'Email di reset inviata!',
        checkEmail: 'Controlla la tua email per le istruzioni.',
        continueWithGoogle: 'Continua con Google',
        continueWithFacebook: 'Continua con Facebook',
        orContinueWith: 'Oppure continua con email',
        dontHaveAccount: 'Non hai un account?',
        alreadyHaveAccount: 'Hai già un account?',
        iWantTo: 'Voglio:',
        serviceRequester: 'Richiedente Servizi',
        serviceProvider: 'Fornitore di Servizi',
        findHireProfessionals: 'Trovare e assumere professionisti',
        offerServices: 'Offrire servizi professionali',
        passwordMismatch: 'Le password non corrispondono',
        enterEmail: 'Inserisci la tua email',
        enterPassword: 'Inserisci la password',
        enterFullName: 'Inserisci il tuo nome completo'
      },
      common: {
        loading: 'Caricamento...',
        save: 'Salva',
        cancel: 'Annulla',
        edit: 'Modifica',
        delete: 'Elimina',
        add: 'Aggiungi',
        create: 'Crea',
        update: 'Aggiorna',
        search: 'Cerca',
        filter: 'Filtra',
        view: 'Visualizza',
        close: 'Chiudi',
        back: 'Indietro',
        next: 'Avanti',
        previous: 'Precedente',
        lightMode: 'Modalità Chiara',
        darkMode: 'Modalità Scura',
        language: 'Lingua',
        settings: 'Impostazioni',
        profile: 'Profilo',
        logout: 'Esci',
        yes: 'Sì',
        no: 'No',
        ok: 'OK',
        error: 'Errore',
        success: 'Successo',
        warning: 'Attenzione',
        info: 'Informazione',
        active: 'Attivo',
        inactive: 'Inattivo',
        completed: 'Completato',
        inProgress: 'In Corso',
        changes: 'Modifiche'
      },
      footer: {
        product: 'Prodotto',
        company: 'Azienda',
        legal: 'Legale',
        settings: 'Impostazioni',
        features: 'Funzionalità',
        featuresDesc: 'Messaggistica live, marketplace dei servizi, verifica professionale — costruito per la collaborazione in tempo reale e la fiducia.',
        pricing: 'Prezzi',
        pricingDesc: 'Gratuito per i richiedenti. Commissioni per i provider. Trasparente, scalabile, amico del fondatore.',
        api: 'API',
        apiDesc: 'API RESTful per integrazioni di terze parti. Endpoint sicuri per pubblicazione lavori, ruoli utente e messaggistica.',
        documentation: 'Documentazione',
        docsDesc: 'Guide tecniche, tutorial di integrazione e diagrammi di flusso backend per sviluppatori e architetti.',
        aboutUs: 'Chi Siamo',
        aboutDesc: 'Il sito sacro dove connessioni, trader e deal prosperano. ERTUNO è costruito su grinta siciliana e tecnologia globale.',
        blog: 'Blog',
        blogDesc: 'Storie di successo, approfondimenti del settore e aggiornamenti della piattaforma dal team ERTUNO.',
        careers: 'Carriere',
        careersDesc: 'Unisciti alla missione sacra. Opportunità remote e europee disponibili per costruttori, designer e strateghi.',
        contact: 'Contatti',
        contactDesc: 'Mettiti in contatto: hello@ertuno.com — rispondiamo velocemente e costruiamo insieme.',
        privacyPolicy: 'Privacy Policy',
        privacyDesc: 'Protezione dei dati conforme al GDPR e privacy degli utenti. Non vendiamo mai i tuoi dati.',
        termsOfService: 'Termini di Servizio',
        termsDesc: 'Termini di utilizzo della piattaforma e accordi di servizio.',
        cookiePolicy: 'Cookie Policy',
        cookieDesc: 'Gestisci le preferenze. Usiamo i cookie per migliorare le prestazioni, non per tracciare.',
        gdpr: 'GDPR',
        gdprDesc: 'Piena conformità alle leggi europee sulla protezione dei dati. I tuoi diritti sono rispettati.',
        builtWith: 'Costruito con',
        inItaly: 'in Italia',
        allRightsReserved: 'Tutti i diritti riservati.',
        contactTitle: 'Mettiti in Contatto',
        contactSubtext: 'Rispondiamo velocemente e costruiamo insieme'
      },
      settings: {
        preferences: 'Preferenze',
        notifications: 'Notifiche',
        privacy: 'Privacy',
        security: 'Sicurezza',
        billing: 'Fatturazione',
        deleteAccount: 'Elimina Account',
        account: 'Account',
        professional: 'Professionale'
      },
      aboutPage: {
        title: 'Chi Siamo',
        subtitle: 'ERTUNO è costruito per velocità, fiducia e semplicità. Colleghiamo cittadini con fornitori di servizi verificati in tutta Europa — istantaneamente. Che tu abbia bisogno di un idraulico a Palermo o un designer a Berlino, ERTUNO trova la corrispondenza giusta in secondi.',
        description: 'La nostra piattaforma è sicura, multilingue e ottimizzata per mobile.',
        tagline: 'Costruita in Sicilia, progettata per il mondo.',
        valuesDesc: 'Tutto ciò che costruiamo è guidato da quattro principi fondamentali che mettono al primo posto gli utenti.',
        stats: {
          activeUsers: 'Utenti Attivi',
          citiesCovered: 'Città Coperte',
          completedJobs: 'Lavori Completati',
          userSatisfaction: 'Soddisfazione Utenti'
        },
        values: {
          title: 'I Nostri Valori',
          speed: {
            title: 'Velocità',
            description: 'Trova il professionista giusto in secondi, non giorni. La nostra piattaforma è costruita per connessioni istantanee.'
          },
          trust: {
            title: 'Fiducia',
            description: 'Ogni fornitore di servizi è verificato, valutato e controllato per la tua tranquillità.'
          },
          simplicity: {
            title: 'Semplicità',
            description: 'L\'interfaccia di chat intuitiva rende la comunicazione senza sforzo. Nessun modulo complesso o processo confuso.'
          },
          multilingual: {
            title: 'Multilingue',
            description: 'Supportiamo più lingue in tutta Europa. Abbattiamo le barriere linguistiche per un servizio migliore.'
          }
        }
      },
      servicesPage: {
        viewServices: 'Visualizza Servizi',
        hideServices: 'Nascondi Servizi',
        loadingServices: 'Caricamento servizi...',
        inZone: 'in zona'
      },
      researchPage: {
        title: 'Università & Ricerca',
        subtitle: 'La tua università ha bisogno di professionisti?',
        mission: {
          title: 'La Nostra Missione',
          description: 'Colmare il divario tra ricerca accademica e applicazioni nel mondo reale attraverso collaborazioni verificate.'
        },
        benefits: {
          title: 'Vantaggi per le Università',
          profiles: 'Profili Accademici Verificati',
          collaborations: 'Collaborazioni Inter-disciplinari',
          matching: 'Matching Intelligente',
          opportunities: 'Opportunità Studenti',
          marketplace: 'Marketplace Ricerca',
          recognition: 'Riconoscimenti Accademici'
        },
        partners: 'Partner Accademici',
        cta: {
          title: 'Inizia la Collaborazione',
          description: 'Unisciti a centinaia di istituzioni che si fidano di ERTUNO per le partnership accademiche.',
          proposal: 'Invia Proposta',
          demo: 'Richiedi Demo'
        }
      },
      termsPage: {
        title: 'Termini di Servizio',
        effectiveDate: 'Data di Entrata in Vigore: 24 ottobre 2025',
        tableOfContents: 'Indice',
        sections: {
          overview: 'Panoramica',
          acceptance: 'Accettazione',
          description: 'Descrizione Servizio',
          eligibility: 'Idoneità',
          accounts: 'Account',
          conduct: 'Condotta',
          content: 'Contenuti',
          services: 'Servizi',
          fees: 'Commissioni',
          privacy: 'Privacy',
          termination: 'Risoluzione',
          disclaimers: 'Esclusioni di Responsabilità',
          limitation: 'Limitazione di Responsabilità',
          indemnification: 'Indennizzo',
          governing: 'Legge Applicabile',
          changes: 'Modifiche',
          contact: 'Contatti'
        }
      },
      privacyPage: {
        title: 'Informativa sulla Privacy',
        effectiveDate: 'Data di Entrata in Vigore: 24 ottobre 2025',
        tableOfContents: 'Indice'
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
      services: {
        title: 'Cosa puoi trovare su ERTUNO?',
        subtitle: 'Dai lavori domestici ai servizi creativi, ti mettiamo in contatto con professionisti verificati pronti ad aiutarti.',
        searchPlaceholder: 'Cerca servizi, competenze o fornitori...',
        allZones: 'Tutte le Zone',
        verifiedProfessionals: 'professionisti verificati',
        activeServices: 'servizi attivi',
        customRequest: 'Non trovi quello che cerchi?',
        customRequestDesc: 'Pubblica la tua richiesta personalizzata e troveremo il professionista giusto per te.',
        postCustomRequest: 'Pubblica Richiesta Personalizzata',
        whyChoose: 'Perché scegliere ERTUNO?',
        whyChooseDesc: 'Rendiamo la ricerca del professionista giusto semplice, sicura e senza stress.',
        features: {
          verified: {
            title: 'Professionisti Verificati',
            description: 'Tutti i fornitori sono controllati e verificati'
          },
          rated: {
            title: 'Valutati e Recensiti',
            description: 'Vedi valutazioni reali dai clienti precedenti'
          },
          chat: {
            title: 'Chat Istantanea',
            description: 'Comunica direttamente con i fornitori in tempo reale'
          },
          response: {
            title: 'Risposta Rapida',
            description: 'Ricevi preventivi e risposte in pochi minuti'
          }
        }
      },
      dashboard: {
        welcome: 'Bentornato',
        serviceProvider: 'Dashboard Fornitore Servizi',
        professional: 'Professionista',
        verified: '✓ Verificato',
        pendingVerification: '⏳ Verifica Pendente',
        pendingPayments: 'Pagamenti Pendenti',
        serviceRequester: 'Richiedente Servizi',
        overview: 'Panoramica',
        profile: 'Profilo Professionale',
        services: 'I Miei Servizi',
        workspace: 'Aree di Lavoro',
        accounting: 'Contabilità',
        totalEarnings: 'Guadagni Totali',
        thisMonth: 'Questo Mese',
        pendingPayment: 'Pagamento in Sospeso',
        completedJobs: 'Lavori Completati',
        quickActions: 'Azioni Rapide',
        updateProfile: 'Aggiorna Profilo',
        addService: 'Aggiungi Servizio',
        manageWorkAreas: 'Gestisci Aree di Lavoro',
        businessName: 'Nome dell\'Attività',
        professionalDescription: 'Descrizione Professionale',
        yearsExperience: 'Anni di Esperienza',
        skillsSpecialties: 'Competenze e Specialità',
        portfolioPastWork: 'Portfolio e Lavori Passati',
        workAreasZones: 'Aree e Zone di Lavoro',
        myServices: 'I Miei Servizi',
        addNewService: 'Aggiungi Nuovo Servizio',
        verified: 'Verificato',
        pendingVerification: 'Verifica in Sospeso',
        uploadPhoto: 'Carica Foto',
        saveChanges: 'Salva Modifiche',
        editProfile: 'Modifica Profilo',
        addPhoto: 'Aggiungi Foto',
        describeServices: 'Descrivi i tuoi servizi ed esperienza...',
        addSkillPlaceholder: 'Aggiungi una competenza e premi Invio',
        yourBusiness: 'Il tuo business o nome professionale',
        googleMapsIntegration: 'Integrazione Google Maps',
        clickToSelect: 'Clicca per selezionare le tue aree di lavoro',
        manageWorkAreasTitle: 'Gestisci Aree di Lavoro',
        howToUse: 'Come utilizzare:',
        howToUseSteps: {
          step1: 'Clicca "Aggiungi Area di Lavoro" per iniziare ad aggiungere una nuova area di servizio',
          step2: 'Inserisci il nome dell\'area e il raggio, poi clicca sulla mappa',
          step3: 'Clicca sui marker esistenti per modificare o eliminare le aree',
          step4: 'Le aree verdi sono attive, le aree grigie sono inattive'
        },
        addWorkArea: 'Aggiungi Area di Lavoro',
        areaName: 'Nome area (es. Milano Centro)',
        radiusKm: 'Raggio (km)',
        clickMap: 'Clicca Mappa',
        active: 'Attivo',
        inactive: 'Inattivo',
        loadingYourExperience: 'Caricamento della tua esperienza...',
        recentJobs: 'Lavori Recenti',
        job: 'Lavoro',
        client: 'Cliente',
        category: 'Categoria',
        amount: 'Importo',
        status: 'Stato',
        date: 'Data',
        completed: 'Completato',
        pendingPaymentStatus: 'Pagamento in Sospeso',
        inProgress: 'In Corso',
        totalEarned: 'Totale Guadagnato',
        activate: 'Attiva',
        deactivate: 'Disattiva',
        hourly: 'orario',
        fixed: 'fisso',
        customPricing: 'Prezzo personalizzato'
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
    },
    en: {
      nav: {
        home: 'Home',
        about: 'About',
        services: 'Services',
        research: 'Universities & Research',
        contact: 'Contact',
        language: 'Language',
        dashboard: 'Dashboard',
        browse: 'Browse'
      },
      auth: {
        signin: 'Sign In',
        signup: 'Sign Up',
        getstarted: 'Get Started',
        getStarted: 'Get Started',
        login: 'Sign In',
        createAccount: 'Create Account',
        welcomeBack: 'Welcome Back',
        email: 'Email',
        password: 'Password',
        fullName: 'Full Name',
        confirmPassword: 'Confirm Password',
        forgotPassword: 'Forgot your password?',
        sendResetEmail: 'Send Reset Email',
        backToLogin: 'Back to Login',
        resetEmailSent: 'Reset email sent!',
        checkEmail: 'Check your email for instructions.',
        continueWithGoogle: 'Continue with Google',
        continueWithFacebook: 'Continue with Facebook',
        orContinueWith: 'Or continue with email',
        dontHaveAccount: 'Don\'t have an account?',
        alreadyHaveAccount: 'Already have an account?',
        iWantTo: 'I want to:',
        serviceRequester: 'Service Requester',
        serviceProvider: 'Service Provider',
        findHireProfessionals: 'Find and hire professionals',
        offerServices: 'Offer professional services',
        passwordMismatch: 'Passwords do not match',
        enterEmail: 'Enter your email',
        enterPassword: 'Enter your password',
        enterFullName: 'Enter your full name'
      },
      common: {
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        add: 'Add',
        create: 'Create',
        update: 'Update',
        search: 'Search',
        filter: 'Filter',
        view: 'View',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
        language: 'Language',
        settings: 'Settings',
        profile: 'Profile',
        logout: 'Logout',
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Information',
        active: 'Active',
        inactive: 'Inactive',
        completed: 'Completed',
        inProgress: 'In Progress',
        changes: 'Changes'
      },
      pricing: {
        hourly: '/hour',
        fixed: 'fixed',
        customPricing: 'Custom pricing'
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
      services: {
        title: 'What can you find on ERTUNO?',
        subtitle: 'From home repairs to creative services, we connect you with verified professionals ready to help.',
        searchPlaceholder: 'Search services, skills, or providers...',
        allZones: 'All Zones',
        verifiedProfessionals: 'verified professionals',
        activeServices: 'active services',
        customRequest: 'Don\'t see what you need?',
        customRequestDesc: 'Post your custom request and we\'ll find the right professional for you.',
        postCustomRequest: 'Post Custom Request',
        whyChoose: 'Why Choose ERTUNO?',
        whyChooseDesc: 'We make finding the right professional simple, secure, and stress-free.',
        features: {
          verified: {
            title: 'Verified Professionals',
            description: 'All providers are background-checked and verified'
          },
          rated: {
            title: 'Rated & Reviewed',
            description: 'See real ratings from previous customers'
          },
          chat: {
            title: 'Instant Chat',
            description: 'Communicate directly with providers in real-time'
          },
          response: {
            title: 'Quick Response',
            description: 'Get quotes and responses within minutes'
          }
        }
      },
      dashboard: {
        welcome: 'Welcome back',
        serviceProvider: 'Service Provider Dashboard',
        professional: 'Professional',
        verified: '✓ Verified',
        pendingVerification: '⏳ Pending Verification',
        pendingPayments: 'Pending Payments',
        serviceRequester: 'Service Requester',
        overview: 'Overview',
        profile: 'Professional Profile',
        services: 'My Services',
        workspace: 'Work Areas',
        accounting: 'Accounting',
        totalEarnings: 'Total Earnings',
        thisMonth: 'This Month',
        pendingPayment: 'Pending Payment',
        completedJobs: 'Completed Jobs',
        quickActions: 'Quick Actions',
        updateProfile: 'Update Profile',
        addService: 'Add Service',
        manageWorkAreas: 'Manage Work Areas',
        businessName: 'Business Name',
        professionalDescription: 'Professional Description',
        yearsExperience: 'Years of Experience',
        skillsSpecialties: 'Skills & Specialties',
        portfolioPastWork: 'Portfolio & Past Work',
        workAreasZones: 'Work Areas & Zones',
        myServices: 'My Services',
        addNewService: 'Add New Service'
      },
      aboutPage: {
        title: 'About ERTUNO',
        subtitle: 'ERTUNO is built for speed, trust, and simplicity. We connect citizens with verified service providers across Europe—instantly. Whether you need a plumber in Palermo or a designer in Berlin, ERTUNO finds the right match in seconds.',
        description: 'Our platform is secure, multilingual, and optimized for mobile.',
        tagline: 'Built in Sicily, designed for the world.',
        valuesDesc: 'Everything we build is guided by four core principles that put users first.',
        stats: {
          activeUsers: 'Active Users',
          citiesCovered: 'Cities Covered',
          completedJobs: 'Completed Jobs',
          userSatisfaction: 'User Satisfaction'
        },
        values: {
          title: 'Our Values',
          speed: {
            title: 'Speed',
            description: 'Find the right professional in seconds, not days. Our platform is built for instant connections.'
          },
          trust: {
            title: 'Trust',
            description: 'Every service provider is verified, rated, and background-checked for your peace of mind.'
          },
          simplicity: {
            title: 'Simplicity',
            description: 'Intuitive chat interface makes communication effortless. No complex forms or confusing processes.'
          },
          multilingual: {
            title: 'Multilingual',
            description: 'Supporting multiple languages across Europe. Breaking down language barriers for better service.'
          }
        }
      },
      footer: {
        product: 'Product',
        company: 'Company',
        legal: 'Legal',
        settings: 'Settings',
        features: 'Features',
        featuresDesc: 'Live messaging, service marketplace, professional verification — built for real-time collaboration and trust.',
        pricing: 'Pricing',
        pricingDesc: 'Free for requesters. Commissions for providers. Transparent, scalable, founder-friendly.',
        api: 'API',
        apiDesc: 'RESTful API for third-party integrations. Secure endpoints for job posting, user roles, and messaging.',
        documentation: 'Documentation',
        docsDesc: 'Technical guides, integration tutorials, and backend flow diagrams for developers and architects.',
        aboutUs: 'About Us',
        aboutDesc: 'The sacred site where connections, traders, and deals prosper. ERTUNO is built on Sicilian grit and global technology.',
        blog: 'Blog',
        blogDesc: 'Success stories, industry insights, and platform updates from the ERTUNO team.',
        careers: 'Careers',
        careersDesc: 'Join the sacred mission. Remote and European opportunities available for builders, designers, and strategists.',
        contact: 'Contact',
        contactDesc: 'Get in touch: hello@ertuno.com — we respond quickly and build together.',
        privacyPolicy: 'Privacy Policy',
        privacyDesc: 'GDPR-compliant data protection and user privacy. We never sell your data.',
        termsOfService: 'Terms of Service',
        termsDesc: 'Platform usage terms and service agreements.',
        cookiePolicy: 'Cookie Policy',
        cookieDesc: 'Manage preferences. We use cookies to improve performance, not to track.',
        gdpr: 'GDPR',
        gdprDesc: 'Full compliance with European data protection laws. Your rights are respected.',
        builtWith: 'Built with',
        inItaly: 'in Italy',
        allRightsReserved: 'All rights reserved.',
        contactTitle: 'Get in Touch',
        contactSubtext: 'We respond quickly and build together'
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
    },
    es: {
      nav: {
        home: 'Inicio',
        about: 'Acerca de',
        services: 'Servicios',
        research: 'Universidades e Investigación',
        contact: 'Contacto',
        language: 'Idioma',
        dashboard: 'Panel',
        browse: 'Explorar'
      },
      auth: {
        signin: 'Iniciar Sesión',
        signup: 'Registrarse',
        getstarted: 'Comenzar',
        getStarted: 'Comenzar',
        login: 'Iniciar Sesión',
        createAccount: 'Crear Cuenta',
        welcomeBack: 'Bienvenido de Vuelta',
        email: 'Correo Electrónico',
        password: 'Contraseña',
        fullName: 'Nombre Completo',
        confirmPassword: 'Confirmar Contraseña',
        forgotPassword: '¿Olvidaste tu contraseña?',
        sendResetEmail: 'Enviar Email de Reseteo',
        backToLogin: 'Volver al Inicio',
        resetEmailSent: '¡Email de reseteo enviado!',
        checkEmail: 'Revisa tu correo para las instrucciones.',
        continueWithGoogle: 'Continuar con Google',
        continueWithFacebook: 'Continuar con Facebook',
        orContinueWith: 'O continuar con email',
        dontHaveAccount: '¿No tienes una cuenta?',
        alreadyHaveAccount: '¿Ya tienes una cuenta?',
        iWantTo: 'Quiero:',
        serviceRequester: 'Solicitante de Servicios',
        serviceProvider: 'Proveedor de Servicios',
        findHireProfessionals: 'Encontrar y contratar profesionales',
        offerServices: 'Ofrecer servicios profesionales',
        passwordMismatch: 'Las contraseñas no coinciden',
        enterEmail: 'Ingresa tu correo electrónico',
        enterPassword: 'Ingresa tu contraseña',
        enterFullName: 'Ingresa tu nombre completo'
      },
      common: {
        loading: 'Cargando...',
        save: 'Guardar',
        cancel: 'Cancelar',
        edit: 'Editar',
        delete: 'Eliminar',
        add: 'Agregar',
        create: 'Crear',
        update: 'Actualizar',
        search: 'Buscar',
        filter: 'Filtrar',
        view: 'Ver',
        close: 'Cerrar',
        back: 'Atrás',
        next: 'Siguiente',
        previous: 'Anterior',
        lightMode: 'Modo Claro',
        darkMode: 'Modo Oscuro',
        language: 'Idioma',
        settings: 'Configuración',
        profile: 'Perfil',
        logout: 'Cerrar Sesión',
        yes: 'Sí',
        no: 'No',
        ok: 'OK',
        error: 'Error',
        success: 'Éxito',
        warning: 'Advertencia',
        info: 'Información',
        active: 'Activo',
        inactive: 'Inactivo',
        completed: 'Completado',
        inProgress: 'En Progreso',
        changes: 'Cambios'
      },
      pricing: {
        hourly: '/hora',
        fixed: 'fijo',
        customPricing: 'Precio personalizado'
      },
      hero: {
        subtitle: 'Donde la excelencia se encuentra con la confianza',
        magneticDescription: 'Como las antiguas rutas comerciales que unían pueblos, ERTUNO crea puentes invisibles entre quienes buscan y quienes saben hacer. Una red de confianza tejida con el hilo dorado de la experiencia italiana.',
        promise: 'No solo un servicio, sino una experiencia que cambia vidas',
        stats: {
          providers: 'Profesionales',
          requests: 'Solicitudes Resueltas',
          cities: 'Ciudades Cubiertas',
          users: 'Usuarios Satisfechos'
        },
        cta: {
          primary: 'Entra al Futuro',
          secondary: 'Descubre la Magia'
        }
      },
      landing: {
        search: {
          title: 'Búsqueda Inteligente',
          description: 'Matching potenciado por IA. Describe el problema, encuentra al profesional perfecto en segundos.',
          chatTitle: 'Chat Instantáneo',
          chatSubtitle: 'Mensajería instantánea para profesionales',
          chatDescription: 'Chatea directamente con profesionales. Fotos, mensajes de voz, presupuestos. Cero intermediarios, cero comisiones ocultas.',
          verifiedTitle: '100% Verificados',
          verifiedSubtitle: 'Documentos, reseñas, portfolio',
          verifiedDescription: 'Cada profesional está verificado. Documentos revisados, reseñas reales, pagos garantizados.',
          trySearch: 'Prueba la Búsqueda Inteligente',
          searchExample: 'Necesito un electricista para reemplazar un panel eléctrico en Milán',
          findProvider: 'Encontrar Proveedor →'
        },
        testimonials: {
          title: 'Voces del Corazón de la Excelencia',
          subtitle: 'Miles de historias que hablan de transformación'
        },
        cta: {
          title: 'Tu Momento Ha Llegado',
          description: 'Únete a la familia de visionarios que han elegido la excelencia. Donde cada conexión se convierte en leyenda.',
          getStarted: 'Abraza el Destino',
          learnMore: 'Revela los Secretos'
        }
      },
      services: {
        title: '¿Qué puedes encontrar en ERTUNO?',
        subtitle: 'Desde reparaciones del hogar hasta servicios creativos, te conectamos con profesionales verificados listos para ayudar.',
        searchPlaceholder: 'Buscar servicios, habilidades o proveedores...',
        allZones: 'Todas las Zonas',
        verifiedProfessionals: 'profesionales verificados',
        activeServices: 'servicios activos',
        customRequest: '¿No encuentras lo que necesitas?',
        customRequestDesc: 'Publica tu solicitud personalizada y encontraremos al profesional adecuado para ti.',
        postCustomRequest: 'Publicar Solicitud Personalizada',
        whyChoose: '¿Por qué elegir ERTUNO?',
        whyChooseDesc: 'Hacemos que encontrar al profesional adecuado sea simple, seguro y sin estrés.',
        features: {
          verified: {
            title: 'Profesionales Verificados',
            description: 'Todos los proveedores están verificados y revisados'
          },
          rated: {
            title: 'Calificados y Reseñados',
            description: 'Ve calificaciones reales de clientes anteriores'
          },
          chat: {
            title: 'Chat Instantáneo',
            description: 'Comunícate directamente con proveedores en tiempo real'
          },
          response: {
            title: 'Respuesta Rápida',
            description: 'Obtén presupuestos y respuestas en minutos'
          }
        }
      },
      dashboard: {
        welcome: 'Bienvenido de vuelta',
        serviceProvider: 'Panel Proveedor de Servicios',
        professional: 'Profesional',
        verified: '✓ Verificado',
        pendingVerification: '⏳ Verificación Pendiente',
        pendingPayments: 'Pagos Pendientes',
        serviceRequester: 'Solicitante de Servicios',
        overview: 'Resumen',
        profile: 'Perfil Profesional',
        services: 'Mis Servicios',
        workspace: 'Áreas de Trabajo',
        accounting: 'Contabilidad',
        totalEarnings: 'Ganancias Totales',
        thisMonth: 'Este Mes',
        pendingPayment: 'Pago Pendiente',
        completedJobs: 'Trabajos Completados',
        quickActions: 'Acciones Rápidas',
        updateProfile: 'Actualizar Perfil',
        addService: 'Agregar Servicio',
        manageWorkAreas: 'Gestionar Áreas de Trabajo',
        businessName: 'Nombre del Negocio',
        professionalDescription: 'Descripción Profesional',
        yearsExperience: 'Años de Experiencia',
        skillsSpecialties: 'Habilidades y Especialidades',
        portfolioPastWork: 'Portfolio y Trabajos Anteriores',
        workAreasZones: 'Áreas y Zonas de Trabajo',
        myServices: 'Mis Servicios',
        addNewService: 'Agregar Nuevo Servicio'
      },
      aboutPage: {
        title: 'Acerca de ERTUNO',
        subtitle: 'ERTUNO está construido para velocidad, confianza y simplicidad. Conectamos ciudadanos con proveedores de servicios verificados en toda Europa—al instante. Ya sea que necesites un fontanero en Palermo o un diseñador en Berlín, ERTUNO encuentra la coincidencia correcta en segundos.',
        description: 'Nuestra plataforma es segura, multilingüe y optimizada para móviles.',
        tagline: 'Construido en Sicilia, diseñado para el mundo.',
        valuesDesc: 'Todo lo que construimos está guiado por cuatro principios fundamentales que priorizan a los usuarios.',
        stats: {
          activeUsers: 'Usuarios Activos',
          citiesCovered: 'Ciudades Cubiertas',
          completedJobs: 'Trabajos Completados',
          userSatisfaction: 'Satisfacción del Usuario'
        },
        values: {
          title: 'Nuestros Valores',
          speed: {
            title: 'Velocidad',
            description: 'Encuentra al profesional correcto en segundos, no días. Nuestra plataforma está construida para conexiones instantáneas.'
          },
          trust: {
            title: 'Confianza',
            description: 'Cada proveedor de servicios está verificado, calificado y revisado para tu tranquilidad.'
          },
          simplicity: {
            title: 'Simplicidad',
            description: 'La interfaz de chat intuitiva hace que la comunicación sea sin esfuerzo. Sin formularios complejos o procesos confusos.'
          },
          multilingual: {
            title: 'Multilingüe',
            description: 'Apoyamos múltiples idiomas en toda Europa. Rompiendo barreras lingüísticas para un mejor servicio.'
          }
        }
      },
      footer: {
        product: 'Producto',
        company: 'Empresa',
        legal: 'Legal',
        settings: 'Configuración',
        features: 'Características',
        featuresDesc: 'Mensajería en vivo, mercado de servicios, verificación profesional — construido para la colaboración en tiempo real y la confianza.',
        pricing: 'Precios',
        pricingDesc: 'Gratis para solicitantes. Comisiones para proveedores. Transparente, escalable, amigo del fundador.',
        api: 'API',
        apiDesc: 'API RESTful para integraciones de terceros. Endpoints seguros para publicación de trabajos, roles de usuario y mensajería.',
        documentation: 'Documentación',
        docsDesc: 'Guías técnicas, tutoriales de integración y diagramas de flujo backend para desarrolladores y arquitectos.',
        aboutUs: 'Acerca de Nosotros',
        aboutDesc: 'El sitio sagrado donde prosperan las conexiones, comerciantes y acuerdos. ERTUNO está construido sobre determinación siciliana y tecnología global.',
        blog: 'Blog',
        blogDesc: 'Historias de éxito, perspectivas de la industria y actualizaciones de la plataforma del equipo ERTUNO.',
        careers: 'Carreras',
        careersDesc: 'Únete a la misión sagrada. Oportunidades remotas y europeas disponibles para constructores, diseñadores y estrategas.',
        contact: 'Contacto',
        contactDesc: 'Ponte en contacto: hello@ertuno.com — respondemos rápidamente y construimos juntos.',
        privacyPolicy: 'Política de Privacidad',
        privacyDesc: 'Protección de datos compatible con GDPR y privacidad del usuario. Nunca vendemos tus datos.',
        termsOfService: 'Términos de Servicio',
        termsDesc: 'Términos de uso de la plataforma y acuerdos de servicio.',
        cookiePolicy: 'Política de Cookies',
        cookieDesc: 'Gestiona preferencias. Usamos cookies para mejorar el rendimiento, no para rastrear.',
        gdpr: 'GDPR',
        gdprDesc: 'Cumplimiento total con las leyes europeas de protección de datos. Tus derechos son respetados.',
        builtWith: 'Construido con',
        inItaly: 'en Italia',
        allRightsReserved: 'Todos los derechos reservados.',
        contactTitle: 'Ponte en Contacto',
        contactSubtext: 'Respondemos rápidamente y construimos juntos'
      },
      cookies: {
        banner: {
          title: 'Usamos Cookies',
          message: 'Utilizamos cookies técnicas necesarias para el funcionamiento del sitio y cookies de análisis para mejorar tu experiencia.',
          acceptAll: 'Aceptar Todos',
          rejectAll: 'Rechazar Todos',
          customize: 'Personalizar',
          viewPolicy: 'Ver Política de Cookies'
        }
      }
    }
  };

  return translations[languageCode] || translations.it;
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

  // Return key as fallback if no translation found (removed warning to avoid console spam)
  return key;
}

/**
 * Initialize i18n system and load default languages
 */
export async function initializeI18n(): Promise<void> {
  try {
    // Preload all supported languages
    await Promise.all([
      loadTranslations('it'),
      loadTranslations('en'),
      loadTranslations('es')
    ]);
    console.log('i18n system initialized successfully with IT, EN, ES');
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

/**
 * Batch translate multiple keys at once for performance
 */
export function batchTranslate(
  keys: TranslationKey[], 
  languageCode: LanguageCode
): Record<string, string> {
  const result: Record<string, string> = {};
  keys.forEach(key => {
    result[key] = translateKey(key, languageCode);
  });
  return result;
}

/**
 * Check if a translation exists for a given key
 */
export function hasTranslation(key: TranslationKey, languageCode: LanguageCode): boolean {
  const translations = translationsCache[languageCode] || getInlineTranslations(languageCode);
  const value = getNestedValue(translations, key);
  return Boolean(value && typeof value === 'string');
}

// Export type TranslationObject is already exported above
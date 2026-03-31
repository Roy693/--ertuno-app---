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
        student: 'Studente',
        university: 'Università',
        findHireProfessionals: 'Trovare e assumere professionisti',
        offerServices: 'Offrire servizi professionali',
        studyResearch: 'Studio e ricerca accademica',
        educationalInstitution: 'Istituzione educativa',
        passwordMismatch: 'Le password non corrispondono',
        enterEmail: 'Inserisci la tua email',
        enterPassword: 'Inserisci la password',
        enterFullName: 'Inserisci il tuo nome completo',
        // KYC Documents
        identityDocument: 'Documento di Identità',
        identityDocumentDesc: 'Carica una foto del tuo documento di identità',
        selfieVerification: 'Selfie di Verifica',
        selfieVerificationDesc: 'Scatta un selfie per la verifica dell\'identità',
        professionalCertifications: 'Certificazioni Professionali',
        professionalCertificationsDesc: 'Carica le tue certificazioni professionali (opzionale)',
        licenseVat: 'Licenza/Partita IVA',
        licenseVatDesc: 'Carica licenza professionale o documento P.IVA (opzionale)',
        universityCard: 'Tessera Universitaria',
        universityCardDesc: 'Carica tessera universitaria o certificato di iscrizione',
        institutionalDocument: 'Documento Istituzionale',
        institutionalDocumentDesc: 'Carica documento ufficiale dell\'istituto (per università)',
        documentsRequired: 'Documenti Richiesti',
        documentsOptional: 'Documenti Opzionali'
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
      kyc: {
        // Account Types
        accountType: 'Tipo di Account',
        selectAccountType: 'Seleziona il tipo di account',
        selectAccountTypeDesc: 'Scegli come vuoi registrarti come fornitore di servizi',
        privateAccount: 'Individuo Privato',
        businessAccount: 'Azienda/Impresa',
        privateDesc: 'Registrati come professionista individuale',
        businessDesc: 'Registrati come azienda o società',

        // Identity Verification
        identityVerification: 'Verifica Identità',
        identityDesc: 'Carica i tuoi documenti di identità per la verifica',
        requesterIdentityDesc: 'Dobbiamo verificare la tua identità per garantire la sicurezza della piattaforma',
        identityFront: 'Documento di Identità - Fronte',
        identityBack: 'Documento di Identità - Retro',
        identityFrontDesc: 'Carica la parte anteriore del tuo documento di identità, passaporto o patente',
        identityBackDesc: 'Carica la parte posteriore del tuo documento di identità o patente',
        selfieVerification: 'Selfie di Verifica',
        selfieDesc: 'Scatta un selfie chiaro per la verifica del riconoscimento facciale',
        representativeId: 'Documento del Rappresentante Legale',
        representativeIdDesc: 'Carica il documento del rappresentante legale',
        businessDocument: 'Documento di Registrazione Aziendale',
        businessDocDesc: 'Carica certificato di iscrizione, atto costitutivo o equivalente',

        // Profile Information
        profileInformation: 'Informazioni Profilo',
        profileDesc: 'Raccontaci di te e della tua attività',
        requesterProfileDesc: 'Parlaci un po\' di te',
        profileImage: 'Immagine Profilo',
        profileImageDesc: 'Carica una foto professionale del profilo',
        requesterProfileImageDesc: 'Carica una foto che ti rappresenti bene',
        coverImage: 'Immagine di Copertina',
        coverImageDesc: 'Carica un\'immagine di copertina per il tuo profilo',
        fullName: 'Nome Completo',
        enterFullName: 'Inserisci il tuo nome completo',
        businessName: 'Nome Azienda',
        enterBusinessName: 'Inserisci il nome dell\'azienda',
        vatNumber: 'Partita IVA',
        legalAddress: 'Indirizzo Legale',
        enterAddress: 'Inserisci l\'indirizzo legale',
        experienceYears: 'Anni di Esperienza',
        professionalDescription: 'Descrizione Professionale',
        businessDescription: 'Descrizione Aziendale',
        personalDescription: 'Descrizione Personale',
        professionalPlaceholder: 'Descrivi la tua esperienza professionale e competenze...',
        businessPlaceholder: 'Descrivi la tua attività, servizi e cosa ti rende unico...',
        personalDescPlaceholder: 'Raccontaci di te, i tuoi interessi e che tipo di servizi potresti richiedere...',
        qualifications: 'Qualifiche e Certificazioni',
        qualificationsPlaceholder: 'Elenca le tue qualifiche, certificazioni e formazione rilevanti...',
        qualificationDocuments: 'Documenti delle Qualifiche',
        qualificationDocsDesc: 'Carica certificati, diplomi o altri documenti delle qualifiche',
        businessCertifications: 'Certificazioni Aziendali',
        certificationDesc: 'Carica eventuali certificazioni aziendali pertinenti (opzionale)',
        workPhotos: 'Foto di Lavori Precedenti',
        workPhotosDesc: 'Carica foto dei tuoi lavori precedenti per mostrare le tue competenze',

        // Services
        servicesOffered: 'Servizi Offerti',
        servicesStepDesc: 'Seleziona i servizi che fornisci per aiutare i clienti a trovarti',
        selectServices: 'Seleziona i servizi che offri',
        selected: 'selezionati',
        selectAll: 'Seleziona Tutti',
        deselectAll: 'Deseleziona Tutti',
        selectedServices: 'Servizi Selezionati',

        // Work Area
        workArea: 'Area di Lavoro',
        workAreaStepDesc: 'Definisci le aree geografiche dove fornisci servizi',
        workRegions: 'Regioni di Servizio',
        regionsPlaceholder: 'es. Milano, Roma, Napoli',
        regionsHelp: 'Inserisci città o regioni separate da virgole',
        serviceRadius: 'Raggio di Servizio (km)',
        radiusHelp: 'Quanto sei disposto a viaggiare per lavorare?',
        serviceAreaPreview: 'Anteprima Area di Servizio',
        regions: 'regioni',

        // Legal Declaration
        legalDeclaration: 'Dichiarazione Legale',
        declarationDesc: 'Leggi e accetta la seguente dichiarazione',
        declarationTitle: 'Dichiarazione Legale e Termini',
        declarationText: 'Dichiaro che tutte le informazioni e documenti forniti sono veritieri e accurati. Comprendo che:',
        declaration1: 'Tutte le informazioni personali e aziendali fornite sono accurate e aggiornate',
        declaration2: 'Tutti i documenti caricati sono autentici e mi appartengono/appartengono alla mia azienda',
        declaration3: 'Sono legalmente autorizzato a fornire i servizi elencati',
        declaration4: 'Manterrò standard professionali e rispetterò le normative locali',
        declaration5: 'ERTUNO si riserva il diritto di verificare tutte le informazioni fornite',
        warningTitle: 'Avviso Importante:',
        warningText: 'In caso di dichiarazioni false o fraudolente, ERTUNO non sarà ritenuta responsabile e potrà sospendere o eliminare permanentemente l\'account. Potrebbero essere intraprese azioni legali per invii fraudolenti.',
        
        // Requester specific declarations
        requesterDeclarationTitle: 'Accordo Richiedente Servizi',
        requesterDeclarationText: 'Dichiaro che:',
        requesterDeclaration1: 'Tutte le informazioni personali fornite sono accurate e veritiere',
        requesterDeclaration2: 'Sono autorizzato a utilizzare questo account e richiedere servizi',
        requesterDeclaration3: 'Mi comporterò professionalmente quando richiedo servizi',
        requesterDeclaration4: 'Comprendo che ERTUNO è una piattaforma che connette utenti e non è responsabile della qualità del servizio',
        requesterDeclaration5: 'Accetto di risolvere le dispute amichevolmente e seguire le linee guida della piattaforma',
        requesterWarningText: 'Informazioni false possono comportare la sospensione dell\'account. ERTUNO si riserva il diritto di verificare le informazioni fornite.',

        acceptDeclaration: 'Accetto la dichiarazione legale',
        acceptanceNote: 'Selezionando questa casella, confermo di aver letto, compreso e accettato tutti i termini sopra indicati.',

        // Submission
        readyToSubmit: 'Pronto per Inviare',
        submissionReview: 'Rivedi le tue informazioni prima di inviare la tua richiesta',
        requesterSubmissionReview: 'Rivedi le tue informazioni prima di completare la registrazione',
        applicationSummary: 'Riepilogo Richiesta',
        registrationSummary: 'Riepilogo Registrazione',
        servicesCount: 'Servizi',
        identityDocs: 'Documenti di Identità',
        uploaded: 'Caricati',
        accepted: 'Accettato',
        notAccepted: 'Non Accettato',
        submissionNote: 'Dopo l\'invio, la tua richiesta sarà esaminata entro 24-48 ore. Riceverai una notifica email una volta completata la revisione.',
        requesterSubmissionNote: 'Dopo la registrazione, puoi immediatamente iniziare a navigare e richiedere servizi da fornitori verificati.',

        // Form Actions
        submit: 'Invia Richiesta',
        submitting: 'Invio in corso...',
        completeRegistration: 'Completa Registrazione',
        completing: 'Completamento...',

        // Navigation
        providerOnboarding: 'Onboarding Fornitore Servizi',
        requesterOnboarding: 'Registrazione Richiedente Servizi',

        // Validation Messages
        fullNameRequired: 'Il nome completo è obbligatorio',
        businessNameRequired: 'Il nome dell\'azienda è obbligatorio',
        vatRequired: 'La partita IVA è obbligatoria',
        addressRequired: 'L\'indirizzo legale è obbligatorio',
        descriptionRequired: 'La descrizione è obbligatoria',
        identityFrontRequired: 'Il documento di identità fronte è obbligatorio',
        identityBackRequired: 'Il documento di identità retro è obbligatorio',
        selfieRequired: 'Il selfie di verifica è obbligatorio',
        representativeIdRequired: 'Il documento del rappresentante è obbligatorio',
        businessDocRequired: 'Il documento aziendale è obbligatorio',
        servicesRequired: 'Almeno un servizio deve essere selezionato',
        workAreaRequired: 'L\'area di lavoro è obbligatoria',
        declarationRequired: 'La dichiarazione legale deve essere accettata',
        submissionError: 'Errore nell\'invio della richiesta. Riprova.',

        // File Upload
        clickToUpload: 'Clicca per caricare',
        orDragDrop: 'o trascina e rilascia',
        imageFormats: 'PNG, JPG, GIF fino a',
        documentFormats: 'PDF, PNG, JPG fino a',
        maxSize: 'Dimensione max:',
        filesSelected: 'file selezionati',
        addMore: 'Aggiungi altri',
        fileTooLarge: 'è troppo grande (max',
        invalidImageType: 'deve essere un\'immagine',
        invalidDocumentType: 'deve essere PDF o immagine',
        tooManyFiles: 'Massimo file consentiti',

        // Auth
        notAuthenticated: 'Effettua l\'accesso per continuare'
      },
      account: {
        manageAccount: 'Gestisci Account',
        updateProfile: 'Aggiorna il tuo profilo professionale e le impostazioni',
        updateRequesterProfile: 'Aggiorna il tuo profilo e le preferenze account',
        profile: 'Profilo',
        services: 'Servizi',
        qualifications: 'Qualifiche',
        portfolio: 'Portfolio',
        preferences: 'Preferenze',
        profileImage: 'Immagine Profilo',
        profileImageDesc: 'Carica una foto professionale del profilo',
        requesterProfileImageDesc: 'Carica una foto che ti rappresenti bene',
        coverImage: 'Immagine di Copertina',
        coverImageDesc: 'Carica un\'immagine di copertina per il tuo profilo',
        currentImage: 'Immagine Attuale',
        manageServices: 'Gestisci Servizi',
        manageQualifications: 'Gestisci Qualifiche',
        managePortfolio: 'Gestisci Portfolio',
        addQualificationDocs: 'Aggiungi Documenti Qualifiche',
        addCertifications: 'Aggiungi Certificazioni Aziendali',
        addWorkPhotos: 'Aggiungi Foto di Lavori',
        existingDocuments: 'Documenti Esistenti',
        existingCertifications: 'Certificazioni Esistenti',
        existingPhotos: 'Foto Esistenti',
        document: 'Documento',
        certification: 'Certificazione',
        photoRemoved: 'Foto rimossa con successo',
        removeError: 'Errore nella rimozione della foto',
        loadError: 'Errore nel caricamento dei dati account',
        saveSuccess: 'Modifiche salvate con successo',
        saveError: 'Errore nel salvataggio delle modifiche',
        accountInfo: 'Informazioni Account',
        memberSince: 'Membro dal',
        verificationStatus: 'Stato Verifica',
        verified: 'Verificato',
        pending: 'In Attesa',
        rejected: 'Rifiutato',
        accountPreferences: 'Preferenze Account',
        communicationPrefs: 'Preferenze Comunicazione',
        emailNotifications: 'Notifiche email per nuovi messaggi',
        serviceUpdates: 'Aggiornamenti servizi e raccomandazioni',
        marketingEmails: 'Email di marketing e promozioni',
        privacySettings: 'Impostazioni Privacy',
        profileVisible: 'Rendi il mio profilo visibile ai fornitori di servizi',
        showActivity: 'Mostra il mio stato di attività',
        requestPreferences: 'Preferenze Richieste',
        preferredContactMethod: 'Metodo di Contatto Preferito',
        inAppChat: 'Chat in-app',
        email: 'Email',
        phone: 'Telefono',
        responseTime: 'Tempo di Risposta Atteso',
        immediate: 'Immediato (entro 1 ora)',
        sameDay: 'Stesso giorno (entro 8 ore)',
        nextDay: 'Giorno successivo (entro 24 ore)',
        flexible: 'Flessibile (entro 3 giorni)',
        safetyTrust: 'Sicurezza e Fiducia',
        identityVerified: 'Identità verificata da ERTUNO',
        securePayments: 'Protezione pagamenti sicuri',
        disputeResolution: 'Supporto risoluzione controversie'
      },
      profile: {
        notFound: 'Profilo non trovato',
        notAvailable: 'Questo profilo non è disponibile o è ancora in revisione.',
        loadError: 'Errore nel caricamento del profilo',
        verified: 'Verificato',
        yearsExperience: 'anni di esperienza',
        more: 'altro',
        moreServices: 'altro',
        contactProvider: 'Contatta Fornitore',
        requestQuote: 'Richiedi Preventivo',
        about: 'Chi siamo',
        services: 'Servizi',
        qualifications: 'Qualifiche',
        portfolio: 'Portfolio',
        serviceAreas: 'Aree di Servizio',
        businessInfo: 'Informazioni Azienda',
        businessName: 'Nome Azienda',
        location: 'Posizione',
        verifiedProvider: 'Fornitore Verificato',
        verificationDesc: 'Questo fornitore è stato verificato da ERTUNO. Tutti i documenti e le credenziali sono stati controllati per autenticità.',
        verifiedOn: 'Verificato il',
        serviceRequester: 'Richiedente Servizi',
        sendMessage: 'Invia Messaggio',
        stats: 'Statistiche',
        requestsMade: 'Richieste Fatte',
        averageRating: 'Valutazione Media',
        completedJobs: 'Lavori Completati',
        verifiedRequester: 'Richiedente Verificato',
        requesterVerificationDesc: 'Questo utente è stato verificato da ERTUNO. I documenti di identità sono stati controllati per autenticità.',
        trustSafety: 'Fiducia e Sicurezza',
        profileReviewed: 'Profilo Revisionato',
        platformMember: 'Membro ERTUNO',
        contactInfo: 'Informazioni di Contatto',
        contactInfoDesc: 'Per proteggere la privacy degli utenti, i dettagli di contatto vengono condivisi solo dopo aver stabilito una connessione professionale tramite ERTUNO.'
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
        student: 'Student',
        university: 'University',
        findHireProfessionals: 'Find and hire professionals',
        offerServices: 'Offer professional services',
        studyResearch: 'Study and academic research',
        educationalInstitution: 'Educational institution',
        passwordMismatch: 'Passwords do not match',
        enterEmail: 'Enter your email',
        enterPassword: 'Enter your password',
        enterFullName: 'Enter your full name',
        // KYC Documents
        identityDocument: 'Identity Document',
        identityDocumentDesc: 'Upload a photo of your identity document',
        selfieVerification: 'Selfie Verification',
        selfieVerificationDesc: 'Take a selfie for identity verification',
        professionalCertifications: 'Professional Certifications',
        professionalCertificationsDesc: 'Upload your professional certifications (optional)',
        licenseVat: 'License/VAT',
        licenseVatDesc: 'Upload professional license or VAT document (optional)',
        universityCard: 'University Card',
        universityCardDesc: 'Upload university card or enrollment certificate',
        institutionalDocument: 'Institutional Document',
        institutionalDocumentDesc: 'Upload official institution document (for universities)',
        documentsRequired: 'Required Documents',
        documentsOptional: 'Optional Documents'
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
      kyc: {
        // Account Types
        accountType: 'Account Type',
        selectAccountType: 'Please select an account type',
        selectAccountTypeDesc: 'Choose how you want to register as a service provider',
        privateAccount: 'Private Individual',
        businessAccount: 'Business/Company',
        privateDesc: 'Register as an individual professional',
        businessDesc: 'Register as a business or company',

        // Identity Verification
        identityVerification: 'Identity Verification',
        identityDesc: 'Upload your identity documents for verification',
        requesterIdentityDesc: 'We need to verify your identity to ensure platform safety',
        identityFront: 'Identity Document - Front',
        identityBack: 'Identity Document - Back',
        identityFrontDesc: 'Upload the front side of your ID, passport, or driver license',
        identityBackDesc: 'Upload the back side of your ID or driver license',
        selfieVerification: 'Selfie Verification',
        selfieDesc: 'Take a clear selfie for facial recognition verification',
        representativeId: 'Legal Representative ID',
        representativeIdDesc: 'Upload ID of the legal representative',
        businessDocument: 'Business Registration Document',
        businessDocDesc: 'Upload business registration, articles of incorporation, or equivalent',

        // Profile Information
        profileInformation: 'Profile Information',
        profileDesc: 'Tell us about yourself and your business',
        requesterProfileDesc: 'Tell us a bit about yourself',
        profileImage: 'Profile Image',
        profileImageDesc: 'Upload a professional profile photo',
        requesterProfileImageDesc: 'Upload a photo that represents you well',
        coverImage: 'Cover Image',
        coverImageDesc: 'Upload a cover image for your profile',
        fullName: 'Full Name',
        enterFullName: 'Enter your full name',
        businessName: 'Business Name',
        enterBusinessName: 'Enter business name',
        vatNumber: 'VAT Number',
        legalAddress: 'Legal Address',
        enterAddress: 'Enter legal address',
        experienceYears: 'Years of Experience',
        professionalDescription: 'Professional Description',
        businessDescription: 'Business Description',
        personalDescription: 'Personal Description',
        professionalPlaceholder: 'Describe your professional experience and expertise...',
        businessPlaceholder: 'Describe your business, services, and what makes you unique...',
        personalDescPlaceholder: 'Tell us about yourself, your interests, and what kind of services you might need...',
        qualifications: 'Qualifications & Certifications',
        qualificationsPlaceholder: 'List your relevant qualifications, certifications, and training...',
        qualificationDocuments: 'Qualification Documents',
        qualificationDocsDesc: 'Upload certificates, diplomas, or other qualification documents',
        businessCertifications: 'Business Certifications',
        certificationDesc: 'Upload any relevant business certifications (optional)',
        workPhotos: 'Previous Work Photos',
        workPhotosDesc: 'Upload photos of your previous work to showcase your skills',

        // Services
        servicesOffered: 'Services Offered',
        servicesStepDesc: 'Select the services you provide to help customers find you',
        selectServices: 'Select the services you offer',
        selected: 'selected',
        selectAll: 'Select All',
        deselectAll: 'Deselect All',
        selectedServices: 'Selected Services',

        // Work Area
        workArea: 'Work Area',
        workAreaStepDesc: 'Define the geographic areas where you provide services',
        workRegions: 'Service Regions',
        regionsPlaceholder: 'e.g., Milan, Rome, Naples',
        regionsHelp: 'Enter cities or regions separated by commas',
        serviceRadius: 'Service Radius (km)',
        radiusHelp: 'How far are you willing to travel for work?',
        serviceAreaPreview: 'Service Area Preview',
        regions: 'regions',

        // Legal Declaration
        legalDeclaration: 'Legal Declaration',
        declarationDesc: 'Please read and accept the following declaration',
        declarationTitle: 'Legal Declaration and Terms',
        declarationText: 'I hereby declare that all information and documents provided are truthful and accurate. I understand that:',
        declaration1: 'All personal and business information provided is accurate and up-to-date',
        declaration2: 'All uploaded documents are authentic and belong to me/my business',
        declaration3: 'I am legally authorized to provide the services listed',
        declaration4: 'I will maintain professional standards and comply with local regulations',
        declaration5: 'ERTUNO reserves the right to verify all information provided',
        warningTitle: 'Important Warning:',
        warningText: 'In case of false or fraudulent declarations, ERTUNO will not be held responsible and may suspend or permanently delete the account. Legal action may be taken for fraudulent submissions.',
        
        // Requester specific declarations
        requesterDeclarationTitle: 'Service Requester Agreement',
        requesterDeclarationText: 'I hereby declare that:',
        requesterDeclaration1: 'All personal information provided is accurate and truthful',
        requesterDeclaration2: 'I am authorized to use this account and request services',
        requesterDeclaration3: 'I will conduct myself professionally when requesting services',
        requesterDeclaration4: 'I understand ERTUNO is a platform connecting users and is not responsible for service quality',
        requesterDeclaration5: 'I agree to resolve disputes amicably and follow platform guidelines',
        requesterWarningText: 'False information may result in account suspension. ERTUNO reserves the right to verify provided information.',

        acceptDeclaration: 'I accept the legal declaration',
        acceptanceNote: 'By checking this box, I confirm that I have read, understood, and agree to all the terms stated above.',

        // Submission
        readyToSubmit: 'Ready to Submit',
        submissionReview: 'Please review your information before submitting your application',
        requesterSubmissionReview: 'Please review your information before completing your registration',
        applicationSummary: 'Application Summary',
        registrationSummary: 'Registration Summary',
        servicesCount: 'Services',
        identityDocs: 'Identity Documents',
        uploaded: 'Uploaded',
        accepted: 'Accepted',
        notAccepted: 'Not Accepted',
        submissionNote: 'After submission, your application will be reviewed within 24-48 hours. You will receive an email notification once the review is complete.',
        requesterSubmissionNote: 'After registration, you can immediately start browsing and requesting services from verified providers.',

        // Form Actions
        submit: 'Submit Application',
        submitting: 'Submitting...',
        completeRegistration: 'Complete Registration',
        completing: 'Completing...',

        // Navigation
        providerOnboarding: 'Service Provider Onboarding',
        requesterOnboarding: 'Service Requester Registration',

        // Validation Messages
        fullNameRequired: 'Full name is required',
        businessNameRequired: 'Business name is required',
        vatRequired: 'VAT number is required',
        addressRequired: 'Legal address is required',
        descriptionRequired: 'Description is required',
        identityFrontRequired: 'Identity document front is required',
        identityBackRequired: 'Identity document back is required',
        selfieRequired: 'Selfie verification is required',
        representativeIdRequired: 'Representative ID is required',
        businessDocRequired: 'Business document is required',
        servicesRequired: 'At least one service must be selected',
        workAreaRequired: 'Work area is required',
        declarationRequired: 'Legal declaration must be accepted',
        submissionError: 'Error submitting application. Please try again.',

        // File Upload
        clickToUpload: 'Click to upload',
        orDragDrop: 'or drag and drop',
        imageFormats: 'PNG, JPG, GIF up to',
        documentFormats: 'PDF, PNG, JPG up to',
        maxSize: 'Max size:',
        filesSelected: 'file(s) selected',
        addMore: 'Add more',
        fileTooLarge: 'is too large (max',
        invalidImageType: 'must be an image',
        invalidDocumentType: 'must be PDF or image',
        tooManyFiles: 'Maximum files allowed',

        // Auth
        notAuthenticated: 'Please log in to continue'
      },
      account: {
        manageAccount: 'Manage Account',
        updateProfile: 'Update your professional profile and settings',
        updateRequesterProfile: 'Update your profile and account preferences',
        profile: 'Profile',
        services: 'Services',
        qualifications: 'Qualifications',
        portfolio: 'Portfolio',
        preferences: 'Preferences',
        profileImage: 'Profile Image',
        profileImageDesc: 'Upload a professional profile photo',
        requesterProfileImageDesc: 'Upload a photo that represents you well',
        coverImage: 'Cover Image',
        coverImageDesc: 'Upload a cover image for your profile',
        currentImage: 'Current Image',
        manageServices: 'Manage Services',
        manageQualifications: 'Manage Qualifications',
        managePortfolio: 'Manage Portfolio',
        addQualificationDocs: 'Add Qualification Documents',
        addCertifications: 'Add Business Certifications',
        addWorkPhotos: 'Add Work Photos',
        existingDocuments: 'Existing Documents',
        existingCertifications: 'Existing Certifications',
        existingPhotos: 'Existing Photos',
        document: 'Document',
        certification: 'Certification',
        photoRemoved: 'Photo removed successfully',
        removeError: 'Error removing photo',
        loadError: 'Error loading account data',
        saveSuccess: 'Changes saved successfully',
        saveError: 'Error saving changes',
        accountInfo: 'Account Information',
        memberSince: 'Member Since',
        verificationStatus: 'Verification Status',
        verified: 'Verified',
        pending: 'Pending',
        rejected: 'Rejected',
        accountPreferences: 'Account Preferences',
        communicationPrefs: 'Communication Preferences',
        emailNotifications: 'Email notifications for new messages',
        serviceUpdates: 'Service updates and recommendations',
        marketingEmails: 'Marketing emails and promotions',
        privacySettings: 'Privacy Settings',
        profileVisible: 'Make my profile visible to service providers',
        showActivity: 'Show my activity status',
        requestPreferences: 'Request Preferences',
        preferredContactMethod: 'Preferred Contact Method',
        inAppChat: 'In-app chat',
        email: 'Email',
        phone: 'Phone',
        responseTime: 'Expected Response Time',
        immediate: 'Immediate (within 1 hour)',
        sameDay: 'Same day (within 8 hours)',
        nextDay: 'Next day (within 24 hours)',
        flexible: 'Flexible (within 3 days)',
        safetyTrust: 'Safety & Trust',
        identityVerified: 'Identity verified by ERTUNO',
        securePayments: 'Secure payment protection',
        disputeResolution: 'Dispute resolution support'
      },
      profile: {
        notFound: 'Profile not found',
        notAvailable: 'This profile is not available or still under review.',
        loadError: 'Error loading profile',
        verified: 'Verified',
        yearsExperience: 'years of experience',
        more: 'more',
        moreServices: 'more',
        contactProvider: 'Contact Provider',
        requestQuote: 'Request Quote',
        about: 'About',
        services: 'Services',
        qualifications: 'Qualifications',
        portfolio: 'Portfolio',
        serviceAreas: 'Service Areas',
        businessInfo: 'Business Information',
        businessName: 'Business Name',
        location: 'Location',
        verifiedProvider: 'Verified Provider',
        verificationDesc: 'This provider has been verified by ERTUNO. All documents and credentials have been checked for authenticity.',
        verifiedOn: 'Verified on',
        serviceRequester: 'Service Requester',
        sendMessage: 'Send Message',
        stats: 'Stats',
        requestsMade: 'Requests Made',
        averageRating: 'Average Rating',
        completedJobs: 'Completed Jobs',
        verifiedRequester: 'Verified Requester',
        requesterVerificationDesc: 'This user has been verified by ERTUNO. Identity documents have been checked for authenticity.',
        trustSafety: 'Trust & Safety',
        profileReviewed: 'Profile Reviewed',
        platformMember: 'ERTUNO Member',
        contactInfo: 'Contact Information',
        contactInfoDesc: 'To protect user privacy, contact details are only shared after establishing a professional connection through ERTUNO.'
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
        student: 'Estudiante',
        university: 'Universidad',
        findHireProfessionals: 'Encontrar y contratar profesionales',
        offerServices: 'Ofrecer servicios profesionales',
        studyResearch: 'Estudio e investigación académica',
        educationalInstitution: 'Institución educativa',
        passwordMismatch: 'Las contraseñas no coinciden',
        enterEmail: 'Ingresa tu correo electrónico',
        enterPassword: 'Ingresa tu contraseña',
        enterFullName: 'Ingresa tu nombre completo',
        // KYC Documents
        identityDocument: 'Documento de Identidad',
        identityDocumentDesc: 'Sube una foto de tu documento de identidad',
        selfieVerification: 'Selfie de Verificación',
        selfieVerificationDesc: 'Toma un selfie para verificación de identidad',
        professionalCertifications: 'Certificaciones Profesionales',
        professionalCertificationsDesc: 'Sube tus certificaciones profesionales (opcional)',
        licenseVat: 'Licencia/IVA',
        licenseVatDesc: 'Sube licencia profesional o documento de IVA (opcional)',
        universityCard: 'Tarjeta Universitaria',
        universityCardDesc: 'Sube tarjeta universitaria o certificado de inscripción',
        institutionalDocument: 'Documento Institucional',
        institutionalDocumentDesc: 'Sube documento oficial de la institución (para universidades)',
        documentsRequired: 'Documentos Requeridos',
        documentsOptional: 'Documentos Opcionales'
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
      kyc: {
        // Account Types
        accountType: 'Tipo de Cuenta',
        selectAccountType: 'Seleccione un tipo de cuenta',
        selectAccountTypeDesc: 'Elige cómo quieres registrarte como proveedor de servicios',
        privateAccount: 'Individuo Privado',
        businessAccount: 'Empresa/Compañía',
        privateDesc: 'Registrarse como profesional individual',
        businessDesc: 'Registrarse como empresa o compañía',

        // Identity Verification
        identityVerification: 'Verificación de Identidad',
        identityDesc: 'Sube tus documentos de identidad para verificación',
        requesterIdentityDesc: 'Necesitamos verificar tu identidad para garantizar la seguridad de la plataforma',
        identityFront: 'Documento de Identidad - Frontal',
        identityBack: 'Documento de Identidad - Trasero',
        identityFrontDesc: 'Sube la parte frontal de tu ID, pasaporte o licencia de conducir',
        identityBackDesc: 'Sube la parte trasera de tu ID o licencia de conducir',
        selfieVerification: 'Selfie de Verificación',
        selfieDesc: 'Toma un selfie claro para verificación de reconocimiento facial',
        representativeId: 'ID del Representante Legal',
        representativeIdDesc: 'Sube el ID del representante legal',
        businessDocument: 'Documento de Registro Empresarial',
        businessDocDesc: 'Sube el registro empresarial, artículos de incorporación o equivalente',

        // Profile Information
        profileInformation: 'Información del Perfil',
        profileDesc: 'Cuéntanos sobre ti y tu negocio',
        requesterProfileDesc: 'Cuéntanos un poco sobre ti',
        profileImage: 'Imagen de Perfil',
        profileImageDesc: 'Sube una foto profesional de perfil',
        requesterProfileImageDesc: 'Sube una foto que te represente bien',
        coverImage: 'Imagen de Portada',
        coverImageDesc: 'Sube una imagen de portada para tu perfil',
        fullName: 'Nombre Completo',
        enterFullName: 'Ingresa tu nombre completo',
        businessName: 'Nombre de la Empresa',
        enterBusinessName: 'Ingresa el nombre de la empresa',
        vatNumber: 'Número de IVA',
        legalAddress: 'Dirección Legal',
        enterAddress: 'Ingresa la dirección legal',
        experienceYears: 'Años de Experiencia',
        professionalDescription: 'Descripción Profesional',
        businessDescription: 'Descripción del Negocio',
        personalDescription: 'Descripción Personal',
        professionalPlaceholder: 'Describe tu experiencia profesional y conocimientos...',
        businessPlaceholder: 'Describe tu negocio, servicios y qué te hace único...',
        personalDescPlaceholder: 'Cuéntanos sobre ti, tus intereses y qué tipo de servicios podrías necesitar...',
        qualifications: 'Calificaciones y Certificaciones',
        qualificationsPlaceholder: 'Lista tus calificaciones, certificaciones y entrenamiento relevantes...',
        qualificationDocuments: 'Documentos de Calificaciones',
        qualificationDocsDesc: 'Sube certificados, diplomas u otros documentos de calificación',
        businessCertifications: 'Certificaciones Empresariales',
        certificationDesc: 'Sube cualquier certificación empresarial relevante (opcional)',
        workPhotos: 'Fotos de Trabajos Anteriores',
        workPhotosDesc: 'Sube fotos de tus trabajos anteriores para mostrar tus habilidades',

        // Services
        servicesOffered: 'Servicios Ofrecidos',
        servicesStepDesc: 'Selecciona los servicios que proporcionas para ayudar a los clientes a encontrarte',
        selectServices: 'Selecciona los servicios que ofreces',
        selected: 'seleccionados',
        selectAll: 'Seleccionar Todos',
        deselectAll: 'Deseleccionar Todos',
        selectedServices: 'Servicios Seleccionados',

        // Work Area
        workArea: 'Área de Trabajo',
        workAreaStepDesc: 'Define las áreas geográficas donde proporcionas servicios',
        workRegions: 'Regiones de Servicio',
        regionsPlaceholder: 'ej. Milán, Roma, Nápoles',
        regionsHelp: 'Ingresa ciudades o regiones separadas por comas',
        serviceRadius: 'Radio de Servicio (km)',
        radiusHelp: '¿Qué tan lejos estás dispuesto a viajar por trabajo?',
        serviceAreaPreview: 'Vista Previa del Área de Servicio',
        regions: 'regiones',

        // Legal Declaration
        legalDeclaration: 'Declaración Legal',
        declarationDesc: 'Por favor lee y acepta la siguiente declaración',
        declarationTitle: 'Declaración Legal y Términos',
        declarationText: 'Por la presente declaro que toda la información y documentos proporcionados son veraces y precisos. Entiendo que:',
        declaration1: 'Toda la información personal y empresarial proporcionada es precisa y está actualizada',
        declaration2: 'Todos los documentos subidos son auténticos y me pertenecen/pertenecen a mi empresa',
        declaration3: 'Estoy legalmente autorizado para proporcionar los servicios listados',
        declaration4: 'Mantendré estándares profesionales y cumpliré con las regulaciones locales',
        declaration5: 'ERTUNO se reserva el derecho de verificar toda la información proporcionada',
        warningTitle: 'Advertencia Importante:',
        warningText: 'En caso de declaraciones falsas o fraudulentas, ERTUNO no será responsable y puede suspender o eliminar permanentemente la cuenta. Se pueden tomar acciones legales por envíos fraudulentos.',
        
        // Requester specific declarations
        requesterDeclarationTitle: 'Acuerdo del Solicitante de Servicios',
        requesterDeclarationText: 'Por la presente declaro que:',
        requesterDeclaration1: 'Toda la información personal proporcionada es precisa y veraz',
        requesterDeclaration2: 'Estoy autorizado a usar esta cuenta y solicitar servicios',
        requesterDeclaration3: 'Me comportaré profesionalmente al solicitar servicios',
        requesterDeclaration4: 'Entiendo que ERTUNO es una plataforma que conecta usuarios y no es responsable de la calidad del servicio',
        requesterDeclaration5: 'Acepto resolver disputas amigablemente y seguir las pautas de la plataforma',
        requesterWarningText: 'La información falsa puede resultar en suspensión de cuenta. ERTUNO se reserva el derecho de verificar la información proporcionada.',

        acceptDeclaration: 'Acepto la declaración legal',
        acceptanceNote: 'Al marcar esta casilla, confirmo que he leído, entendido y acepto todos los términos mencionados arriba.',

        // Submission
        readyToSubmit: 'Listo para Enviar',
        submissionReview: 'Por favor revisa tu información antes de enviar tu solicitud',
        requesterSubmissionReview: 'Por favor revisa tu información antes de completar tu registro',
        applicationSummary: 'Resumen de Solicitud',
        registrationSummary: 'Resumen de Registro',
        servicesCount: 'Servicios',
        identityDocs: 'Documentos de Identidad',
        uploaded: 'Subido',
        accepted: 'Aceptado',
        notAccepted: 'No Aceptado',
        submissionNote: 'Después del envío, tu solicitud será revisada dentro de 24-48 horas. Recibirás una notificación por correo una vez que se complete la revisión.',
        requesterSubmissionNote: 'Después del registro, puedes comenzar inmediatamente a navegar y solicitar servicios de proveedores verificados.',

        // Form Actions
        submit: 'Enviar Solicitud',
        submitting: 'Enviando...',
        completeRegistration: 'Completar Registro',
        completing: 'Completando...',

        // Navigation
        providerOnboarding: 'Incorporación de Proveedor de Servicios',
        requesterOnboarding: 'Registro de Solicitante de Servicios',

        // Validation Messages
        fullNameRequired: 'El nombre completo es requerido',
        businessNameRequired: 'El nombre de la empresa es requerido',
        vatRequired: 'El número de IVA es requerido',
        addressRequired: 'La dirección legal es requerida',
        descriptionRequired: 'La descripción es requerida',
        identityFrontRequired: 'El documento de identidad frontal es requerido',
        identityBackRequired: 'El documento de identidad trasero es requerido',
        selfieRequired: 'El selfie de verificación es requerido',
        representativeIdRequired: 'El ID del representante es requerido',
        businessDocRequired: 'El documento empresarial es requerido',
        servicesRequired: 'Al menos un servicio debe ser seleccionado',
        workAreaRequired: 'El área de trabajo es requerida',
        declarationRequired: 'La declaración legal debe ser aceptada',
        submissionError: 'Error enviando la solicitud. Por favor intenta de nuevo.',

        // File Upload
        clickToUpload: 'Haz clic para subir',
        orDragDrop: 'o arrastra y suelta',
        imageFormats: 'PNG, JPG, GIF hasta',
        documentFormats: 'PDF, PNG, JPG hasta',
        maxSize: 'Tamaño máx:',
        filesSelected: 'archivo(s) seleccionado(s)',
        addMore: 'Agregar más',
        fileTooLarge: 'es demasiado grande (máx',
        invalidImageType: 'debe ser una imagen',
        invalidDocumentType: 'debe ser PDF o imagen',
        tooManyFiles: 'Máximo de archivos permitidos',

        // Auth
        notAuthenticated: 'Por favor inicia sesión para continuar'
      },
      account: {
        manageAccount: 'Gestionar Cuenta',
        updateProfile: 'Actualiza tu perfil profesional y configuraciones',
        updateRequesterProfile: 'Actualiza tu perfil y preferencias de cuenta',
        profile: 'Perfil',
        services: 'Servicios',
        qualifications: 'Calificaciones',
        portfolio: 'Portafolio',
        preferences: 'Preferencias',
        profileImage: 'Imagen de Perfil',
        profileImageDesc: 'Sube una foto profesional de perfil',
        requesterProfileImageDesc: 'Sube una foto que te represente bien',
        coverImage: 'Imagen de Portada',
        coverImageDesc: 'Sube una imagen de portada para tu perfil',
        currentImage: 'Imagen Actual',
        manageServices: 'Gestionar Servicios',
        manageQualifications: 'Gestionar Calificaciones',
        managePortfolio: 'Gestionar Portafolio',
        addQualificationDocs: 'Agregar Documentos de Calificaciones',
        addCertifications: 'Agregar Certificaciones Empresariales',
        addWorkPhotos: 'Agregar Fotos de Trabajos',
        existingDocuments: 'Documentos Existentes',
        existingCertifications: 'Certificaciones Existentes',
        existingPhotos: 'Fotos Existentes',
        document: 'Documento',
        certification: 'Certificación',
        photoRemoved: 'Foto eliminada exitosamente',
        removeError: 'Error eliminando foto',
        loadError: 'Error cargando datos de cuenta',
        saveSuccess: 'Cambios guardados exitosamente',
        saveError: 'Error guardando cambios',
        accountInfo: 'Información de Cuenta',
        memberSince: 'Miembro Desde',
        verificationStatus: 'Estado de Verificación',
        verified: 'Verificado',
        pending: 'Pendiente',
        rejected: 'Rechazado',
        accountPreferences: 'Preferencias de Cuenta',
        communicationPrefs: 'Preferencias de Comunicación',
        emailNotifications: 'Notificaciones por email para nuevos mensajes',
        serviceUpdates: 'Actualizaciones de servicios y recomendaciones',
        marketingEmails: 'Emails de marketing y promociones',
        privacySettings: 'Configuraciones de Privacidad',
        profileVisible: 'Hacer mi perfil visible a proveedores de servicios',
        showActivity: 'Mostrar mi estado de actividad',
        requestPreferences: 'Preferencias de Solicitudes',
        preferredContactMethod: 'Método de Contacto Preferido',
        inAppChat: 'Chat en la app',
        email: 'Email',
        phone: 'Teléfono',
        responseTime: 'Tiempo de Respuesta Esperado',
        immediate: 'Inmediato (dentro de 1 hora)',
        sameDay: 'Mismo día (dentro de 8 horas)',
        nextDay: 'Día siguiente (dentro de 24 horas)',
        flexible: 'Flexible (dentro de 3 días)',
        safetyTrust: 'Seguridad y Confianza',
        identityVerified: 'Identidad verificada por ERTUNO',
        securePayments: 'Protección de pagos seguros',
        disputeResolution: 'Soporte para resolución de disputas'
      },
      profile: {
        notFound: 'Perfil no encontrado',
        notAvailable: 'Este perfil no está disponible o aún está bajo revisión.',
        loadError: 'Error cargando perfil',
        verified: 'Verificado',
        yearsExperience: 'años de experiencia',
        more: 'más',
        moreServices: 'más',
        contactProvider: 'Contactar Proveedor',
        requestQuote: 'Solicitar Cotización',
        about: 'Acerca de',
        services: 'Servicios',
        qualifications: 'Calificaciones',
        portfolio: 'Portafolio',
        serviceAreas: 'Áreas de Servicio',
        businessInfo: 'Información Empresarial',
        businessName: 'Nombre de Empresa',
        location: 'Ubicación',
        verifiedProvider: 'Proveedor Verificado',
        verificationDesc: 'Este proveedor ha sido verificado por ERTUNO. Todos los documentos y credenciales han sido verificados por autenticidad.',
        verifiedOn: 'Verificado el',
        serviceRequester: 'Solicitante de Servicios',
        sendMessage: 'Enviar Mensaje',
        stats: 'Estadísticas',
        requestsMade: 'Solicitudes Realizadas',
        averageRating: 'Calificación Promedio',
        completedJobs: 'Trabajos Completados',
        verifiedRequester: 'Solicitante Verificado',
        requesterVerificationDesc: 'Este usuario ha sido verificado por ERTUNO. Los documentos de identidad han sido verificados por autenticidad.',
        trustSafety: 'Confianza y Seguridad',
        profileReviewed: 'Perfil Revisado',
        platformMember: 'Miembro de ERTUNO',
        contactInfo: 'Información de Contacto',
        contactInfoDesc: 'Para proteger la privacidad del usuario, los detalles de contacto solo se comparten después de establecer una conexión profesional a través de ERTUNO.'
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
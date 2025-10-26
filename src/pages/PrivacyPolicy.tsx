import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Database, 
  Lock, 
  UserCheck, 
  Mail, 
  Trash2,
  Download,
  Eye,
  AlertCircle,
  Clock,
  Globe
} from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { BackButton } from '../components/ui/BackButton';

export const PrivacyPolicy: React.FC = () => {
  const { t } = useI18n();

  const dataTypes = [
    {
      icon: UserCheck,
      title: 'Dati di Identificazione',
      description: 'Nome, cognome, email, ruolo (citizen/provider/academic/researcher)',
      purpose: 'Creazione e gestione account utente, verifica identità'
    },
    {
      icon: Database,
      title: 'Dati di Profilazione Professionale',
      description: 'Competenze, esperienza, ubicazione, valutazioni, recensioni',
      purpose: 'Matching tra utenti, sistema di reputazione, miglioramento servizi'
    },
    {
      icon: Mail,
      title: 'Comunicazioni e Messaggi',
      description: 'Chat, richieste servizi, notifiche, corrispondenza',
      purpose: 'Facilitazione comunicazione, supporto clienti, risoluzione dispute'
    },
    {
      icon: Globe,
      title: 'Dati Tecnici di Navigazione',
      description: 'Cookie, indirizzo IP, tipo browser, dispositivo utilizzato',
      purpose: 'Sicurezza, prestazioni, analytics anonimi, personalizzazione esperienza'
    }
  ];

  const userRights = [
    {
      icon: Eye,
      right: 'Diritto di Accesso (Art. 15 GDPR)',
      description: 'Puoi richiedere una copia di tutti i tuoi dati personali che trattiamo'
    },
    {
      icon: Download,
      right: 'Diritto alla Portabilità (Art. 20 GDPR)',
      description: 'Puoi esportare i tuoi dati in formato strutturato e leggibile'
    },
    {
      icon: Trash2,
      right: 'Diritto alla Cancellazione (Art. 17 GDPR)',
      description: 'Puoi richiedere la cancellazione completa dei tuoi dati personali'
    },
    {
      icon: Lock,
      right: 'Diritto di Rettifica (Art. 16 GDPR)',
      description: 'Puoi correggere o aggiornare i tuoi dati personali in qualsiasi momento'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 pt-20">
      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-12 h-12 text-teal-400 mr-4" />
              <h1 className="text-4xl lg:text-5xl font-bold text-white">
                Privacy Policy
              </h1>
            </div>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed">
              Informativa sulla Privacy ai sensi del GDPR (Regolamento UE 2016/679) e D.lgs. 196/2003
            </p>
            <div className="mt-4 text-sm text-slate-300">
              <p><strong>Ultimo aggiornamento:</strong> 26 Ottobre 2025</p>
              <p><strong>Versione:</strong> 1.0</p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* Back Navigation */}
        <div className="mb-8">
          <BackButton />
        </div>
        
        {/* Data Controller Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <UserCheck className="w-6 h-6 mr-3 text-teal-400" />
            Titolare del Trattamento
          </h2>
          <div className="text-slate-200 space-y-3">
            <p><strong>ERTUNO S.r.l.</strong></p>
            <p>Sede Legale: Via delle Innovazioni, 123 - 20100 Milano (MI), Italia</p>
            <p>P.IVA: IT12345678901</p>
            <p>Email DPO: privacy@ertuno.com</p>
            <p>Telefono: +39 02 1234 5678</p>
          </div>
        </motion.section>

        {/* Data Collection Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Quali Dati Raccogliamo e Perché
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {dataTypes.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-orange-500 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="text-slate-300 mb-3 text-sm">{item.description}</p>
                  <div className="border-t border-white/20 pt-3">
                    <p className="text-xs text-teal-300"><strong>Finalità:</strong> {item.purpose}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Legal Basis Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12 bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Lock className="w-6 h-6 mr-3 text-teal-400" />
            Base Giuridica del Trattamento
          </h2>
          <div className="text-slate-200 space-y-4">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <strong>Consenso (Art. 6.1.a GDPR):</strong> Per marketing, newsletter e comunicazioni promozionali
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <strong>Esecuzione del Contratto (Art. 6.1.b GDPR):</strong> Per erogare i servizi della piattaforma
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <strong>Interesse Legittimo (Art. 6.1.f GDPR):</strong> Per sicurezza, prevenzione frodi e miglioramento servizi
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <strong>Obbligo Legale (Art. 6.1.c GDPR):</strong> Per adempimenti fiscali e normativi
              </div>
            </div>
          </div>
        </motion.section>

        {/* User Rights Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            I Tuoi Diritti GDPR
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {userRights.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.right}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">{item.right}</h3>
                  </div>
                  <p className="text-slate-300 text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <div className="bg-teal-600/20 backdrop-blur-sm rounded-xl p-6 border border-teal-500/30">
              <h3 className="text-lg font-semibold text-white mb-3">Come Esercitare i Tuoi Diritti</h3>
              <p className="text-slate-200 mb-4">
                Puoi esercitare tutti i tuoi diritti GDPR contattandoci direttamente:
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-teal-300"><strong>Email DPO:</strong> privacy@ertuno.com</p>
                <p className="text-teal-300"><strong>Modulo Online:</strong> Account Settings → Privacy e Dati</p>
                <p className="text-slate-300">Tempo di risposta: <strong>massimo 30 giorni</strong> dalla richiesta</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Data Sharing and Security */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-12 bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Database className="w-6 h-6 mr-3 text-teal-400" />
            Condivisione Dati e Sicurezza
          </h2>
          <div className="text-slate-200 space-y-4">
            <div>
              <h3 className="font-semibold text-white mb-2">Condivisione con Terzi:</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Firebase/Google Cloud:</strong> Hosting e autenticazione (Privacy Shield certified)</li>
                <li>• <strong>Provider Email:</strong> Per notifiche e comunicazioni di servizio</li>
                <li>• <strong>Partner Accademici:</strong> Solo su consenso esplicito per collaborazioni</li>
                <li>• <strong>Mai venduti:</strong> I tuoi dati non sono mai venduti a terzi per scopi commerciali</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Misure di Sicurezza:</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Crittografia TLS 1.3:</strong> Tutte le comunicazioni sono criptate</li>
                <li>• <strong>Autenticazione Multi-Fattore:</strong> Protezione avanzata dell'account</li>
                <li>• <strong>Backup Crittografati:</strong> Sistemi di backup sicuri e ridondanti</li>
                <li>• <strong>Audit Regolari:</strong> Verifiche periodiche di sicurezza e conformità</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Data Retention */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-12 bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-3 text-teal-400" />
            Periodo di Conservazione
          </h2>
          <div className="text-slate-200 space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-400 mb-2">Account Attivi</div>
                <div className="text-sm">Per tutta la durata del rapporto contrattuale</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400 mb-2">Account Cancellati</div>
                <div className="text-sm">30 giorni per backup, poi eliminazione completa</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">Dati Fiscali</div>
                <div className="text-sm">10 anni per obblighi normativi</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact Information */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-teal-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Domande o Reclami?
            </h2>
            <p className="text-slate-200 mb-6 leading-relaxed">
              Per qualsiasi domanda su questa Privacy Policy o per esercitare i tuoi diritti GDPR:
            </p>
            <div className="space-y-3">
              <p className="text-teal-300"><strong>Data Protection Officer:</strong> privacy@ertuno.com</p>
              <p className="text-slate-300">
                <strong>Autorità di Controllo:</strong> Garante per la Protezione dei Dati Personali 
                (<a href="https://www.gpdp.it" className="text-teal-400 hover:underline">www.gpdp.it</a>)
              </p>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
};
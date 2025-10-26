import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Twitter, Youtube, Heart, Settings, Shield, User, Trash2, Clock } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { APP_CONFIG, SOCIAL_LINKS } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../hooks/useI18n';

interface FooterProps {
  theme: 'light' | 'dark';
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const { user } = useAuth();
  const { t } = useI18n();

  const socialIcons = [
    { name: 'Instagram', icon: Instagram, href: SOCIAL_LINKS.instagram },
    { name: 'LinkedIn', icon: Linkedin, href: SOCIAL_LINKS.linkedin },
    { name: 'Twitter', icon: Twitter, href: SOCIAL_LINKS.twitter },
    { name: 'YouTube', icon: Youtube, href: SOCIAL_LINKS.youtube },
  ];

  const footerLinks = {
    product: [
      { 
        name: 'Funzionalità', 
        href: '/features',
        description: 'Messaggistica live, marketplace dei servizi, verifica professionale — costruito per la collaborazione in tempo reale e la fiducia.',
        tagline: 'Live Messaging incontra Trusted Providers. Chat istantanea con professionisti verificati. Trova, chatta, risolvi. Tutto in un\'app.'
      },
      { 
        name: 'Prezzi', 
        href: '/pricing',
        description: 'Gratuito per i richiedenti. Commissioni per i provider. Trasparente, scalabile, amico del fondatore.'
      },
      { 
        name: 'API', 
        href: '/api',
        description: 'API RESTful per integrazioni di terze parti. Endpoint sicuri per pubblicazione lavori, ruoli utente e messaggistica.'
      },
      { 
        name: 'Documentazione', 
        href: '/docs',
        description: 'Guide tecniche, tutorial di integrazione e diagrammi di flusso backend per sviluppatori e architetti.'
      },
    ],
    company: [
      { 
        name: 'Chi Siamo', 
        href: '/about',
        description: 'Il sito sacro dove connessioni, trader e deal prosperano. ERTUNO è costruito su grinta siciliana e tecnologia globale.'
      },
      { 
        name: 'Blog', 
        href: '/blog',
        description: 'Storie di successo, approfondimenti del settore e aggiornamenti della piattaforma dal team ERTUNO.'
      },
      { 
        name: 'Carriere', 
        href: '/careers',
        description: 'Unisciti alla missione sacra. Opportunità remote e europee disponibili per costruttori, designer e strateghi.'
      },
      { 
        name: 'Contatti', 
        href: '/contact',
        description: 'Mettiti in contatto: hello@ertuno.com — rispondiamo velocemente e costruiamo insieme.'
      },
    ],
    legal: [
      { 
        name: 'Privacy Policy', 
        href: '/privacy',
        description: 'Protezione dei dati conforme al GDPR e privacy degli utenti. Non vendiamo mai i tuoi dati.'
      },
      { 
        name: 'Termini di Servizio', 
        href: '/terms',
        description: 'Termini di utilizzo della piattaforma e accordi di servizio.'
      },
      { 
        name: 'Cookie Policy', 
        href: '/cookies',
        description: 'Gestisci le preferenze. Usiamo i cookie per migliorare le prestazioni, non per tracciare.'
      },
      { 
        name: 'GDPR', 
        href: '/gdpr',
        description: 'Piena conformità alle leggi europee sulla protezione dei dati. I tuoi diritti sono rispettati.'
      },
    ],
  };

  // Dynamic Settings links based on user role
  const getSettingsLinks = () => {
    if (!user) return [];

    const baseSettings = [
      { name: t('settings.preferences'), href: '/settings/preferences', icon: User },
      { name: t('settings.security'), href: '/settings/security', icon: Shield },
      { name: t('settings.sessions'), href: '/settings/sessions', icon: Clock },
      { name: t('settings.delete'), href: '/settings/delete', icon: Trash2 },
    ];

    // Add role-specific settings
    const roleSettings = user.isProfessional 
      ? [{ name: t('settings.provider_dashboard'), href: '/settings/provider', icon: Settings }]
      : [{ name: t('settings.poster_dashboard'), href: '/settings/poster', icon: Settings }];

    return [
      { name: t('settings.role'), href: '/settings/role', icon: User },
      ...roleSettings,
      ...baseSettings,
    ];
  };

  const settingsLinks = getSettingsLinks();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className={`grid grid-cols-1 md:grid-cols-2 ${user ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} gap-8`}>
          {/* Brand Section */}
          <div className="lg:col-span-2">
            {/* ERTUNO Logo */}
            <Logo 
              variant={theme === 'dark' ? 'dark' : 'light'} 
              size="lg" 
              showText={true}
              showTagline={true}
              className="mb-6"
            />
            
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-6 mb-6">
              {APP_CONFIG.description}
            </p>
            
            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-orange-50 to-teal-50 dark:from-orange-900/20 dark:to-teal-900/20 rounded-lg p-4 mb-6 border border-orange-100 dark:border-orange-800/30">
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium italic">
                "Costruito su grinta siciliana e tecnologia globale — collegando il talento europeo con le opportunità attraverso legami sacri di fiducia e innovazione."
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div className="font-semibold mb-1">Mettiti in Contatto:</div>
                <div>📧 hello@ertuno.com</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Rispondiamo velocemente e costruiamo insieme
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialIcons.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">{social.name}</span>
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Prodotto
            </h3>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="block group"
                    whileHover={{ x: 2 }}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                      {link.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {link.description}
                    </div>
                    {/* Special tagline for Features section */}
                    {link.tagline && (
                      <div className="mt-2 p-2 bg-gradient-to-r from-orange-50 to-teal-50 dark:from-orange-900/20 dark:to-teal-900/20 rounded-lg border border-orange-100 dark:border-orange-800/30">
                        <div className="text-xs text-gray-700 dark:text-gray-300 font-medium italic leading-relaxed">
                          "{link.tagline}"
                        </div>
                      </div>
                    )}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Azienda
            </h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="block group"
                    whileHover={{ x: 2 }}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                      {link.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {link.description}
                    </div>
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Legale
            </h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="block group"
                    whileHover={{ x: 2 }}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                      {link.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {link.description}
                    </div>
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Settings Links - Only visible when user is logged in */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border-l-2 border-orange-200 dark:border-orange-800 pl-4"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Impostazioni
              </h3>
              
              {/* User Role Badge */}
              <div className="mb-4 p-2 bg-gradient-to-r from-orange-50 to-teal-50 dark:from-orange-900/20 dark:to-teal-900/20 rounded-lg border border-orange-100 dark:border-orange-800/30">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${user.isProfessional ? 'bg-orange-500' : 'bg-teal-500'}`}></div>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                    {user.isProfessional ? t('settings.provider_account') : t('settings.seeker_account')}
                  </span>
                </div>
              </div>
              
              <ul className="space-y-3">
                {settingsLinks.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200 flex items-center space-x-2 group"
                      whileHover={{ x: 2 }}
                    >
                      <link.icon className="w-4 h-4 group-hover:text-primary-500" />
                      <span className="font-medium">{link.name}</span>
                    </motion.a>
                  </li>
                ))}
              </ul>
              
              {/* Quick Actions */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Out
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Section */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">10K+</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-teal-600 dark:text-teal-400">50K+</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Services Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">25+</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">European Cities</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">99.8%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Satisfaction Rate</div>
            </div>
          </div>
          
          {/* Copyright and Credits */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
              </p>
              <div className="text-gray-500 dark:text-gray-400 text-xs">
                🇪🇺 Proudly European | GDPR Compliant | Secure by Design
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                Made with <Heart className="w-4 h-4 mx-1 text-red-500" fill="currentColor" /> by the ERTUNO team
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                v{APP_CONFIG.version}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
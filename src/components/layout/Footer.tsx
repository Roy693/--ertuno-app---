import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Twitter, Youtube, Heart, Settings, Shield, User, Trash2, Clock } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { APP_CONFIG, SOCIAL_LINKS } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

interface FooterProps {
  theme: 'light' | 'dark';
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const socialIcons = [
    { name: 'Instagram', icon: Instagram, href: SOCIAL_LINKS.instagram },
    { name: 'LinkedIn', icon: Linkedin, href: SOCIAL_LINKS.linkedin },
    { name: 'Twitter', icon: Twitter, href: SOCIAL_LINKS.twitter },
    { name: 'YouTube', icon: Youtube, href: SOCIAL_LINKS.youtube },
  ];

  const footerLinks = {
    product: [
      { 
        name: 'Features', 
        href: '/features',
        description: 'Live messaging, service marketplace, professional verification — built for real-time collaboration and trust.'
      },
      { 
        name: 'Pricing', 
        href: '/pricing',
        description: 'Free for seekers. Commission-based for providers. Transparent, scalable, founder-friendly.'
      },
      { 
        name: 'API', 
        href: '/api',
        description: 'RESTful API for third-party integrations. Secure endpoints for job posting, user roles, and messaging.'
      },
      { 
        name: 'Documentation', 
        href: '/docs',
        description: 'Technical guides, integration tutorials, and backend flowcharts for developers and architects.'
      },
    ],
    company: [
      { 
        name: 'About', 
        href: '/about',
        description: 'The holy site where connections, traders, and deals flourish. ERTUNO is built on Sicilian grit and global tech.'
      },
      { 
        name: 'Blog', 
        href: '/blog',
        description: 'Success stories, industry insights, and platform updates from the ERTUNO team.'
      },
      { 
        name: 'Careers', 
        href: '/careers',
        description: 'Join the sacred mission. Remote and European opportunities available for builders, designers, and strategists.'
      },
      { 
        name: 'Contact', 
        href: '/contact',
        description: 'Get in touch: hello@ertuno.com — we respond fast and build together.'
      },
    ],
    legal: [
      { 
        name: 'Privacy Policy', 
        href: '/privacy',
        description: 'GDPR-compliant data protection and user privacy. We never sell your data.'
      },
      { 
        name: 'Terms of Service', 
        href: '/terms',
        description: 'Platform usage terms and service agreements.'
      },
      { 
        name: 'Cookie Policy', 
        href: '/cookies',
        description: 'Manage preferences. We use cookies to improve performance, not to track.'
      },
      { 
        name: 'GDPR', 
        href: '/gdpr',
        description: 'Full compliance with European data protection laws. Your rights are respected.'
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
                "Built on Sicilian grit and global tech — connecting European talent with opportunity through sacred bonds of trust and innovation."
              </p>
            </div>
            
            {/* Contact Info */}
            <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div className="font-semibold mb-1">Connect With Us:</div>
                <div>📧 hello@ertuno.com</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  We respond fast and build together
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
              Product
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
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Company
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
              Legal
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
                {t('settings.title')}
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
import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Twitter, Youtube, Heart } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { APP_CONFIG, SOCIAL_LINKS } from '../../utils/constants';

interface FooterProps {
  theme: 'light' | 'dark';
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const socialIcons = [
    { name: 'Instagram', icon: Instagram, href: SOCIAL_LINKS.instagram },
    { name: 'LinkedIn', icon: Linkedin, href: SOCIAL_LINKS.linkedin },
    { name: 'Twitter', icon: Twitter, href: SOCIAL_LINKS.twitter },
    { name: 'YouTube', icon: Youtube, href: SOCIAL_LINKS.youtube },
  ];

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'API', href: '/api' },
      { name: 'Documentation', href: '/docs' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
    ],
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Logo 
              variant={theme === 'dark' ? 'dark' : 'light'} 
              size="lg" 
            />
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm leading-6">
              {APP_CONFIG.description}
            </p>
            
            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
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
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200"
                    whileHover={{ x: 2 }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200"
                    whileHover={{ x: 2 }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200"
                    whileHover={{ x: 2 }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
          </p>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 md:mt-0 flex items-center">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" fill="currentColor" /> by the ERTUNO team
          </p>
        </motion.div>
      </div>
    </footer>
  );
};
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { LanguageSelector } from '../ui/LanguageSelector';
import { NAV_ITEMS } from '../../utils/constants';
import { useLanguage } from '../../hooks/useLanguage';

interface HeaderProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  theme: 'light' | 'dark';
  onThemeChange: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLoginClick,
  onSignupClick,
  theme,
  onThemeChange
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo 
            variant={theme === 'dark' ? 'dark' : 'light'} 
            size="md" 
          />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t(item.key)}
              </motion.a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <LanguageSelector variant="minimal" />

            {/* Theme Toggle */}
            <motion.button
              onClick={onThemeChange}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Auth Buttons */}
            <Button variant="ghost" onClick={onLoginClick}>
              {t('auth.signin')}
            </Button>
            <Button variant="primary" onClick={onSignupClick}>
              {t('auth.getstarted')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300"
            onClick={toggleMenu}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 py-4 space-y-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          {/* Mobile Navigation */}
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {t(item.key)}
            </a>
          ))}

          {/* Mobile Language Selector */}
          <LanguageSelector variant="mobile" />

          {/* Mobile Theme Toggle */}
          <button
            onClick={onThemeChange}
            className="flex items-center w-full text-left text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2 transition-colors duration-200"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="ghost" fullWidth onClick={onLoginClick}>
              {t('auth.signin')}
            </Button>
            <Button variant="primary" fullWidth onClick={onSignupClick}>
              {t('auth.getstarted')}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
};
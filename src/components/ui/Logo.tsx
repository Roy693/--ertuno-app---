import React from 'react';
import { motion } from 'framer-motion';
import { APP_CONFIG } from '../../utils/constants';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showText = true,
  className = '',
  showTagline = false
}) => {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', tagline: 'text-xs' },
    md: { icon: 'w-8 h-8', text: 'text-xl', tagline: 'text-sm' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', tagline: 'text-base' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', tagline: 'text-lg' },
  };

  const colors = {
    light: {
      text: 'text-gray-900',
      tagline: 'text-gray-600',
      gradient: 'from-orange-600 via-orange-500 to-teal-500'
    },
    dark: {
      text: 'text-white',
      tagline: 'text-gray-300',
      gradient: 'from-orange-400 via-orange-300 to-teal-400'
    }
  };

  return (
    <motion.div
      className={`inline-flex items-center ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ERTUNO Premium Logo */}
      <motion.div
        className={`${sizes[size].icon} mr-3 flex-shrink-0`}
        whileHover={{ scale: 1.05, rotate: 2 }}
        transition={{ duration: 0.3 }}
      >
        <img 
          src="/assets/ertuno-logo.png" 
          alt="ERTUNO - Creative Collaboration Platform"
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Text Content */}
      {showText && (
        <div className="flex flex-col">
          <motion.span
            className={`font-display font-bold ${sizes[size].text} ${colors[variant].text} leading-tight`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className={`bg-gradient-to-r ${colors[variant].gradient} bg-clip-text text-transparent`}>
              {APP_CONFIG.name}
            </span>
          </motion.span>
          
          {showTagline && (
            <motion.span
              className={`${sizes[size].tagline} ${colors[variant].tagline} font-medium mt-1`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {APP_CONFIG.tagline}
            </motion.span>
          )}
        </div>
      )}
    </motion.div>
  );
};
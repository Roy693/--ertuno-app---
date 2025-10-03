import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showText = true,
  className = ''
}) => {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg' },
    md: { icon: 'w-8 h-8', text: 'text-xl' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl' },
  };

  const colors = {
    light: {
      icon: 'text-primary-500',
      text: 'text-gray-900',
      gradient: 'from-primary-500 via-accent-500 to-secondary-500'
    },
    dark: {
      icon: 'text-primary-400',
      text: 'text-white',
      gradient: 'from-primary-400 via-accent-400 to-secondary-400'
    }
  };

  return (
    <motion.div
      className={`inline-flex items-center ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon/Symbol */}
      <motion.div
        className={`${sizes[size].icon} ${colors[variant].icon} mr-2`}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.8 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
          {/* ERTUNO Abstract Icon - Interconnected nodes forming an "E" */}
          <defs>
            <linearGradient id={`gradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#facc15" />
            </linearGradient>
          </defs>
          
          {/* Main structure - Abstract "E" with connected nodes */}
          <circle cx="20" cy="25" r="4" fill={`url(#gradient-${variant})`} />
          <circle cx="45" cy="25" r="4" fill={`url(#gradient-${variant})`} />
          <circle cx="70" cy="25" r="4" fill={`url(#gradient-${variant})`} />
          
          <circle cx="20" cy="50" r="4" fill={`url(#gradient-${variant})`} />
          <circle cx="45" cy="50" r="4" fill={`url(#gradient-${variant})`} />
          
          <circle cx="20" cy="75" r="4" fill={`url(#gradient-${variant})`} />
          <circle cx="45" cy="75" r="4" fill={`url(#gradient-${variant})`} />
          <circle cx="70" cy="75" r="4" fill={`url(#gradient-${variant})`} />
          
          {/* Connection lines */}
          <line x1="20" y1="25" x2="70" y2="25" stroke={`url(#gradient-${variant})`} strokeWidth="2" />
          <line x1="20" y1="50" x2="45" y2="50" stroke={`url(#gradient-${variant})`} strokeWidth="2" />
          <line x1="20" y1="75" x2="70" y2="75" stroke={`url(#gradient-${variant})`} strokeWidth="2" />
          <line x1="20" y1="25" x2="20" y2="75" stroke={`url(#gradient-${variant})`} strokeWidth="3" />
          
          {/* Additional connection nodes */}
          <line x1="45" y1="25" x2="45" y2="75" stroke={`url(#gradient-${variant})`} strokeWidth="1" opacity="0.5" />
          <line x1="20" y1="50" x2="70" y2="25" stroke={`url(#gradient-${variant})`} strokeWidth="1" opacity="0.3" />
        </svg>
      </motion.div>

      {/* Text */}
      {showText && (
        <motion.span
          className={`font-display font-bold ${sizes[size].text} ${colors[variant].text}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className={`bg-gradient-to-r ${colors[variant].gradient} bg-clip-text text-transparent`}>
            ERTUNO
          </span>
        </motion.span>
      )}
    </motion.div>
  );
};
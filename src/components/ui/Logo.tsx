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
          {/* ERTUNO Tuno Fruit Icon */}
          <defs>
            <linearGradient id={`tunoGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4757" />
              <stop offset="50%" stopColor="#FF6B35" />
              <stop offset="100%" stopColor="#FFA502" />
            </linearGradient>
          </defs>
          
          {/* Tuno Fruit Body */}
          <ellipse cx="50" cy="55" rx="25" ry="30" fill={`url(#tunoGradient-${variant})`} />
          
          {/* Texture dots pattern */}
          <circle cx="40" cy="40" r="2" fill="#E55A4E" opacity="0.6" />
          <circle cx="60" cy="38" r="2" fill="#E55A4E" opacity="0.6" />
          <circle cx="35" cy="55" r="2" fill="#E55A4E" opacity="0.6" />
          <circle cx="65" cy="52" r="2" fill="#E55A4E" opacity="0.6" />
          <circle cx="42" cy="70" r="2" fill="#E55A4E" opacity="0.6" />
          <circle cx="58" cy="72" r="2" fill="#E55A4E" opacity="0.6" />
          
          {/* Green leaf accent */}
          <path d="M50 20 C45 15, 35 20, 35 30 C35 40, 45 45, 50 40 C55 45, 65 40, 65 30 C65 20, 55 15, 50 20 Z" fill="#4CAF50" />
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
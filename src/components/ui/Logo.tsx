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
      text: 'text-ertuno-navy',
      tagline: 'text-gray-600',
      gradient: 'from-ertuno-orange via-ertuno-light-orange to-ertuno-teal'
    },
    dark: {
      text: 'text-white',
      tagline: 'text-slate-300',
      gradient: 'from-ertuno-light-orange via-orange-400 to-ertuno-light-teal'
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
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Definitions for 3D gradients and shadows */}
          <defs>
            {/* Navy Circle Gradient - 3D effect */}
            <radialGradient id="navyGradient" cx="0.3" cy="0.3" r="0.8">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
            
            {/* Teal Circle Gradient - 3D effect */}
            <radialGradient id="tealGradient" cx="0.3" cy="0.3" r="0.8">
              <stop offset="0%" stopColor="#5eead4" />
              <stop offset="40%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#0f766e" />
            </radialGradient>
            
            {/* Orange Circle Gradient - 3D effect */}
            <radialGradient id="orangeGradient" cx="0.3" cy="0.3" r="0.8">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="40%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>
            
            {/* Connection Lines Gradient */}
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            
            {/* Drop Shadow Filter */}
            <filter id="dropshadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
              <feOffset dx="2" dy="4" result="offset" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3"/>
              </feComponentTransfer>
              <feMerge> 
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/> 
              </feMerge>
            </filter>
          </defs>

          {/* Background subtle glow */}
          <circle cx="60" cy="60" r="55" fill="url(#tealGradient)" opacity="0.1" />

          {/* Connection Lines - Behind circles */}
          <g opacity="0.8">
            <line x1="35" y1="45" x2="85" y2="75" stroke="url(#connectionGradient)" strokeWidth="3" strokeLinecap="round" />
            <line x1="60" y1="25" x2="60" y2="95" stroke="url(#connectionGradient)" strokeWidth="3" strokeLinecap="round" />
            <line x1="85" y1="45" x2="35" y2="75" stroke="url(#connectionGradient)" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Main Circles with 3D effect and shadows */}
          <g filter="url(#dropshadow)">
            {/* Top Circle - Navy */}
            <circle cx="60" cy="30" r="18" fill="url(#navyGradient)" />
            
            {/* Bottom Left Circle - Teal */}
            <circle cx="35" cy="75" r="18" fill="url(#tealGradient)" />
            
            {/* Bottom Right Circle - Orange */}
            <circle cx="85" cy="75" r="18" fill="url(#orangeGradient)" />
          </g>

          {/* Highlight dots for extra 3D effect */}
          <g opacity="0.6">
            <circle cx="55" cy="25" r="3" fill="#e2e8f0" />
            <circle cx="30" cy="70" r="3" fill="#f0fdfa" />
            <circle cx="80" cy="70" r="3" fill="#fff7ed" />
          </g>

          {/* Central connection node */}
          <circle cx="60" cy="60" r="4" fill="url(#connectionGradient)" opacity="0.8" />
        </svg>
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
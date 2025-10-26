import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  className = '', 
  label = 'Indietro' 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-ertuno-navy dark:hover:text-white bg-white/10 hover:bg-white/20 border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 backdrop-blur-sm ${className}`}
      whileHover={{ scale: 1.05, x: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </motion.button>
  );
};
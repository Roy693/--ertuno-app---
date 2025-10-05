import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Smartphone, 
  CheckCircle, 
  X, 
  Share, 
  Plus,
  AlertCircle,
  Loader
} from 'lucide-react';
import { Button } from './Button';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'primary',
  size = 'md',
  showText = true,
  className = ''
}) => {
  const { 
    canShowInstallButton, 
    isInstalling, 
    isInstalled, 
    isStandalone,
    platform,
    installPWA, 
    getIOSInstructions 
  } = usePWAInstall();
  
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [installMessage, setInstallMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInstall = async () => {
    if (platform === 'ios') {
      setShowIOSInstructions(true);
      return;
    }

    const result = await installPWA();
    
    if (result.success) {
      setInstallMessage({ type: 'success', text: 'App installed successfully!' });
    } else {
      if (result.error === 'ios_manual_install') {
        setShowIOSInstructions(true);
      } else {
        setInstallMessage({ type: 'error', text: result.error || 'Installation failed' });
      }
    }

    // Clear message after 3 seconds
    setTimeout(() => setInstallMessage(null), 3000);
  };

  // Don't show button if already installed or running in standalone mode
  if (isInstalled || isStandalone) {
    return null;
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleInstall}
        disabled={isInstalling || (!canShowInstallButton && platform !== 'ios')}
        className={className}
      >
        {isInstalling ? (
          <Loader className="w-5 h-5 mr-2 animate-spin" />
        ) : (
          <Download className="w-5 h-5 mr-2" />
        )}
        
        {showText && (
          <>
            {isInstalling ? 'Installing...' : platform === 'ios' ? 'Add to Home Screen' : 'Install App'}
          </>
        )}
      </Button>

      {/* Installation Message */}
      <AnimatePresence>
        {installMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              installMessage.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            <div className="flex items-center">
              {installMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {installMessage.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Instructions Modal */}
      <AnimatePresence>
        {showIOSInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowIOSInstructions(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 m-4 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Smartphone className="w-6 h-6 mr-2 text-blue-500" />
                  Add to Home Screen
                </h3>
                <button
                  onClick={() => setShowIOSInstructions(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  To install ERTUNO on your iPhone or iPad:
                </p>
                
                <ol className="space-y-3">
                  {getIOSInstructions().map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {instruction}
                        {index === 1 && (
                          <Share className="w-4 h-4 inline ml-1 text-blue-500" />
                        )}
                        {index === 2 && (
                          <Plus className="w-4 h-4 inline ml-1 text-green-500" />
                        )}
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 text-xs">
                    💡 Note: This only works in Safari browser. If you're using Chrome or another browser, 
                    please open this page in Safari first.
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setShowIOSInstructions(false)}
                >
                  Got it!
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
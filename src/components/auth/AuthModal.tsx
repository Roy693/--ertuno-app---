import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    role: 'citizen' as 'citizen' | 'provider' | 'academic' | 'researcher'
  });

  const { signIn, signUp, signInWithGoogle, signInWithFacebook, loading, error, clearError } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password);
        // Success for login - user will be redirected by auth state change
      } else {
        await signUp(formData.email, formData.password, formData.name, formData.role);
        // Success for signup - show welcome message
        setTimeout(() => {
          console.log('✅ Registration successful!', { 
            email: formData.email, 
            name: formData.name, 
            role: formData.role 
          });
        }, 100);
      }
      
      // Close modal on success - dashboard redirect will be handled by auth state
      onClose();
    } catch (error) {
      // Error is handled by useAuth hook and displayed in UI
      console.error('❌ Authentication failed:', error);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithFacebook();
      }
      onClose();
    } catch (error) {
      // Error is handled by useAuth hook
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setFormData({ 
      email: '', 
      password: '', 
      name: '', 
      confirmPassword: '',
      role: 'citizen'
    });
    clearError();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            {/* Logo and Title */}
            <div className="flex items-center justify-center mb-3">
              <Logo 
                variant="light" 
                size="md" 
                showText={false}
                className="mr-3"
              />
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                ERTUNO
              </h2>
            </div>
            
            {/* Welcome Text and Close Button */}
            <div className="flex items-center justify-between">
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </p>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Mock Mode Notice */}
            {import.meta.env.VITE_FIREBASE_API_KEY === 'demo-key-replace-with-real-firebase-key' && (
              <motion.div
                className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0">🚧</div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Demo Mode: Using mock authentication. All data is stored locally.
                </p>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </motion.div>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                fullWidth
                onClick={() => handleSocialAuth('google')}
                disabled={loading}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => handleSocialAuth('facebook')}
                disabled={loading}
              >
                <div className="w-5 h-5 bg-blue-600 rounded mr-2 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                Continue with Facebook
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      I want to:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`relative flex cursor-pointer rounded-lg border p-3 ${formData.role === 'citizen' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                        <input
                          type="radio"
                          name="role"
                          value="citizen"
                          checked={formData.role === 'citizen'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <div className="text-lg">🏠</div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">Find Services</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Hire professionals</div>
                            </div>
                          </div>
                        </div>
                      </label>
                      
                      <label className={`relative flex cursor-pointer rounded-lg border p-3 ${formData.role === 'provider' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                        <input
                          type="radio"
                          name="role"
                          value="provider"
                          checked={formData.role === 'provider'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <div className="text-lg">🔧</div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">Offer Services</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Provide professional services</div>
                            </div>
                          </div>
                        </div>
                      </label>
                      
                      <label className={`relative flex cursor-pointer rounded-lg border p-3 ${formData.role === 'academic' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                        <input
                          type="radio"
                          name="role"
                          value="academic"
                          checked={formData.role === 'academic'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <div className="text-lg">🎓</div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">Academic</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Professor/Institution</div>
                            </div>
                          </div>
                        </div>
                      </label>
                      
                      <label className={`relative flex cursor-pointer rounded-lg border p-3 ${formData.role === 'researcher' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                        <input
                          type="radio"
                          name="role"
                          value="researcher"
                          checked={formData.role === 'researcher'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <div className="text-lg">🔬</div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">Researcher</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">PhD/Research fellow</div>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Confirm your password"
                    />
                  </div>
                  {mode === 'signup' && formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading || (mode === 'signup' && formData.password !== formData.confirmPassword)}
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="ml-2 font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
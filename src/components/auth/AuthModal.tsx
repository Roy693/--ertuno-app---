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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    role: 'service_requester' as 'service_requester' | 'service_provider'
  });

  const { signIn, signUp, signInWithGoogle, signInWithFacebook, sendPasswordReset, loading, error, clearError } = useAuth();

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
      role: 'service_requester'
    });
    setShowForgotPassword(false);
    setPasswordResetSent(false);
    clearError();
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordReset(forgotPasswordEmail);
      setPasswordResetSent(true);
    } catch (error) {
      console.error('Error sending password reset:', error);
    }
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
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-4 max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            {/* Logo and Title */}
            <div className="flex items-center justify-center mb-2">
              <Logo 
                variant="light" 
                size="sm" 
                showText={false}
                className="mr-2"
              />
              <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                ERTUNO
              </h2>
            </div>
            
            {/* Welcome Text and Close Button */}
            <div className="flex items-center justify-between">
              <p className="text-base text-gray-700 dark:text-gray-300">
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
          <div className="px-4 py-4">
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
            <div className="space-y-2 mb-4">
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
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      I want to:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className={`relative flex cursor-pointer rounded-lg border p-2 ${formData.role === 'service_requester' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                        <input
                          type="radio"
                          name="role"
                          value="service_requester"
                          checked={formData.role === 'service_requester'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <div className="text-base">🏠</div>
                            <div className="ml-2">
                              <div className="text-xs font-medium text-gray-900 dark:text-white">Service Requester</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Find and hire professionals</div>
                            </div>
                          </div>
                        </div>
                      </label>
                      
                      <label className={`relative flex cursor-pointer rounded-lg border p-2 ${formData.role === 'service_provider' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600'}`}>
                        <input
                          type="radio"
                          name="role"
                          value="service_provider"
                          checked={formData.role === 'service_provider'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <div className="text-base">🔧</div>
                            <div className="ml-2">
                              <div className="text-xs font-medium text-gray-900 dark:text-white">Service Provider</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Offer professional services</div>
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

            {/* Forgot Password Link - Only show in login mode */}
            {mode === 'login' && !showForgotPassword && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Forgot Password Form */}
            {showForgotPassword && !passwordResetSent && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Reset Password
                </h3>
                <form onSubmit={handleForgotPassword}>
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-600 dark:text-white text-sm mb-3"
                    required
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      Send Reset Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Password Reset Success Message */}
            {passwordResetSent && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Password reset email sent! Check your inbox.
                </p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setPasswordResetSent(false);
                    setForgotPasswordEmail('');
                  }}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  Back to login
                </button>
              </div>
            )}

            {/* Toggle Mode */}
            <div className="mt-4 text-center">
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
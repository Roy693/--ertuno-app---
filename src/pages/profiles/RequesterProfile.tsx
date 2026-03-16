import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  CheckCircle, 
  Mail,
  Calendar,
  AlertCircle,
  ArrowLeft,
  Star
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { useI18n } from '../../hooks/useI18n';
import { useTheme } from '../../hooks/useTheme';
import { KycService, RequesterKycData } from '../../services/kycService';

export const RequesterProfile: React.FC = () => {
  const { requesterId } = useParams<{ requesterId: string }>();
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [requester, setRequester] = useState<RequesterKycData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadRequester = async () => {
      if (!requesterId) return;

      try {
        setLoading(true);
        const data = await KycService.getPublicRequesterProfile(requesterId);
        
        if (!data || data.verification_status !== 'approved') {
          setError(t('profile.notFound', 'Profile not found or not yet approved'));
          return;
        }

        setRequester(data);
      } catch (error) {
        console.error('Error loading requester profile:', error);
        setError(t('profile.loadError', 'Error loading profile'));
      } finally {
        setLoading(false);
      }
    };

    loadRequester();
  }, [requesterId, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('common.loading', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  if (error || !requester) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header
          onLoginClick={() => {}}
          onSignupClick={() => {}}
          theme={theme as 'light' | 'dark'}
          onThemeChange={toggleTheme}
        />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('profile.notFound', 'Profile Not Found')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || t('profile.notAvailable', 'This profile is not available or still under review.')}
            </p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.back', 'Back')}
            </Button>
          </div>
        </div>
        <Footer theme={theme as 'light' | 'dark'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        onLoginClick={() => {}}
        onSignupClick={() => {}}
        theme={theme as 'light' | 'dark'}
        onThemeChange={toggleTheme}
      />

      {/* Profile Header Section */}
      <div className="relative pt-16">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Image */}
                <div className="relative">
                  {requester.profile_image ? (
                    <img
                      src={requester.profile_image}
                      alt={requester.full_name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-lg">
                      <User className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                    </div>
                  )}
                  
                  {/* Verification Badge */}
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white dark:border-gray-700">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {requester.full_name}
                    </h1>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {t('profile.verified', 'Verified')}
                    </span>
                  </div>

                  <div className="flex items-center justify-center md:justify-start text-gray-600 dark:text-gray-400 mb-4">
                    <User className="w-4 h-4 mr-2" />
                    {t('profile.serviceRequester', 'Service Requester')}
                  </div>

                  <div className="flex items-center justify-center md:justify-start text-gray-600 dark:text-gray-400 mb-6">
                    <Calendar className="w-4 h-4 mr-2" />
                    {t('profile.memberSince', 'Member since')} {new Date(requester.created_at).toLocaleDateString()}
                  </div>

                  {/* Contact Action */}
                  <div className="flex justify-center md:justify-start">
                    <Button className="w-full md:w-auto">
                      <Mail className="w-4 h-4 mr-2" />
                      {t('profile.sendMessage', 'Send Message')}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('profile.about', 'About')} {requester.full_name}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {requester.description}
              </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('profile.stats', 'Stats')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('profile.requestsMade', 'Requests Made')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('profile.averageRating', 'Average Rating')}</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="font-semibold text-gray-900 dark:text-white">-</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('profile.completedJobs', 'Completed Jobs')}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">0</span>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                  {t('profile.verifiedRequester', 'Verified Requester')}
                </h3>
              </div>
              <p className="text-sm text-green-700 dark:text-green-200">
                {t('profile.requesterVerificationDesc', 'This user has been verified by ERTUNO. Identity documents have been checked for authenticity.')}
              </p>
              <div className="mt-3 text-xs text-green-600 dark:text-green-300">
                {t('profile.verifiedOn', 'Verified on')} {new Date(requester.updated_at).toLocaleDateString()}
              </div>
            </div>

            {/* Trust & Safety */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
                {t('profile.trustSafety', 'Trust & Safety')}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-blue-700 dark:text-blue-200">
                  <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                  {t('profile.identityVerified', 'Identity Verified')}
                </div>
                <div className="flex items-center text-sm text-blue-700 dark:text-blue-200">
                  <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                  {t('profile.profileReviewed', 'Profile Reviewed')}
                </div>
                <div className="flex items-center text-sm text-blue-700 dark:text-blue-200">
                  <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                  {t('profile.platformMember', 'ERTUNO Member')}
                </div>
              </div>
            </div>

            {/* Contact Info Notice */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {t('profile.contactInfo', 'Contact Information')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('profile.contactInfoDesc', 'To protect user privacy, contact details are only shared after establishing a professional connection through ERTUNO.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer theme={theme as 'light' | 'dark'} />
    </div>
  );
};
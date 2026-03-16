import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Award, 
  Clock, 
  CheckCircle, 
  Camera,
  Mail,
  Phone,
  Calendar,
  Users,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';
import { useI18n } from '../../hooks/useI18n';
import { useTheme } from '../../hooks/useTheme';
import { KycService, ProviderKycData } from '../../services/kycService';

export const ProviderProfile: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [provider, setProvider] = useState<ProviderKycData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadProvider = async () => {
      if (!providerId) return;

      try {
        setLoading(true);
        const data = await KycService.getPublicProviderProfile(providerId);
        
        if (!data || data.verification_status !== 'approved') {
          setError(t('profile.notFound', 'Profile not found or not yet approved'));
          return;
        }

        setProvider(data);
      } catch (error) {
        console.error('Error loading provider profile:', error);
        setError(t('profile.loadError', 'Error loading profile'));
      } finally {
        setLoading(false);
      }
    };

    loadProvider();
  }, [providerId, t]);

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

  if (error || !provider) {
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

      {/* Cover Image & Profile Section */}
      <div className="relative pt-16">
        {/* Cover Image */}
        <div className="h-64 md:h-80 relative overflow-hidden">
          {provider.cover_image ? (
            <img
              src={provider.cover_image}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary-500 to-primary-600" />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20" />
        </div>

        {/* Profile Info Overlay */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-32 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Image */}
              <div className="relative">
                {provider.profile_image ? (
                  <img
                    src={provider.profile_image}
                    alt={provider.type === 'private' ? provider.full_name : provider.business_name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-lg">
                    <Users className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                  </div>
                )}
                
                {/* Verification Badge */}
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white dark:border-gray-700">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {provider.type === 'private' ? provider.full_name : provider.business_name}
                  </h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {t('profile.verified', 'Verified')}
                  </span>
                </div>

                {provider.type === 'private' && provider.experience_years && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    {provider.experience_years} {t('profile.yearsExperience', 'years of experience')}
                  </div>
                )}

                {provider.work_area?.regions && provider.work_area.regions.length > 0 && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    {provider.work_area.regions.slice(0, 3).join(', ')}
                    {provider.work_area.regions.length > 3 && (
                      <span className="ml-1">+{provider.work_area.regions.length - 3} {t('profile.more', 'more')}</span>
                    )}
                  </div>
                )}

                {/* Services Preview */}
                {provider.services_offered && provider.services_offered.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {provider.services_offered.slice(0, 4).map((service, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300"
                      >
                        {service}
                      </span>
                    ))}
                    {provider.services_offered.length > 4 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        +{provider.services_offered.length - 4} {t('profile.moreServices', 'more')}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Actions */}
              <div className="flex flex-col space-y-3">
                <Button className="w-full md:w-auto">
                  <Mail className="w-4 h-4 mr-2" />
                  {t('profile.contactProvider', 'Contact Provider')}
                </Button>
                <Button variant="outline" className="w-full md:w-auto">
                  <Calendar className="w-4 h-4 mr-2" />
                  {t('profile.requestQuote', 'Request Quote')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('profile.about', 'About')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {provider.description}
              </p>
            </motion.div>

            {/* Services Section */}
            {provider.services_offered && provider.services_offered.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t('profile.services', 'Services')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {provider.services_offered.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">{service}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Qualifications Section */}
            {provider.qualifications?.text && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-500" />
                  {t('profile.qualifications', 'Qualifications')}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {provider.qualifications.text}
                </p>
              </motion.div>
            )}

            {/* Portfolio Section */}
            {provider.work_photos && provider.work_photos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-blue-500" />
                  {t('profile.portfolio', 'Portfolio')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {provider.work_photos.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
                    >
                      <img
                        src={photo}
                        alt={`Work ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Service Area */}
            {provider.work_area?.regions && provider.work_area.regions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-red-500" />
                  {t('profile.serviceAreas', 'Service Areas')}
                </h3>
                <div className="space-y-2">
                  {provider.work_area.regions.map((region, index) => (
                    <div key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-3" />
                      {region} ({provider.work_area?.radius_km}km)
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Information */}
            {provider.type === 'business' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {t('profile.businessInfo', 'Business Information')}
                </h3>
                <div className="space-y-3">
                  {provider.business_name && (
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">
                        {t('profile.businessName', 'Business Name')}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {provider.business_name}
                      </span>
                    </div>
                  )}
                  {provider.legal_address && (
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 block">
                        {t('profile.location', 'Location')}
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {provider.legal_address}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Verification Status */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                  {t('profile.verifiedProvider', 'Verified Provider')}
                </h3>
              </div>
              <p className="text-sm text-green-700 dark:text-green-200">
                {t('profile.verificationDesc', 'This provider has been verified by ERTUNO. All documents and credentials have been checked for authenticity.')}
              </p>
              <div className="mt-3 text-xs text-green-600 dark:text-green-300">
                {t('profile.verifiedOn', 'Verified on')} {new Date(provider.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer theme={theme as 'light' | 'dark'} />
    </div>
  );
};
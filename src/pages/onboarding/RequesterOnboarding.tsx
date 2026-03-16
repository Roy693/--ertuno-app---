import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Camera, 
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../hooks/useI18n';
import { KycService, RequesterKycData } from '../../services/kycService';

type RequesterStep = 'identity' | 'profile' | 'declaration' | 'submission';

export const RequesterOnboarding: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<RequesterStep>('identity');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Form State
  const [formData, setFormData] = useState<Partial<RequesterKycData>>({
    uid: user?.id || '',
    full_name: '',
    description: '',
    legal_declaration_accepted: false,
    verification_status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // File States
  const [identityFrontFiles, setIdentityFrontFiles] = useState<File[]>([]);
  const [identityBackFiles, setIdentityBackFiles] = useState<File[]>([]);
  const [selfieFiles, setSelfieFiles] = useState<File[]>([]);
  const [profileImageFiles, setProfileImageFiles] = useState<File[]>([]);

  const steps: RequesterStep[] = ['identity', 'profile', 'declaration', 'submission'];

  // Load existing data if any
  useEffect(() => {
    const loadExistingData = async () => {
      if (!user?.id) return;

      try {
        const data = await KycService.getRequesterKyc(user.id);
        if (data) {
          setFormData(data);
          
          // If already submitted, redirect to dashboard
          if (data.legal_declaration_accepted) {
            navigate('/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Error loading existing data:', error);
      }
    };

    loadExistingData();
  }, [user?.id, navigate]);

  const updateFormData = (updates: Partial<RequesterKycData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const validateCurrentStep = (): boolean => {
    setError('');

    switch (currentStep) {
      case 'identity':
        if (identityFrontFiles.length === 0) {
          setError(t('kyc.identityFrontRequired', 'Identity document front is required'));
          return false;
        }
        if (identityBackFiles.length === 0) {
          setError(t('kyc.identityBackRequired', 'Identity document back is required'));
          return false;
        }
        if (selfieFiles.length === 0) {
          setError(t('kyc.selfieRequired', 'Selfie verification is required'));
          return false;
        }
        return true;

      case 'profile':
        if (!formData.full_name?.trim()) {
          setError(t('kyc.fullNameRequired', 'Full name is required'));
          return false;
        }
        if (!formData.description?.trim()) {
          setError(t('kyc.descriptionRequired', 'Description is required'));
          return false;
        }
        return true;

      case 'declaration':
        if (!formData.legal_declaration_accepted) {
          setError(t('kyc.declarationRequired', 'Legal declaration must be accepted'));
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  const uploadFiles = async () => {
    if (!user?.id) throw new Error('User not authenticated');

    const uploads: Record<string, string> = {};

    if (identityFrontFiles.length > 0) {
      uploads.identity_front = await KycService.uploadFile(identityFrontFiles[0], 'identity', user.id);
    }
    if (identityBackFiles.length > 0) {
      uploads.identity_back = await KycService.uploadFile(identityBackFiles[0], 'identity', user.id);
    }
    if (selfieFiles.length > 0) {
      uploads.selfie_verification = await KycService.uploadFile(selfieFiles[0], 'selfie', user.id);
    }
    if (profileImageFiles.length > 0) {
      uploads.profile_image = await KycService.uploadFile(profileImageFiles[0], 'profile', user.id);
    }

    return uploads;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);
    setError('');

    try {
      // Upload all files
      const uploadedFiles = await uploadFiles();

      // Prepare final data
      const finalData: RequesterKycData = {
        ...formData as RequesterKycData,
        ...uploadedFiles,
        legal_declaration_timestamp: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to Firestore
      await KycService.saveRequesterKyc(finalData);

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Error submitting KYC:', error);
      setError(t('kyc.submissionError', 'Error submitting application. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'identity':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('kyc.identityVerification', 'Identity Verification')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t('kyc.requesterIdentityDesc', 'We need to verify your identity to ensure platform safety')}
              </p>
            </div>

            <div className="space-y-6">
              <FileUpload
                label={t('kyc.identityFront', 'Identity Document - Front')}
                description={t('kyc.identityFrontDesc', 'Upload the front side of your ID, passport, or driver license')}
                accept="image/*"
                uploadType="image"
                required
                files={identityFrontFiles}
                onFilesChange={setIdentityFrontFiles}
              />

              <FileUpload
                label={t('kyc.identityBack', 'Identity Document - Back')}
                description={t('kyc.identityBackDesc', 'Upload the back side of your ID or driver license')}
                accept="image/*"
                uploadType="image"
                required
                files={identityBackFiles}
                onFilesChange={setIdentityBackFiles}
              />

              <FileUpload
                label={t('kyc.selfieVerification', 'Selfie Verification')}
                description={t('kyc.selfieDesc', 'Take a clear selfie for facial recognition verification')}
                accept="image/*"
                uploadType="image"
                required
                files={selfieFiles}
                onFilesChange={setSelfieFiles}
              />
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('kyc.profileInformation', 'Profile Information')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t('kyc.requesterProfileDesc', 'Tell us a bit about yourself')}
              </p>
            </div>

            <div className="space-y-6">
              {/* Profile Image */}
              <FileUpload
                label={t('kyc.profileImage', 'Profile Image')}
                description={t('kyc.requesterProfileImageDesc', 'Upload a photo that represents you well')}
                accept="image/*"
                uploadType="image"
                files={profileImageFiles}
                onFilesChange={setProfileImageFiles}
                className="max-w-md mx-auto"
              />

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('kyc.fullName', 'Full Name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.full_name || ''}
                  onChange={(e) => updateFormData({ full_name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder={t('kyc.enterFullName', 'Enter your full name')}
                />
              </div>

              {/* Personal Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('kyc.personalDescription', 'Personal Description')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder={t('kyc.personalDescPlaceholder', 'Tell us about yourself, your interests, and what kind of services you might need...')}
                />
              </div>
            </div>
          </div>
        );

      case 'declaration':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('kyc.legalDeclaration', 'Legal Declaration')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t('kyc.declarationDesc', 'Please read and accept the following declaration')}
              </p>
            </div>

            {/* Simplified Declaration for Requesters */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {t('kyc.requesterDeclarationTitle', 'Service Requester Agreement')}
                  </p>
                  
                  <p>
                    {t('kyc.requesterDeclarationText', 'I hereby declare that:')}
                  </p>
                  
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('kyc.requesterDeclaration1', 'All personal information provided is accurate and truthful')}</li>
                    <li>{t('kyc.requesterDeclaration2', 'I am authorized to use this account and request services')}</li>
                    <li>{t('kyc.requesterDeclaration3', 'I will conduct myself professionally when requesting services')}</li>
                    <li>{t('kyc.requesterDeclaration4', 'I understand ERTUNO is a platform connecting users and is not responsible for service quality')}</li>
                    <li>{t('kyc.requesterDeclaration5', 'I agree to resolve disputes amicably and follow platform guidelines')}</li>
                  </ul>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      {t('kyc.requesterWarningText', 'False information may result in account suspension. ERTUNO reserves the right to verify provided information.')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Acceptance Checkbox */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="legal-declaration"
                checked={formData.legal_declaration_accepted || false}
                onChange={(e) => updateFormData({ legal_declaration_accepted: e.target.checked })}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="legal-declaration" className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">
                  {t('kyc.acceptDeclaration', 'I accept the legal declaration')} <span className="text-red-500">*</span>
                </span>
                <br />
                <span className="text-gray-600 dark:text-gray-400">
                  {t('kyc.acceptanceNote', 'By checking this box, I confirm that I have read, understood, and agree to all the terms stated above.')}
                </span>
              </label>
            </div>
          </div>
        );

      case 'submission':
        return (
          <div className="space-y-6 text-center">
            <div>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('kyc.readyToSubmit', 'Ready to Submit')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t('kyc.requesterSubmissionReview', 'Please review your information before completing your registration')}
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {t('kyc.registrationSummary', 'Registration Summary')}
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('kyc.fullName', 'Full Name')}:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formData.full_name || 'Not provided'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('kyc.identityDocs', 'Identity Documents')}:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    ✓ {t('kyc.uploaded', 'Uploaded')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('kyc.legalDeclaration', 'Legal Declaration')}:</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {formData.legal_declaration_accepted ? '✓ ' + t('kyc.accepted', 'Accepted') : t('kyc.notAccepted', 'Not Accepted')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {t('kyc.requesterSubmissionNote', 'After registration, you can immediately start browsing and requesting services from verified providers.')}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepNumber = (step: RequesterStep): number => steps.indexOf(step) + 1;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {t('kyc.notAuthenticated', 'Please log in to continue')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('kyc.requesterOnboarding', 'Service Requester Registration')}
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {getStepNumber(currentStep)} / {steps.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(getStepNumber(currentStep) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700 dark:text-red-300">{error}</span>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 'identity'}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('common.back', 'Back')}</span>
            </Button>

            {currentStep === 'submission' ? (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>{t('kyc.completing', 'Completing...')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('kyc.completeRegistration', 'Complete Registration')}</span>
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center space-x-2"
              >
                <span>{t('common.next', 'Next')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
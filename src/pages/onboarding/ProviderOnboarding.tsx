import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Building2, 
  Camera, 
  FileText, 
  MapPin, 
  Award,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { ServiceSelector } from '../../components/ui/ServiceSelector';
import { OnboardingSteps } from '../../components/onboarding/OnboardingSteps';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../hooks/useI18n';
import { KycService, ProviderKycData } from '../../services/kycService';

type Step = 'type' | 'identity' | 'profile' | 'services' | 'work_area' | 'declaration' | 'submission';

export const ProviderOnboarding: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [existingData, setExistingData] = useState<ProviderKycData | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<ProviderKycData>>({
    uid: user?.id || '',
    type: undefined,
    services_offered: [],
    description: '',
    work_area: { regions: [], radius_km: 25 },
    qualifications: { text: '', documents: [] },
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
  const [coverImageFiles, setCoverImageFiles] = useState<File[]>([]);
  const [representativeIdFiles, setRepresentativeIdFiles] = useState<File[]>([]);
  const [businessDocFiles, setBusinessDocFiles] = useState<File[]>([]);
  const [certificationFiles, setCertificationFiles] = useState<File[]>([]);
  const [qualificationFiles, setQualificationFiles] = useState<File[]>([]);
  const [workPhotoFiles, setWorkPhotoFiles] = useState<File[]>([]);

  const steps: Step[] = ['type', 'identity', 'profile', 'services', 'work_area', 'declaration', 'submission'];

  // Load existing data if any
  useEffect(() => {
    const loadExistingData = async () => {
      if (!user?.id) return;

      try {
        const data = await KycService.getProviderKyc(user.id);
        if (data) {
          setExistingData(data);
          setFormData(data);
          
          // If already submitted, redirect to dashboard
          if (data.verification_status !== 'pending' || data.legal_declaration_accepted) {
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

  const updateFormData = (updates: Partial<ProviderKycData>) => {
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
      case 'type':
        if (!formData.type) {
          setError(t('kyc.selectAccountType', 'Please select an account type'));
          return false;
        }
        return true;

      case 'identity':
        if (formData.type === 'private') {
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
        } else if (formData.type === 'business') {
          if (representativeIdFiles.length === 0) {
            setError(t('kyc.representativeIdRequired', 'Representative ID is required'));
            return false;
          }
          if (businessDocFiles.length === 0) {
            setError(t('kyc.businessDocRequired', 'Business document is required'));
            return false;
          }
        }
        return true;

      case 'profile':
        if (formData.type === 'private' && !formData.full_name?.trim()) {
          setError(t('kyc.fullNameRequired', 'Full name is required'));
          return false;
        }
        if (formData.type === 'business') {
          if (!formData.business_name?.trim()) {
            setError(t('kyc.businessNameRequired', 'Business name is required'));
            return false;
          }
          if (!formData.vat_number?.trim()) {
            setError(t('kyc.vatRequired', 'VAT number is required'));
            return false;
          }
          if (!formData.legal_address?.trim()) {
            setError(t('kyc.addressRequired', 'Legal address is required'));
            return false;
          }
        }
        if (!formData.description?.trim()) {
          setError(t('kyc.descriptionRequired', 'Description is required'));
          return false;
        }
        return true;

      case 'services':
        if (!formData.services_offered || formData.services_offered.length === 0) {
          setError(t('kyc.servicesRequired', 'At least one service must be selected'));
          return false;
        }
        return true;

      case 'work_area':
        if (!formData.work_area?.regions || formData.work_area.regions.length === 0) {
          setError(t('kyc.workAreaRequired', 'Work area is required'));
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

    // Helper function to upload single file
    const uploadFile = async (files: File[], path: string): Promise<string | undefined> => {
      if (files.length > 0) {
        return await KycService.uploadFile(files[0], path, user.id);
      }
    };

    // Helper function to upload multiple files
    const uploadMultiple = async (files: File[], path: string): Promise<string[]> => {
      if (files.length > 0) {
        return await KycService.uploadMultipleFiles(files, path, user.id);
      }
      return [];
    };

    // Upload based on account type
    if (formData.type === 'private') {
      uploads.identity_front = await uploadFile(identityFrontFiles, 'identity') || '';
      uploads.identity_back = await uploadFile(identityBackFiles, 'identity') || '';
      uploads.selfie_verification = await uploadFile(selfieFiles, 'selfie') || '';
    } else if (formData.type === 'business') {
      uploads.representative_identity = await uploadFile(representativeIdFiles, 'representative') || '';
      uploads.business_document = await uploadFile(businessDocFiles, 'business') || '';
    }

    // Common uploads
    uploads.profile_image = await uploadFile(profileImageFiles, 'profile') || '';
    uploads.cover_image = await uploadFile(coverImageFiles, 'cover') || '';
    
    const qualificationDocs = await uploadMultiple(qualificationFiles, 'qualifications');
    const workPhotos = await uploadMultiple(workPhotoFiles, 'work_photos');
    const certifications = await uploadMultiple(certificationFiles, 'certifications');

    return {
      ...uploads,
      qualificationDocs,
      workPhotos,
      certifications
    };
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);
    setError('');

    try {
      // Upload all files
      const uploadedFiles = await uploadFiles();

      // Prepare final data
      const finalData: ProviderKycData = {
        ...formData as ProviderKycData,
        ...uploadedFiles,
        work_photos: uploadedFiles.workPhotos || [],
        qualifications: {
          text: formData.qualifications?.text || '',
          documents: uploadedFiles.qualificationDocs || []
        },
        business_certifications: uploadedFiles.certifications || [],
        legal_declaration_timestamp: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to Firestore
      await KycService.saveProviderKyc(finalData);

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
      case 'type':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('kyc.accountType', 'Account Type')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t('kyc.selectAccountTypeDesc', 'Choose how you want to register as a service provider')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Private Account */}
              <motion.button
                type="button"
                onClick={() => updateFormData({ type: 'private' })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  formData.type === 'private'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${
                    formData.type === 'private' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    <User className="w-8 h-8" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('kyc.privateAccount', 'Private Individual')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {t('kyc.privateDesc', 'Register as an individual professional')}
                    </p>
                  </div>
                  
                  {formData.type === 'private' && (
                    <CheckCircle className="w-6 h-6 text-primary-500" />
                  )}
                </div>
              </motion.button>

              {/* Business Account */}
              <motion.button
                type="button"
                onClick={() => updateFormData({ type: 'business' })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  formData.type === 'business'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${
                    formData.type === 'business' 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    <Building2 className="w-8 h-8" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('kyc.businessAccount', 'Business/Company')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {t('kyc.businessDesc', 'Register as a business or company')}
                    </p>
                  </div>
                  
                  {formData.type === 'business' && (
                    <CheckCircle className="w-6 h-6 text-primary-500" />
                  )}
                </div>
              </motion.button>
            </div>
          </div>
        );

      case 'identity':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('kyc.identityVerification', 'Identity Verification')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t('kyc.identityDesc', 'Upload your identity documents for verification')}
              </p>
            </div>

            {formData.type === 'private' ? (
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
            ) : (
              <div className="space-y-6">
                <FileUpload
                  label={t('kyc.representativeId', 'Legal Representative ID')}
                  description={t('kyc.representativeIdDesc', 'Upload ID of the legal representative')}
                  accept="image/*,application/pdf"
                  uploadType="document"
                  required
                  files={representativeIdFiles}
                  onFilesChange={setRepresentativeIdFiles}
                />

                <FileUpload
                  label={t('kyc.businessDocument', 'Business Registration Document')}
                  description={t('kyc.businessDocDesc', 'Upload business registration, articles of incorporation, or equivalent')}
                  accept="image/*,application/pdf"
                  uploadType="document"
                  required
                  files={businessDocFiles}
                  onFilesChange={setBusinessDocFiles}
                />
              </div>
            )}
          </div>
        );

      // Continue with other steps...
      case 'profile':
      case 'services':
      case 'work_area':
      case 'declaration':
      case 'submission':
        return (
          <OnboardingSteps
            step={currentStep}
            formData={formData}
            updateFormData={updateFormData}
            profileImageFiles={profileImageFiles}
            setProfileImageFiles={setProfileImageFiles}
            coverImageFiles={coverImageFiles}
            setCoverImageFiles={setCoverImageFiles}
            qualificationFiles={qualificationFiles}
            setQualificationFiles={setQualificationFiles}
            workPhotoFiles={workPhotoFiles}
            setWorkPhotoFiles={setWorkPhotoFiles}
            certificationFiles={certificationFiles}
            setCertificationFiles={setCertificationFiles}
          />
        );

      default:
        return <div>Step content for {currentStep}</div>;
    }
  };

  const getStepNumber = (step: Step): number => steps.indexOf(step) + 1;

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('kyc.providerOnboarding', 'Service Provider Onboarding')}
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
              disabled={currentStep === 'type'}
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
                    <span>{t('kyc.submitting', 'Submitting...')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('kyc.submit', 'Submit Application')}</span>
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
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Camera, 
  Save, 
  Upload,
  Edit,
  Building2,
  Award,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Plus
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { ServiceSelector } from '../../components/ui/ServiceSelector';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../hooks/useI18n';
import { KycService, ProviderKycData } from '../../services/kycService';

export const ProviderAccount: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeSection, setActiveSection] = useState<'profile' | 'services' | 'qualifications' | 'portfolio'>('profile');
  
  // Form data state
  const [formData, setFormData] = useState<Partial<ProviderKycData>>({});
  
  // File states
  const [profileImageFiles, setProfileImageFiles] = useState<File[]>([]);
  const [coverImageFiles, setCoverImageFiles] = useState<File[]>([]);
  const [qualificationFiles, setQualificationFiles] = useState<File[]>([]);
  const [workPhotoFiles, setWorkPhotoFiles] = useState<File[]>([]);
  const [certificationFiles, setCertificationFiles] = useState<File[]>([]);

  const sections = [
    { id: 'profile', label: t('account.profile', 'Profile'), icon: User },
    { id: 'services', label: t('account.services', 'Services'), icon: FileText },
    { id: 'qualifications', label: t('account.qualifications', 'Qualifications'), icon: Award },
    { id: 'portfolio', label: t('account.portfolio', 'Portfolio'), icon: Camera }
  ] as const;

  useEffect(() => {
    const loadProviderData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const data = await KycService.getProviderKyc(user.id);
        if (data) {
          setFormData(data);
        }
      } catch (error) {
        console.error('Error loading provider data:', error);
        setMessage({ type: 'error', text: t('account.loadError', 'Error loading account data') });
      } finally {
        setLoading(false);
      }
    };

    loadProviderData();
  }, [user?.id, t]);

  const updateFormData = (updates: Partial<ProviderKycData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    setMessage(null);

    try {
      // Upload new files if any
      const uploads: Record<string, string> = {};

      if (profileImageFiles.length > 0) {
        uploads.profile_image = await KycService.uploadFile(profileImageFiles[0], 'profile', user.id);
      }

      if (coverImageFiles.length > 0) {
        uploads.cover_image = await KycService.uploadFile(coverImageFiles[0], 'cover', user.id);
      }

      const qualificationDocs = qualificationFiles.length > 0 
        ? await KycService.uploadMultipleFiles(qualificationFiles, 'qualifications', user.id)
        : undefined;

      const workPhotos = workPhotoFiles.length > 0
        ? await KycService.uploadMultipleFiles(workPhotoFiles, 'work_photos', user.id)
        : undefined;

      const certifications = certificationFiles.length > 0
        ? await KycService.uploadMultipleFiles(certificationFiles, 'certifications', user.id)
        : undefined;

      // Prepare update data
      const updateData: Partial<ProviderKycData> = {
        ...formData,
        ...uploads,
        updated_at: new Date().toISOString()
      };

      if (qualificationDocs) {
        updateData.qualifications = {
          text: formData.qualifications?.text || '',
          documents: [...(formData.qualifications?.documents || []), ...qualificationDocs]
        };
      }

      if (workPhotos) {
        updateData.work_photos = [...(formData.work_photos || []), ...workPhotos];
      }

      if (certifications) {
        updateData.business_certifications = [...(formData.business_certifications || []), ...certifications];
      }

      await KycService.updateProviderKyc(user.id, updateData);
      
      setMessage({ type: 'success', text: t('account.saveSuccess', 'Changes saved successfully') });
      
      // Clear file states after successful upload
      setProfileImageFiles([]);
      setCoverImageFiles([]);
      setQualificationFiles([]);
      setWorkPhotoFiles([]);
      setCertificationFiles([]);

      // Reload data to reflect changes
      const updatedData = await KycService.getProviderKyc(user.id);
      if (updatedData) {
        setFormData(updatedData);
      }

    } catch (error) {
      console.error('Error saving provider data:', error);
      setMessage({ type: 'error', text: t('account.saveError', 'Error saving changes') });
    } finally {
      setSaving(false);
    }
  };

  const removeWorkPhoto = async (photoUrl: string, index: number) => {
    if (!user?.id) return;

    try {
      // Remove from form data
      const updatedPhotos = formData.work_photos?.filter((_, i) => i !== index) || [];
      updateFormData({ work_photos: updatedPhotos });

      // Update in database
      await KycService.updateProviderKyc(user.id, {
        work_photos: updatedPhotos,
        updated_at: new Date().toISOString()
      });

      // Delete file from storage
      await KycService.deleteFile(photoUrl);

      setMessage({ type: 'success', text: t('account.photoRemoved', 'Photo removed successfully') });
    } catch (error) {
      console.error('Error removing photo:', error);
      setMessage({ type: 'error', text: t('account.removeError', 'Error removing photo') });
    }
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      {/* Profile Images */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <FileUpload
            label={t('account.profileImage', 'Profile Image')}
            description={t('account.profileImageDesc', 'Upload a professional profile photo')}
            accept="image/*"
            uploadType="image"
            files={profileImageFiles}
            onFilesChange={setProfileImageFiles}
          />
          {formData.profile_image && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('account.currentImage', 'Current Image')}:
              </p>
              <img
                src={formData.profile_image}
                alt="Current profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              />
            </div>
          )}
        </div>

        <div>
          <FileUpload
            label={t('account.coverImage', 'Cover Image')}
            description={t('account.coverImageDesc', 'Upload a cover image for your profile')}
            accept="image/*"
            uploadType="image"
            files={coverImageFiles}
            onFilesChange={setCoverImageFiles}
          />
          {formData.cover_image && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('account.currentImage', 'Current Image')}:
              </p>
              <img
                src={formData.cover_image}
                alt="Current cover"
                className="w-full h-20 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
              />
            </div>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid md:grid-cols-2 gap-6">
        {formData.type === 'private' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('kyc.fullName', 'Full Name')}
              </label>
              <input
                type="text"
                value={formData.full_name || ''}
                onChange={(e) => updateFormData({ full_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('kyc.experienceYears', 'Years of Experience')}
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.experience_years || ''}
                onChange={(e) => updateFormData({ experience_years: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('kyc.businessName', 'Business Name')}
              </label>
              <input
                type="text"
                value={formData.business_name || ''}
                onChange={(e) => updateFormData({ business_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('kyc.vatNumber', 'VAT Number')}
              </label>
              <input
                type="text"
                value={formData.vat_number || ''}
                onChange={(e) => updateFormData({ vat_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </>
        )}
      </div>

      {formData.type === 'business' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('kyc.legalAddress', 'Legal Address')}
          </label>
          <input
            type="text"
            value={formData.legal_address || ''}
            onChange={(e) => updateFormData({ legal_address: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {formData.type === 'private' ? t('kyc.professionalDescription', 'Professional Description') : t('kyc.businessDescription', 'Business Description')}
        </label>
        <textarea
          rows={4}
          value={formData.description || ''}
          onChange={(e) => updateFormData({ description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          placeholder={formData.type === 'private' ? t('kyc.professionalPlaceholder', 'Describe your professional experience and expertise...') : t('kyc.businessPlaceholder', 'Describe your business, services, and what makes you unique...')}
        />
      </div>

      {/* Work Area */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          {t('kyc.workArea', 'Work Area')}
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('kyc.workRegions', 'Service Regions')}
          </label>
          <input
            type="text"
            value={formData.work_area?.regions?.join(', ') || ''}
            onChange={(e) => updateFormData({ 
              work_area: {
                ...formData.work_area,
                regions: e.target.value.split(',').map(r => r.trim()).filter(r => r),
                radius_km: formData.work_area?.radius_km || 25
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder={t('kyc.regionsPlaceholder', 'e.g., Milan, Rome, Naples')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('kyc.serviceRadius', 'Service Radius (km)')}
          </label>
          <input
            type="number"
            min="1"
            max="200"
            value={formData.work_area?.radius_km || 25}
            onChange={(e) => updateFormData({ 
              work_area: {
                ...formData.work_area,
                regions: formData.work_area?.regions || [],
                radius_km: parseInt(e.target.value)
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
    </div>
  );

  const renderServicesSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t('account.manageServices', 'Manage Services')}
      </h3>
      
      <ServiceSelector
        selectedServices={formData.services_offered || []}
        onServicesChange={(services) => updateFormData({ services_offered: services })}
        maxSelections={15}
      />
    </div>
  );

  const renderQualificationsSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
        <Award className="w-5 h-5 mr-2" />
        {t('account.manageQualifications', 'Manage Qualifications')}
      </h3>

      {/* Qualifications Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('kyc.qualifications', 'Qualifications & Certifications')}
        </label>
        <textarea
          rows={4}
          value={formData.qualifications?.text || ''}
          onChange={(e) => updateFormData({ 
            qualifications: { 
              ...formData.qualifications,
              text: e.target.value,
              documents: formData.qualifications?.documents || []
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          placeholder={t('kyc.qualificationsPlaceholder', 'List your relevant qualifications, certifications, and training...')}
        />
      </div>

      {/* Upload New Qualifications */}
      <FileUpload
        label={t('account.addQualificationDocs', 'Add Qualification Documents')}
        description={t('kyc.qualificationDocsDesc', 'Upload certificates, diplomas, or other qualification documents')}
        accept="image/*,application/pdf"
        uploadType="document"
        multiple
        maxFiles={5}
        files={qualificationFiles}
        onFilesChange={setQualificationFiles}
      />

      {/* Existing Qualification Documents */}
      {formData.qualifications?.documents && formData.qualifications.documents.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
            {t('account.existingDocuments', 'Existing Documents')}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {formData.qualifications.documents.map((doc, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                  {t('account.document', 'Document')} {index + 1}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Business Certifications for business accounts */}
      {formData.type === 'business' && (
        <>
          <FileUpload
            label={t('account.addCertifications', 'Add Business Certifications')}
            description={t('kyc.certificationDesc', 'Upload any relevant business certifications')}
            accept="image/*,application/pdf"
            uploadType="document"
            multiple
            maxFiles={5}
            files={certificationFiles}
            onFilesChange={setCertificationFiles}
          />

          {formData.business_certifications && formData.business_certifications.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                {t('account.existingCertifications', 'Existing Certifications')}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.business_certifications.map((cert, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Award className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                      {t('account.certification', 'Certification')} {index + 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderPortfolioSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
        <Camera className="w-5 h-5 mr-2" />
        {t('account.managePortfolio', 'Manage Portfolio')}
      </h3>

      {/* Upload New Work Photos */}
      <FileUpload
        label={t('account.addWorkPhotos', 'Add Work Photos')}
        description={t('kyc.workPhotosDesc', 'Upload photos of your previous work to showcase your skills')}
        accept="image/*"
        uploadType="image"
        multiple
        maxFiles={10}
        files={workPhotoFiles}
        onFilesChange={setWorkPhotoFiles}
      />

      {/* Existing Work Photos */}
      {formData.work_photos && formData.work_photos.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
            {t('account.existingPhotos', 'Existing Photos')}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.work_photos.map((photo, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={photo}
                    alt={`Work ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeWorkPhoto(photo, index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('account.manageAccount', 'Manage Account')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('account.updateProfile', 'Update your professional profile and settings')}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              {/* Success/Error Messages */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 p-4 rounded-lg ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
                      : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center">
                    {message.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 mr-2" />
                    )}
                    {message.text}
                  </div>
                </motion.div>
              )}

              {/* Section Content */}
              {activeSection === 'profile' && renderProfileSection()}
              {activeSection === 'services' && renderServicesSection()}
              {activeSection === 'qualifications' && renderQualificationsSection()}
              {activeSection === 'portfolio' && renderPortfolioSection()}

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>{t('common.saving', 'Saving...')}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{t('common.save', 'Save Changes')}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
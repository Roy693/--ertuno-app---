import React from 'react';
import { motion } from 'framer-motion';
import { Award, MapPin, Shield, FileText } from 'lucide-react';
import { FileUpload } from '../../components/ui/FileUpload';
import { ServiceSelector } from '../../components/ui/ServiceSelector';
import { useI18n } from '../../hooks/useI18n';
import { ProviderKycData } from '../../services/kycService';

interface OnboardingStepProps {
  step: string;
  formData: Partial<ProviderKycData>;
  updateFormData: (updates: Partial<ProviderKycData>) => void;
  // File states
  profileImageFiles: File[];
  setProfileImageFiles: (files: File[]) => void;
  coverImageFiles: File[];
  setCoverImageFiles: (files: File[]) => void;
  qualificationFiles: File[];
  setQualificationFiles: (files: File[]) => void;
  workPhotoFiles: File[];
  setWorkPhotoFiles: (files: File[]) => void;
  certificationFiles: File[];
  setCertificationFiles: (files: File[]) => void;
}

export const OnboardingSteps: React.FC<OnboardingStepProps> = ({
  step,
  formData,
  updateFormData,
  profileImageFiles,
  setProfileImageFiles,
  coverImageFiles,
  setCoverImageFiles,
  qualificationFiles,
  setQualificationFiles,
  workPhotoFiles,
  setWorkPhotoFiles,
  certificationFiles,
  setCertificationFiles
}) => {
  const { t } = useI18n();

  const renderProfileStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('kyc.profileInformation', 'Profile Information')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('kyc.profileDesc', 'Tell us about yourself and your business')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Image */}
        <FileUpload
          label={t('kyc.profileImage', 'Profile Image')}
          description={t('kyc.profileImageDesc', 'Upload a professional profile photo')}
          accept="image/*"
          uploadType="image"
          files={profileImageFiles}
          onFilesChange={setProfileImageFiles}
        />

        {/* Cover Image */}
        <FileUpload
          label={t('kyc.coverImage', 'Cover Image')}
          description={t('kyc.coverImageDesc', 'Upload a cover image for your profile')}
          accept="image/*"
          uploadType="image"
          files={coverImageFiles}
          onFilesChange={setCoverImageFiles}
        />
      </div>

      {formData.type === 'private' ? (
        <div className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('kyc.experienceYears', 'Years of Experience')} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={formData.experience_years || ''}
              onChange={(e) => updateFormData({ experience_years: parseInt(e.target.value) })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="5"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('kyc.businessName', 'Business Name')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.business_name || ''}
              onChange={(e) => updateFormData({ business_name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder={t('kyc.enterBusinessName', 'Enter business name')}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('kyc.vatNumber', 'VAT Number')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.vat_number || ''}
                onChange={(e) => updateFormData({ vat_number: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="IT12345678901"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('kyc.legalAddress', 'Legal Address')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.legal_address || ''}
                onChange={(e) => updateFormData({ legal_address: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder={t('kyc.enterAddress', 'Enter legal address')}
              />
            </div>
          </div>

          {/* Business Certifications */}
          <FileUpload
            label={t('kyc.businessCertifications', 'Business Certifications')}
            description={t('kyc.certificationDesc', 'Upload any relevant business certifications (optional)')}
            accept="image/*,application/pdf"
            uploadType="document"
            multiple
            maxFiles={5}
            files={certificationFiles}
            onFilesChange={setCertificationFiles}
          />
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {formData.type === 'private' ? t('kyc.professionalDescription', 'Professional Description') : t('kyc.businessDescription', 'Business Description')} <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          value={formData.description || ''}
          onChange={(e) => updateFormData({ description: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          placeholder={formData.type === 'private' ? t('kyc.professionalPlaceholder', 'Describe your professional experience and expertise...') : t('kyc.businessPlaceholder', 'Describe your business, services, and what makes you unique...')}
        />
      </div>

      {/* Qualifications */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('kyc.qualifications', 'Qualifications & Certifications')}
          </label>
          <textarea
            rows={3}
            value={formData.qualifications?.text || ''}
            onChange={(e) => updateFormData({ 
              qualifications: { 
                ...formData.qualifications,
                text: e.target.value,
                documents: formData.qualifications?.documents || []
              }
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder={t('kyc.qualificationsPlaceholder', 'List your relevant qualifications, certifications, and training...')}
          />
        </div>

        <FileUpload
          label={t('kyc.qualificationDocuments', 'Qualification Documents')}
          description={t('kyc.qualificationDocsDesc', 'Upload certificates, diplomas, or other qualification documents')}
          accept="image/*,application/pdf"
          uploadType="document"
          multiple
          maxFiles={10}
          files={qualificationFiles}
          onFilesChange={setQualificationFiles}
        />
      </div>

      {/* Work Photos */}
      <FileUpload
        label={t('kyc.workPhotos', 'Previous Work Photos')}
        description={t('kyc.workPhotosDesc', 'Upload photos of your previous work to showcase your skills')}
        accept="image/*"
        uploadType="image"
        multiple
        maxFiles={20}
        files={workPhotoFiles}
        onFilesChange={setWorkPhotoFiles}
      />
    </div>
  );

  const renderServicesStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('kyc.servicesOffered', 'Services Offered')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('kyc.servicesStepDesc', 'Select the services you provide to help customers find you')}
        </p>
      </div>

      <ServiceSelector
        selectedServices={formData.services_offered || []}
        onServicesChange={(services) => updateFormData({ services_offered: services })}
        required
        maxSelections={15}
      />
    </div>
  );

  const renderWorkAreaStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('kyc.workArea', 'Work Area')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('kyc.workAreaStepDesc', 'Define the geographic areas where you provide services')}
        </p>
      </div>

      {/* Simplified work area input for onboarding */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('kyc.workRegions', 'Service Regions')} <span className="text-red-500">*</span>
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder={t('kyc.regionsPlaceholder', 'e.g., Milan, Rome, Naples')}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('kyc.regionsHelp', 'Enter cities or regions separated by commas')}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('kyc.radiusHelp', 'How far are you willing to travel for work?')}
          </p>
        </div>
      </div>

      {/* Work area preview */}
      {formData.work_area?.regions && formData.work_area.regions.length > 0 && (
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
            <h4 className="font-medium text-primary-900 dark:text-primary-100">
              {t('kyc.serviceAreaPreview', 'Service Area Preview')}
            </h4>
          </div>
          <div className="space-y-1">
            {formData.work_area.regions.map((region, index) => (
              <span key={index} className="inline-block bg-primary-200 dark:bg-primary-800 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full text-sm mr-2">
                {region} ({formData.work_area?.radius_km}km)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderDeclarationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('kyc.legalDeclaration', 'Legal Declaration')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('kyc.declarationDesc', 'Please read and accept the following declaration')}
        </p>
      </div>

      {/* Declaration Text */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <p className="font-semibold text-gray-900 dark:text-white">
              {t('kyc.declarationTitle', 'Legal Declaration and Terms')}
            </p>
            
            <p>
              {t('kyc.declarationText', 'I hereby declare that all information and documents provided are truthful and accurate. I understand that:')}
            </p>
            
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t('kyc.declaration1', 'All personal and business information provided is accurate and up-to-date')}</li>
              <li>{t('kyc.declaration2', 'All uploaded documents are authentic and belong to me/my business')}</li>
              <li>{t('kyc.declaration3', 'I am legally authorized to provide the services listed')}</li>
              <li>{t('kyc.declaration4', 'I will maintain professional standards and comply with local regulations')}</li>
              <li>{t('kyc.declaration5', 'ERTUNO reserves the right to verify all information provided')}</li>
            </ul>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                {t('kyc.warningTitle', 'Important Warning:')}
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                {t('kyc.warningText', 'In case of false or fraudulent declarations, ERTUNO will not be held responsible and may suspend or permanently delete the account. Legal action may be taken for fraudulent submissions.')}
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

  const renderSubmissionStep = () => (
    <div className="space-y-6 text-center">
      <div>
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('kyc.readyToSubmit', 'Ready to Submit')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('kyc.submissionReview', 'Please review your information before submitting your application')}
        </p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-left">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          {t('kyc.applicationSummary', 'Application Summary')}
        </h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('kyc.accountType', 'Account Type')}:</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {formData.type === 'private' ? t('kyc.privateAccount', 'Private Individual') : t('kyc.businessAccount', 'Business/Company')}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('kyc.servicesCount', 'Services')}:</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {formData.services_offered?.length || 0} {t('kyc.selected', 'selected')}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('kyc.workRegions', 'Work Regions')}:</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {formData.work_area?.regions?.length || 0} {t('kyc.regions', 'regions')}
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
          {t('kyc.submissionNote', 'After submission, your application will be reviewed within 24-48 hours. You will receive an email notification once the review is complete.')}
        </p>
      </div>
    </div>
  );

  switch (step) {
    case 'profile':
      return renderProfileStep();
    case 'services':
      return renderServicesStep();
    case 'work_area':
      return renderWorkAreaStep();
    case 'declaration':
      return renderDeclarationStep();
    case 'submission':
      return renderSubmissionStep();
    default:
      return <div>Invalid step</div>;
  }
};
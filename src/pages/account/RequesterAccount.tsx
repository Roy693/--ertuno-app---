import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Camera, 
  Save, 
  Upload,
  Edit,
  AlertCircle,
  CheckCircle,
  Settings
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { FileUpload } from '../../components/ui/FileUpload';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../hooks/useI18n';
import { KycService, RequesterKycData } from '../../services/kycService';

export const RequesterAccount: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeSection, setActiveSection] = useState<'profile' | 'preferences'>('profile');
  
  // Form data state
  const [formData, setFormData] = useState<Partial<RequesterKycData>>({});
  
  // File states
  const [profileImageFiles, setProfileImageFiles] = useState<File[]>([]);

  const sections = [
    { id: 'profile', label: t('account.profile', 'Profile'), icon: User },
    { id: 'preferences', label: t('account.preferences', 'Preferences'), icon: Settings }
  ] as const;

  useEffect(() => {
    const loadRequesterData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const data = await KycService.getRequesterKyc(user.id);
        if (data) {
          setFormData(data);
        }
      } catch (error) {
        console.error('Error loading requester data:', error);
        setMessage({ type: 'error', text: t('account.loadError', 'Error loading account data') });
      } finally {
        setLoading(false);
      }
    };

    loadRequesterData();
  }, [user?.id, t]);

  const updateFormData = (updates: Partial<RequesterKycData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    setMessage(null);

    try {
      // Upload new profile image if provided
      let profileImageUrl = formData.profile_image;
      
      if (profileImageFiles.length > 0) {
        profileImageUrl = await KycService.uploadFile(profileImageFiles[0], 'profile', user.id);
      }

      // Prepare update data
      const updateData: Partial<RequesterKycData> = {
        ...formData,
        profile_image: profileImageUrl || formData.profile_image || '',
        updated_at: new Date().toISOString()
      };

      await KycService.updateRequesterKyc(user.id, updateData);
      
      setMessage({ type: 'success', text: t('account.saveSuccess', 'Changes saved successfully') });
      
      // Clear file state after successful upload
      setProfileImageFiles([]);

      // Reload data to reflect changes
      const updatedData = await KycService.getRequesterKyc(user.id);
      if (updatedData) {
        setFormData(updatedData);
      }

    } catch (error) {
      console.error('Error saving requester data:', error);
      setMessage({ type: 'error', text: t('account.saveError', 'Error saving changes') });
    } finally {
      setSaving(false);
    }
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      {/* Profile Image */}
      <div>
        <FileUpload
          label={t('account.profileImage', 'Profile Image')}
          description={t('account.requesterProfileImageDesc', 'Upload a photo that represents you well')}
          accept="image/*"
          uploadType="image"
          files={profileImageFiles}
          onFilesChange={setProfileImageFiles}
          className="max-w-md"
        />
        {formData.profile_image && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t('account.currentImage', 'Current Image')}:
            </p>
            <img
              src={formData.profile_image}
              alt="Current profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
            />
          </div>
        )}
      </div>

      {/* Basic Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('kyc.fullName', 'Full Name')}
        </label>
        <input
          type="text"
          value={formData.full_name || ''}
          onChange={(e) => updateFormData({ full_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          placeholder={t('kyc.enterFullName', 'Enter your full name')}
        />
      </div>

      {/* Personal Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('kyc.personalDescription', 'Personal Description')}
        </label>
        <textarea
          rows={4}
          value={formData.description || ''}
          onChange={(e) => updateFormData({ description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          placeholder={t('kyc.personalDescPlaceholder', 'Tell us about yourself, your interests, and what kind of services you might need...')}
        />
      </div>

      {/* Account Information */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('account.accountInfo', 'Account Information')}
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 block">
              {t('account.memberSince', 'Member Since')}
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              {formData.created_at ? new Date(formData.created_at).toLocaleDateString() : '-'}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 block">
              {t('account.verificationStatus', 'Verification Status')}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
              formData.verification_status === 'approved'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : formData.verification_status === 'pending'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
            }`}>
              <CheckCircle className="w-3 h-3 mr-1" />
              {formData.verification_status === 'approved' ? t('account.verified', 'Verified') :
               formData.verification_status === 'pending' ? t('account.pending', 'Pending') :
               t('account.rejected', 'Rejected')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t('account.accountPreferences', 'Account Preferences')}
      </h3>

      {/* Communication Preferences */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
          {t('account.communicationPrefs', 'Communication Preferences')}
        </h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {t('account.emailNotifications', 'Email notifications for new messages')}
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {t('account.serviceUpdates', 'Service updates and recommendations')}
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {t('account.marketingEmails', 'Marketing emails and promotions')}
            </span>
          </label>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
          {t('account.privacySettings', 'Privacy Settings')}
        </h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {t('account.profileVisible', 'Make my profile visible to service providers')}
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {t('account.showActivity', 'Show my activity status')}
            </span>
          </label>
        </div>
      </div>

      {/* Request Preferences */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
          {t('account.requestPreferences', 'Request Preferences')}
        </h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('account.preferredContactMethod', 'Preferred Contact Method')}
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:text-white">
              <option value="chat">{t('account.inAppChat', 'In-app chat')}</option>
              <option value="email">{t('account.email', 'Email')}</option>
              <option value="phone">{t('account.phone', 'Phone')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('account.responseTime', 'Expected Response Time')}
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-600 dark:text-white">
              <option value="immediate">{t('account.immediate', 'Immediate (within 1 hour)')}</option>
              <option value="same_day">{t('account.sameDay', 'Same day (within 8 hours)')}</option>
              <option value="next_day">{t('account.nextDay', 'Next day (within 24 hours)')}</option>
              <option value="flexible">{t('account.flexible', 'Flexible (within 3 days)')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Safety & Trust */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h4 className="text-md font-semibold text-blue-800 dark:text-blue-300 mb-3">
          {t('account.safetyTrust', 'Safety & Trust')}
        </h4>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-blue-700 dark:text-blue-200">
            <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
            {t('account.identityVerified', 'Identity verified by ERTUNO')}
          </div>
          <div className="flex items-center text-sm text-blue-700 dark:text-blue-200">
            <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
            {t('account.securePayments', 'Secure payment protection')}
          </div>
          <div className="flex items-center text-sm text-blue-700 dark:text-blue-200">
            <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
            {t('account.disputeResolution', 'Dispute resolution support')}
          </div>
        </div>
      </div>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('account.manageAccount', 'Manage Account')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('account.updateRequesterProfile', 'Update your profile and account preferences')}
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
              {activeSection === 'preferences' && renderPreferencesSection()}

              {/* Save Button - Only show for profile section */}
              {activeSection === 'profile' && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
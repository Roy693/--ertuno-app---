import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Settings,
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  Star,
  MessageCircle,
  TrendingUp,
  Award,
  Upload,
  Camera,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  FileText,
  BarChart3,
  Target,
  CheckCircle,
  AlertCircle,
  Home,
  Wrench,
  Palette,
  Monitor
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { BackButton } from '../../components/ui/BackButton';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../hooks/useI18n';
import { GoogleMapsWorkAreaSelector } from '../../components/ui/GoogleMapsWorkAreaSelector';
import { ServicesService, ServiceProvider } from '../../services/servicesService';

interface WorkZone {
  name: string;
  radius: number; // km
  active: boolean;
}

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  pricing: {
    type: 'hourly' | 'fixed' | 'custom';
    amount?: number;
    currency: string;
  };
  active: boolean;
}

interface Job {
  id: string;
  title: string;
  client: string;
  amount: number;
  currency: string;
  status: 'completed' | 'in_progress' | 'pending_payment';
  completedAt?: string;
  category: string;
}

export const ServiceProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'profile' | 'services' | 'workspace' | 'accounting'>('overview');
  const [loading, setLoading] = useState(false);
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  
  // Profile editing states
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    businessName: '',
    description: '',
    experience: '',
    skills: [] as string[],
    profileImage: ''
  });
  
  // Workspace states
  const [workZones, setWorkZones] = useState<WorkZone[]>([
    { name: 'Milan Center', radius: 5, active: true },
    { name: 'Milan North', radius: 10, active: false }
  ]);
  
  // Services states
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Emergency Plumbing Repair',
      category: 'home_services',
      description: 'Quick fixes for leaks, clogs, and emergencies',
      pricing: { type: 'hourly', amount: 45, currency: 'EUR' },
      active: true
    }
  ]);
  
  // Portfolio states
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  
  // Accounting states
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      title: 'Kitchen Sink Repair',
      client: 'Marco R.',
      amount: 120,
      currency: 'EUR',
      status: 'completed',
      completedAt: '2024-01-15',
      category: 'Plumbing'
    },
    {
      id: '2',
      title: 'Bathroom Installation',
      client: 'Sofia M.',
      amount: 850,
      currency: 'EUR',
      status: 'pending_payment',
      category: 'Plumbing'
    }
  ]);

  // Load service provider data
  useEffect(() => {
    if (user && user.role === 'service_provider') {
      loadServiceProviderData();
    }
  }, [user]);

  const loadServiceProviderData = async () => {
    try {
      setLoading(true);
      const providerId = `provider_${user?.id}`;
      const provider = await ServicesService.getServiceProvider(providerId);
      if (provider) {
        setServiceProvider(provider);
        setProfileData({
          businessName: provider.businessName || '',
          description: provider.description || '',
          experience: provider.experience || '',
          skills: provider.skills || [],
          profileImage: provider.profileImage || ''
        });
        setPortfolioImages(provider.portfolioImages || []);
      }
    } catch (error) {
      console.error('Failed to load service provider data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await ServicesService.updateServiceProvider(user.id, {
        businessName: profileData.businessName,
        description: profileData.description,
        experience: profileData.experience,
        skills: profileData.skills,
        profileImage: profileData.profileImage,
        portfolioImages
      });
      setEditingProfile(false);
      await loadServiceProviderData();
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = (skill: string) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: any } = {
      'home_services': Home,
      'professional_services': Monitor,
      'personal_services': Users,
      'automotive': Wrench
    };
    return iconMap[category] || Wrench;
  };

  // Calculate earnings
  const totalEarnings = jobs
    .filter(job => job.status === 'completed')
    .reduce((sum, job) => sum + job.amount, 0);
  
  const thisMonthEarnings = jobs
    .filter(job => job.status === 'completed' && job.completedAt && 
      new Date(job.completedAt).getMonth() === new Date().getMonth())
    .reduce((sum, job) => sum + job.amount, 0);

  const pendingPayments = jobs
    .filter(job => job.status === 'pending_payment')
    .reduce((sum, job) => sum + job.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <BackButton />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('dashboard.serviceProvider', 'Service Provider Dashboard')}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('dashboard.welcome', 'Welcome back')}, {profileData.businessName || user?.name || t('dashboard.professional', 'Professional')}!
                </p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                serviceProvider?.verificationStatus === 'verified' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
              }`}>
                {serviceProvider?.verificationStatus === 'verified' ? t('dashboard.verified', '✓ Verified') : t('dashboard.pendingVerification', '⏳ Pending Verification')}
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{serviceProvider?.rating?.toFixed(1) || '0.0'}</span>
                <span>({serviceProvider?.reviewCount || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: t('dashboard.overview', 'Overview'), icon: BarChart3 },
              { id: 'profile', label: t('dashboard.profile', 'Professional Profile'), icon: Users },
              { id: 'services', label: t('dashboard.services', 'My Services'), icon: Wrench },
              { id: 'workspace', label: t('dashboard.workspace', 'Work Areas'), icon: MapPin },
              { id: 'accounting', label: t('dashboard.accounting', 'Accounting'), icon: DollarSign }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeSection === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.totalEarnings', 'Total Earnings')}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">€{totalEarnings}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.thisMonth', 'This Month')}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">€{thisMonthEarnings}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.pendingPayment', 'Pending Payment')}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">€{pendingPayments}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.completedJobs', 'Completed Jobs')}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {jobs.filter(job => job.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.quickActions', 'Quick Actions')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button onClick={() => navigate('/account/provider')} variant="outline" className="justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    {t('dashboard.updateProfile', 'Update Profile')}
                  </Button>
                  <Button onClick={() => setActiveSection('services')} variant="outline" className="justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('dashboard.addService', 'Add Service')}
                  </Button>
                  <Button onClick={() => setActiveSection('workspace')} variant="outline" className="justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t('dashboard.manageWorkAreas', 'Manage Work Areas')}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Professional Profile</h3>
                  {editingProfile ? (
                    <div className="flex space-x-2">
                      <Button onClick={saveProfile} disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {t('common.save', 'Save')} {t('common.changes', 'Changes')}
                      </Button>
                      <Button onClick={() => setEditingProfile(false)} variant="outline">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setEditingProfile(true)} variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Photo */}
                  <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                      {profileData.profileImage ? (
                        <img 
                          src={profileData.profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Camera className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    {editingProfile && (
                      <Button variant="outline" fullWidth>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                    )}
                  </div>

                  {/* Profile Form */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('dashboard.businessName', 'Business Name')}
                      </label>
                      <input
                        type="text"
                        value={profileData.businessName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, businessName: e.target.value }))}
                        disabled={!editingProfile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                        placeholder="Your business or professional name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('dashboard.professionalDescription', 'Professional Description')}
                      </label>
                      <textarea
                        value={profileData.description}
                        onChange={(e) => setProfileData(prev => ({ ...prev, description: e.target.value }))}
                        disabled={!editingProfile}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                        placeholder="Describe your services and expertise..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('dashboard.yearsExperience', 'Years of Experience')}
                      </label>
                      <input
                        type="text"
                        value={profileData.experience}
                        onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                        disabled={!editingProfile}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                        placeholder="e.g., 5+ years"
                      />
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('dashboard.skillsSpecialties', 'Skills & Specialties')}
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {profileData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          >
                            {skill}
                            {editingProfile && (
                              <button
                                onClick={() => removeSkill(skill)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                      {editingProfile && (
                        <input
                          type="text"
                          placeholder="Add a skill and press Enter"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addSkill((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.portfolioPastWork', 'Portfolio & Past Work')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {portfolioImages.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative group">
                      <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                      {editingProfile && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="outline" className="text-white border-white">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {editingProfile && (
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
                      <div className="text-center">
                        <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-500">Add Photo</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Services Section */}
          {activeSection === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.myServices', 'My Services')}</h3>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('dashboard.addNewService', 'Add New Service')}
                  </Button>
                </div>

                <div className="space-y-4">
                  {services.map(service => {
                    const CategoryIcon = getCategoryIcon(service.category);
                    return (
                      <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                              <CategoryIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{service.name}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{service.description}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {service.pricing.type === 'hourly' ? '€' + service.pricing.amount + t('pricing.hourly', '/hour') : 
                                   service.pricing.type === 'fixed' ? '€' + service.pricing.amount + ' ' + t('pricing.fixed', 'fixed') :
                                   t('pricing.customPricing', 'Custom pricing')}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  service.active 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                }`}>
                                  {service.active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Workspace Section */}
          {activeSection === 'workspace' && (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.workAreasZones', 'Work Areas & Zones')}</h3>
                
                <GoogleMapsWorkAreaSelector
                  workAreas={workZones.map(zone => ({
                    id: zone.name.toLowerCase().replace(/\s+/g, '-'),
                    name: zone.name,
                    coordinates: { lat: 45.4642, lng: 9.1900 }, // Default to Milan
                    radius: zone.radius,
                    active: zone.active
                  }))}
                  onWorkAreasUpdate={(areas) => {
                    setWorkZones(areas.map(area => ({
                      name: area.name,
                      radius: area.radius,
                      active: area.active
                    })));
                  }}
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
                />
              </div>
            </motion.div>
          )}

          {/* Accounting Section */}
          {activeSection === 'accounting' && (
            <motion.div
              key="accounting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Earned</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">€{totalEarnings}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.pendingPayments', 'Pending Payments')}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">€{pendingPayments}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.completedJobs', 'Completed Jobs')}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {jobs.filter(job => job.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jobs List */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Jobs</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Job</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Client</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map(job => (
                        <tr key={job.id} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-4 px-4">
                            <span className="font-medium text-gray-900 dark:text-white">{job.title}</span>
                          </td>
                          <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{job.client}</td>
                          <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{job.category}</td>
                          <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                            €{job.amount}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              job.status === 'completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : job.status === 'pending_payment'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            }`}>
                              {job.status === 'completed' ? t('common.completed', 'Completed') : 
                               job.status === 'pending_payment' ? t('dashboard.pendingPayment', 'Pending Payment') : t('common.inProgress', 'In Progress')}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                            {job.completedAt || t('common.inProgress', 'In Progress')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
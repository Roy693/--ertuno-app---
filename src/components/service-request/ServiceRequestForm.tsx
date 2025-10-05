import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  AlertCircle,
  CreditCard,
  Zap,
  Flame
} from 'lucide-react';
import { Button } from '../ui/Button';
import { SERVICE_CATEGORIES, REQUEST_POSTING_FEES } from '../../utils/constants';
import type { ServiceRequest, Location } from '../../types';

interface ServiceRequestFormProps {
  onSubmit: (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'emergency',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      latitude: 0,
      longitude: 0,
      country: 'US'
    } as Location,
    budget: {
      min: 0,
      max: 0,
      currency: 'USD'
    },
    preferredDate: '',
    timeFrame: 'flexible' as 'asap' | 'flexible' | 'specific',
    tags: [] as string[],
    attachments: [] as string[]
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  const selectedCategory = SERVICE_CATEGORIES.find(cat => cat.id === formData.category);
  const postingFee = REQUEST_POSTING_FEES[formData.urgency as keyof typeof REQUEST_POSTING_FEES];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value }
    }));
  };

  const handleBudgetChange = (field: 'min' | 'max', value: number) => {
    setFormData(prev => ({
      ...prev,
      budget: { ...prev.budget, [field]: value }
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.category) newErrors.category = 'Category is required';
        break;
      
      case 2:
        if (!formData.location.address) newErrors.address = 'Address is required';
        if (!formData.location.city) newErrors.city = 'City is required';
        if (!formData.location.state) newErrors.state = 'State is required';
        if (!formData.location.zipCode) newErrors.zipCode = 'ZIP code is required';
        break;

      case 3:
        if (formData.budget.min <= 0) newErrors.minBudget = 'Minimum budget is required';
        if (formData.budget.max <= 0) newErrors.maxBudget = 'Maximum budget is required';
        if (formData.budget.min >= formData.budget.max) newErrors.maxBudget = 'Maximum must be greater than minimum';
        if (formData.timeFrame === 'specific' && !formData.preferredDate) {
          newErrors.preferredDate = 'Preferred date is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    const requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
      userId: 'current-user-id', // Will be set by parent component
      status: 'pending',
    };

    await onSubmit(requestData);
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'low': return <Clock className="w-5 h-5" />;
      case 'medium': return <AlertCircle className="w-5 h-5" />;
      case 'high': return <Zap className="w-5 h-5" />;
      case 'emergency': return <Flame className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-blue-500 border-blue-200 bg-blue-50';
      case 'medium': return 'text-yellow-500 border-yellow-200 bg-yellow-50';
      case 'high': return 'text-orange-500 border-orange-200 bg-orange-50';
      case 'emergency': return 'text-red-500 border-red-200 bg-red-50';
      default: return 'text-gray-500 border-gray-200 bg-gray-50';
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Progress Bar */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Post a Service Request
          </h2>
          <span className="text-sm text-gray-500">Step {currentStep} of 4</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-6">
        {/* Step 1: Service Details */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Service Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Fix leaky kitchen faucet"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Select a category</option>
                {SERVICE_CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            {selectedCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subcategory
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select subcategory (optional)</option>
                  {selectedCategory.subcategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what you need done in detail..."
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Urgency Level
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['low', 'medium', 'high', 'emergency'] as const).map(urgency => (
                  <button
                    key={urgency}
                    type="button"
                    onClick={() => handleInputChange('urgency', urgency)}
                    className={`p-3 border-2 rounded-lg flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                      formData.urgency === urgency
                        ? `${getUrgencyColor(urgency)} border-current`
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {getUrgencyIcon(urgency)}
                    <span className="text-xs font-medium capitalize">{urgency}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Service Location
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                value={formData.location.address}
                onChange={(e) => handleLocationChange('address', e.target.value)}
                placeholder="123 Main Street"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  placeholder="New York"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => handleLocationChange('state', e.target.value)}
                  placeholder="NY"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    errors.state ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={formData.location.zipCode}
                  onChange={(e) => handleLocationChange('zipCode', e.target.value)}
                  placeholder="10001"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    errors.zipCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Budget & Schedule */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Budget & Timeline
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Budget *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={formData.budget.min}
                    onChange={(e) => handleBudgetChange('min', Number(e.target.value))}
                    placeholder="50"
                    className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.minBudget ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                </div>
                {errors.minBudget && <p className="mt-1 text-sm text-red-600">{errors.minBudget}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Budget *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={formData.budget.max}
                    onChange={(e) => handleBudgetChange('max', Number(e.target.value))}
                    placeholder="200"
                    className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                      errors.maxBudget ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                </div>
                {errors.maxBudget && <p className="mt-1 text-sm text-red-600">{errors.maxBudget}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                When do you need this done?
              </label>
              <div className="space-y-3">
                {(['asap', 'flexible', 'specific'] as const).map(timeFrame => (
                  <label key={timeFrame} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="timeFrame"
                      value={timeFrame}
                      checked={formData.timeFrame === timeFrame}
                      onChange={(e) => handleInputChange('timeFrame', e.target.value)}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 capitalize">
                      {timeFrame === 'asap' ? 'As soon as possible' : timeFrame}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {formData.timeFrame === 'specific' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                    errors.preferredDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.preferredDate && <p className="mt-1 text-sm text-red-600">{errors.preferredDate}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tags like 'licensed', 'insured', etc."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <Button variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Review & Payment */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Review & Payment
              </h3>
            </div>

            {/* Request Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">{formData.title}</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{formData.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>📍 {formData.location.city}, {formData.location.state}</span>
                <span>💰 ${formData.budget.min} - ${formData.budget.max}</span>
                <span className="capitalize">{getUrgencyIcon(formData.urgency)} {formData.urgency} Priority</span>
              </div>
            </div>

            {/* Posting Fee */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Request Posting Fee
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    One-time fee to connect with qualified professionals
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${postingFee}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.urgency} priority
                  </p>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                What's included:
              </h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>✓ AI-powered matching with qualified providers</li>
                <li>✓ Multiple competitive offers</li>
                <li>✓ Secure payment processing</li>
                <li>✓ Customer support</li>
                <li>✓ Service guarantee protection</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            {currentStep > 1 && (
              <Button variant="ghost" onClick={handlePrevious}>
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            
            {currentStep < 4 ? (
              <Button variant="primary" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                loading={loading}
                icon={CreditCard}
              >
                Pay ${postingFee} & Post Request
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
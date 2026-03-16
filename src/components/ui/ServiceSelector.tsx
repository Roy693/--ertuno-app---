import React from 'react';
import { motion } from 'framer-motion';
import { Check, Home, Wrench, Palette, Monitor, Briefcase, Scale } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  services: string[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'home_repairs',
    name: 'Home Repairs',
    icon: Home,
    services: [
      'Plumbing',
      'Electrical',
      'Carpentry',
      'Painting',
      'HVAC',
      'Roofing',
      'Flooring',
      'General Maintenance'
    ]
  },
  {
    id: 'cleaning_maintenance',
    name: 'Cleaning & Maintenance',
    icon: Wrench,
    services: [
      'House Cleaning',
      'Office Cleaning',
      'Deep Cleaning',
      'Window Cleaning',
      'Carpet Cleaning',
      'Garden Maintenance',
      'Pool Maintenance',
      'Appliance Repair'
    ]
  },
  {
    id: 'design_branding',
    name: 'Design & Branding',
    icon: Palette,
    services: [
      'Graphic Design',
      'Web Design',
      'Logo Design',
      'Branding',
      'Interior Design',
      'Architecture',
      'Photography',
      'Video Production'
    ]
  },
  {
    id: 'tech_development',
    name: 'Tech Support & Development',
    icon: Monitor,
    services: [
      'Web Development',
      'Mobile App Development',
      'IT Support',
      'Software Development',
      'Database Management',
      'Network Setup',
      'Computer Repair',
      'Digital Marketing'
    ]
  },
  {
    id: 'event_logistics',
    name: 'Event Planning & Logistics',
    icon: Briefcase,
    services: [
      'Wedding Planning',
      'Corporate Events',
      'Party Planning',
      'Catering',
      'Transportation',
      'Equipment Rental',
      'Venue Management',
      'Event Coordination'
    ]
  },
  {
    id: 'legal_financial',
    name: 'Legal & Financial Consulting',
    icon: Scale,
    services: [
      'Legal Advice',
      'Tax Services',
      'Business Consulting',
      'Accounting',
      'Real Estate',
      'Insurance',
      'Financial Planning',
      'Contract Review'
    ]
  }
];

interface ServiceSelectorProps {
  selectedServices: string[];
  onServicesChange: (services: string[]) => void;
  required?: boolean;
  error?: string;
  className?: string;
  maxSelections?: number;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedServices,
  onServicesChange,
  required = false,
  error,
  className = '',
  maxSelections = 10
}) => {
  const { t } = useI18n();

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      // Remove service
      onServicesChange(selectedServices.filter(s => s !== service));
    } else {
      // Add service if under limit
      if (selectedServices.length < maxSelections) {
        onServicesChange([...selectedServices, service]);
      }
    }
  };

  const toggleCategory = (category: ServiceCategory) => {
    const categoryServices = category.services;
    const selectedInCategory = categoryServices.filter(s => selectedServices.includes(s));
    
    if (selectedInCategory.length === categoryServices.length) {
      // Deselect all in category
      onServicesChange(selectedServices.filter(s => !categoryServices.includes(s)));
    } else {
      // Select all in category (respecting max limit)
      const remainingSlots = maxSelections - selectedServices.length;
      const unselectedInCategory = categoryServices.filter(s => !selectedServices.includes(s));
      const toAdd = unselectedInCategory.slice(0, remainingSlots);
      onServicesChange([...selectedServices, ...toAdd]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('kyc.servicesOffered', 'Services Offered')}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t('kyc.selectServices', 'Select the services you offer')} ({selectedServices.length}/{maxSelections})
        </p>
      </div>

      {/* Service Categories */}
      <div className="space-y-6">
        {SERVICE_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const selectedInCategory = category.services.filter(s => selectedServices.includes(s)).length;
          const allSelected = selectedInCategory === category.services.length;
          const someSelected = selectedInCategory > 0;

          return (
            <div key={category.id} className="space-y-3">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                    <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {t(`services.categories.${category.id}`, category.name)}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedInCategory} / {category.services.length} {t('kyc.selected', 'selected')}
                    </p>
                  </div>
                </div>
                
                {/* Select All Category Button */}
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    allSelected
                      ? 'bg-primary-600 text-white border-primary-600'
                      : someSelected
                      ? 'bg-primary-100 text-primary-700 border-primary-300 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                  }`}
                >
                  {allSelected ? t('kyc.deselectAll', 'Deselect All') : t('kyc.selectAll', 'Select All')}
                </button>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {category.services.map((service) => {
                  const isSelected = selectedServices.includes(service);
                  const canSelect = isSelected || selectedServices.length < maxSelections;

                  return (
                    <motion.button
                      key={service}
                      type="button"
                      onClick={() => canSelect && toggleService(service)}
                      disabled={!canSelect}
                      whileHover={canSelect ? { scale: 1.02 } : {}}
                      whileTap={canSelect ? { scale: 0.98 } : {}}
                      className={`relative p-3 text-left text-sm rounded-lg border transition-all duration-200 ${
                        isSelected
                          ? 'bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/20 dark:border-primary-600 dark:text-primary-300'
                          : canSelect
                          ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                          : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-900 dark:border-gray-700 dark:text-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{t(`services.items.${service.toLowerCase().replace(/\s+/g, '_')}`, service)}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Selection Summary */}
      {selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
        >
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {t('kyc.selectedServices', 'Selected Services')} ({selectedServices.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedServices.map((service) => (
              <span
                key={service}
                className="inline-flex items-center px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full dark:bg-primary-900/20 dark:text-primary-300"
              >
                {t(`services.items.${service.toLowerCase().replace(/\s+/g, '_')}`, service)}
                <button
                  type="button"
                  onClick={() => toggleService(service)}
                  className="ml-1 hover:text-primary-900 dark:hover:text-primary-100"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
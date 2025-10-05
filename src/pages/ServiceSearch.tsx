import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Sliders,
  Star,
  X
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProviderSearchResults } from '../components/provider/ProviderSearchResults';
import type { ServiceProvider } from '../types/provider';
import { SERVICE_CATEGORIES } from '../utils/constants';

interface ServiceSearchProps {
  onProviderSelect: (provider: ServiceProvider) => void;
  onMessageProvider: (provider: ServiceProvider) => void;
  onBookService: (provider: ServiceProvider) => void;
}

interface SearchFilters {
  category: string;
  location: string;
  radius: number;
  priceRange: [number, number];
  rating: number;
  availability: 'any' | 'now' | 'today' | 'week';
  verified: boolean;
}

// Mock data - in real app this would come from API
const mockProviders: ServiceProvider[] = [
  {
    id: 'provider-1',
    businessName: 'Elite Home Solutions',
    serviceCategories: ['Home Maintenance', 'Plumbing', 'Electrical'],
    location: { 
      address: '123 Main St', 
      city: 'San Francisco', 
      state: 'CA', 
      zipCode: '94102',
      latitude: 37.7749, 
      longitude: -122.4194 
    },
    hourlyRate: 85,
    averageRating: 4.9,
    totalReviews: 142,
    isOnline: true,
    profilePhoto: '/api/placeholder/100/100',
    description: 'Professional home maintenance services with 10+ years of experience.',
    verificationStatus: {
      identityVerified: true,
      licenseVerified: true,
      insuranceVerified: true,
      backgroundCheckPassed: true
    },
    responseTimeMinutes: 12,
    completedJobs: 250,
    yearsInBusiness: 8,
    portfolioImages: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
    distance: 2.3
  },
  {
    id: 'provider-2',
    businessName: 'QuickFix Pro Services',
    serviceCategories: ['Cleaning Services', 'Home Maintenance'],
    location: { 
      address: '456 Oak Ave', 
      city: 'San Francisco', 
      state: 'CA', 
      zipCode: '94103',
      latitude: 37.7849, 
      longitude: -122.4094 
    },
    hourlyRate: 65,
    averageRating: 4.7,
    totalReviews: 89,
    isOnline: false,
    profilePhoto: '/api/placeholder/100/100',
    description: 'Reliable cleaning and maintenance services for residential and commercial properties.',
    verificationStatus: {
      identityVerified: true,
      licenseVerified: false,
      insuranceVerified: true,
      backgroundCheckPassed: true
    },
    responseTimeMinutes: 25,
    completedJobs: 156,
    yearsInBusiness: 5,
    distance: 4.1
  },
  {
    id: 'provider-3',
    businessName: 'TechSavvy Solutions',
    serviceCategories: ['Technology & IT', 'Computer Repair'],
    location: { 
      address: '789 Pine St', 
      city: 'San Francisco', 
      state: 'CA', 
      zipCode: '94104',
      latitude: 37.7949, 
      longitude: -122.3994 
    },
    hourlyRate: 120,
    averageRating: 4.8,
    totalReviews: 67,
    isOnline: true,
    profilePhoto: '/api/placeholder/100/100',
    description: 'Expert computer repair and IT services for home and small business.',
    verificationStatus: {
      identityVerified: true,
      licenseVerified: true,
      insuranceVerified: false,
      backgroundCheckPassed: true
    },
    responseTimeMinutes: 8,
    completedJobs: 98,
    yearsInBusiness: 3,
    distance: 1.7
  }
];

export const ServiceSearch: React.FC<ServiceSearchProps> = ({
  onProviderSelect,
  onMessageProvider,
  onBookService
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    location: '',
    radius: 25,
    priceRange: [0, 200],
    rating: 0,
    availability: 'any',
    verified: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(false);

  // Search function
  const handleSearch = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let results = [...mockProviders];
      
      // Apply filters
      if (filters.category) {
        results = results.filter(p => 
          p.serviceCategories?.some((cat: string) => 
            cat.toLowerCase().includes(filters.category.toLowerCase())
          )
        );
      }
      
      if (searchQuery) {
        results = results.filter(p => 
          p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.serviceCategories?.some((cat: string) => 
            cat.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
      
      if (filters.rating > 0) {
        results = results.filter(p => (p.averageRating || 0) >= filters.rating);
      }
      
      if (filters.verified) {
        results = results.filter(p => 
          p.verificationStatus?.identityVerified &&
          p.verificationStatus?.backgroundCheckPassed
        );
      }
      
      if (filters.priceRange[1] < 200) {
        results = results.filter(p => 
          p.hourlyRate >= filters.priceRange[0] && 
          p.hourlyRate <= filters.priceRange[1]
        );
      }

      if (filters.availability === 'now') {
        results = results.filter(p => p.isOnline);
      }
      
      setProviders(results);
      setLoading(false);
    }, 1000);
  };

  // Auto-search on filter changes
  useEffect(() => {
    handleSearch();
  }, [filters, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="What service do you need?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Location Input */}
            <div className="lg:w-64 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:w-auto flex items-center justify-center"
            >
              <Sliders className="w-5 h-5 mr-2" />
              Filters
              {Object.values(filters).some(v => v && v !== 'any' && v !== 0 && !Array.isArray(v)) && (
                <span className="ml-2 bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  !
                </span>
              )}
            </Button>
          </div>

          {/* Quick Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {SERVICE_CATEGORIES.slice(0, 6).map((category) => (
              <button
                key={category.id}
                onClick={() => setFilters({ 
                  ...filters, 
                  category: filters.category === category.name ? '' : category.name 
                })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  filters.category === category.name
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({
                      ...filters,
                      priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                    })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}+/hr</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilters({ 
                        ...filters, 
                        rating: filters.rating === rating ? 0 : rating 
                      })}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          rating <= filters.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Availability
                </label>
                <select
                  value={filters.availability}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    availability: e.target.value as SearchFilters['availability']
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                >
                  <option value="any">Any time</option>
                  <option value="now">Available now</option>
                  <option value="today">Available today</option>
                  <option value="week">This week</option>
                </select>
              </div>

              {/* Verification Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={filters.verified}
                    onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  <label htmlFor="verified" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Verified providers only
                  </label>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setFilters({
                  category: '',
                  location: '',
                  radius: 25,
                  priceRange: [0, 200],
                  rating: 0,
                  availability: 'any',
                  verified: false
                })}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear all filters
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProviderSearchResults
          providers={providers}
          loading={loading}
          onProviderSelect={onProviderSelect}
          onMessageProvider={onMessageProvider}
          onBookService={onBookService}
        />
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Clock, 
  Filter,
  Grid,
  List,
  Eye,
  MessageCircle,
  Calendar
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { ServiceProvider } from '../../types/provider';
import { VerificationBadges } from './VerificationBadge';
import { ProviderProfile } from './ProviderProfile';

interface ProviderSearchResultsProps {
  providers: ServiceProvider[];
  loading?: boolean;
  onProviderSelect: (provider: ServiceProvider) => void;
  onMessageProvider: (provider: ServiceProvider) => void;
  onBookService: (provider: ServiceProvider) => void;
}

type SortOption = 'rating' | 'distance' | 'price' | 'availability';
type ViewMode = 'grid' | 'list';

export const ProviderSearchResults: React.FC<ProviderSearchResultsProps> = ({
  providers,
  loading = false,
  // onProviderSelect, // Currently unused but keeping for future use
  onMessageProvider,
  onBookService
}) => {
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getVerificationBadges = (provider: ServiceProvider) => {
    const badges = [
      { type: 'identity' as const, verified: provider.verificationStatus?.identityVerified || false },
      { type: 'license' as const, verified: provider.verificationStatus?.licenseVerified || false },
      { type: 'insurance' as const, verified: provider.verificationStatus?.insuranceVerified || false },
      { type: 'background' as const, verified: provider.verificationStatus?.backgroundCheckPassed || false }
    ];

    // Add performance badges
    // Performance badges (commented out to match VerificationBadge types)
    // if (provider.averageRating && provider.averageRating >= 4.8) {
    //   badges.push({ type: 'topRated' as const, verified: true });
    // }

    // if (provider.responseTimeMinutes && provider.responseTimeMinutes <= 15) {
    //   badges.push({ type: 'fastResponse' as const, verified: true });
    // }

    return badges;
  };

  const sortedProviders = React.useMemo(() => {
    const sorted = [...providers];
    
    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      case 'price':
        return sorted.sort((a, b) => a.hourlyRate - b.hourlyRate);
      case 'distance':
        return sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      case 'availability':
        return sorted.sort((a, b) => {
          const aOnline = a.isOnline ? 1 : 0;
          const bOnline = b.isOnline ? 1 : 0;
          return bOnline - aOnline;
        });
      default:
        return sorted;
    }
  }, [providers, sortBy]);

  const ProviderCard: React.FC<{ provider: ServiceProvider; index: number }> = ({ provider, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      {/* Provider Header */}
      <div className="relative">
        <div className="flex items-start p-6 space-x-4">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={provider.profilePhoto || '/api/placeholder/64/64'}
              alt={provider.businessName}
              className="w-16 h-16 rounded-full object-cover"
            />
            {provider.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          {/* Provider Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {provider.businessName}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {provider.serviceCategories?.slice(0, 2).join(' • ')}
              {provider.serviceCategories && provider.serviceCategories.length > 2 && ' +more'}
            </p>

            {/* Rating & Reviews */}
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1">
                {renderStars(provider.averageRating || 0)}
                <span className="text-sm font-medium ml-1">
                  {provider.averageRating?.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({provider.totalReviews} reviews)
              </span>
            </div>

            {/* Location & Distance */}
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>
                {provider.location?.city}, {provider.location?.state}
                {provider.distance && ` • ${provider.distance.toFixed(1)} miles away`}
              </span>
            </div>
          </div>

          {/* Price Badge */}
          <div className="text-right">
            <div className="text-lg font-bold text-primary-600">
              ${provider.hourlyRate}/hr
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {provider.responseTimeMinutes}m response
            </div>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="px-6 pb-4">
          <VerificationBadges
            badges={getVerificationBadges(provider)}
            size="sm"
            showLabels={false}
            maxDisplay={6}
            layout="horizontal"
          />
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setSelectedProvider(provider)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMessageProvider(provider)}
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onBookService(provider)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const ProviderListItem: React.FC<{ provider: ServiceProvider; index: number }> = ({ provider, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex items-center space-x-4">
        {/* Profile Picture */}
        <div className="relative flex-shrink-0">
          <img
            src={provider.profilePhoto || '/api/placeholder/48/48'}
            alt={provider.businessName}
            className="w-12 h-12 rounded-full object-cover"
          />
          {provider.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>

        {/* Provider Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white truncate">
                {provider.businessName}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {provider.serviceCategories?.slice(0, 2).join(' • ')}
              </p>
            </div>
            <div className="text-right ml-4">
              <div className="font-semibold text-primary-600">
                ${provider.hourlyRate}/hr
              </div>
            </div>
          </div>

          {/* Rating & Location */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {renderStars(provider.averageRating || 0)}
                <span className="text-sm">
                  {provider.averageRating?.toFixed(1)} ({provider.totalReviews})
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-3 h-3 mr-1" />
                {provider.distance?.toFixed(1)} miles
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProvider(provider)}
              >
                View
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onBookService(provider)}
              >
                Book
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">
            {providers.length} Provider{providers.length !== 1 ? 's' : ''} Found
          </h2>
          
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="rating">Best Rated</option>
            <option value="distance">Nearest</option>
            <option value="price">Lowest Price</option>
            <option value="availability">Available Now</option>
          </select>

          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 lg:grid-cols-2 gap-6'
          : 'space-y-4'
      }>
        {sortedProviders.map((provider, index) => 
          viewMode === 'grid' ? (
            <ProviderCard key={provider.id} provider={provider} index={index} />
          ) : (
            <ProviderListItem key={provider.id} provider={provider} index={index} />
          )
        )}
      </div>

      {/* No Results */}
      {providers.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No providers found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or expanding your radius.
          </p>
        </div>
      )}

      {/* Provider Profile Modal */}
      <AnimatePresence>
        {selectedProvider && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProvider(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Provider Profile</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProvider(null)}
                >
                  ✕
                </Button>
              </div>
              
              <ProviderProfile
                provider={selectedProvider}
                onMessageProvider={() => {
                  onMessageProvider(selectedProvider);
                  setSelectedProvider(null);
                }}
                onBookService={() => {
                  onBookService(selectedProvider);
                  setSelectedProvider(null);
                }}
                showContactInfo={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
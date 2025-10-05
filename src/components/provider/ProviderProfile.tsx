import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Award, 
  Phone, 
  Mail, 
  Calendar,
  MessageCircle,
  Camera,
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { ServiceProvider } from '../../types/provider';

interface ProviderProfileProps {
  provider: ServiceProvider;
  onMessageProvider: () => void;
  onBookService: () => void;
  showContactInfo?: boolean;
}

export const ProviderProfile: React.FC<ProviderProfileProps> = ({
  provider,
  onMessageProvider,
  onBookService,
  showContactInfo = false
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Handler for image selection
  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
    // TODO: Add modal/lightbox logic here if needed
    console.log('Selected image:', index, 'Current:', selectedImageIndex);
  };

  const verificationBadges = [
    {
      type: 'identity',
      label: 'Identity Verified',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      verified: provider.verificationStatus?.identityVerified || false
    },
    {
      type: 'license',
      label: 'Licensed Professional',
      icon: Award,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      verified: provider.verificationStatus?.licenseVerified || false
    },
    {
      type: 'insurance',
      label: 'Insured & Bonded',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      verified: provider.verificationStatus?.insuranceVerified || false
    },
    {
      type: 'background',
      label: 'Background Check',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      verified: provider.verificationStatus?.backgroundCheckPassed || false
    }
  ];

  const renderStars = (rating: number, size = 'w-4 h-4') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden"
    >
      {/* Header Section */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-32 sm:h-48 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
        
        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="flex items-end space-x-4">
            {/* Profile Picture */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <img
                src={provider.profilePhoto || '/api/placeholder/96/96'}
                alt={provider.businessName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {provider.isOnline && (
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </motion.div>
            
            {/* Basic Info */}
            <div className="flex-1 text-white">
              <h1 className="text-xl sm:text-2xl font-bold">{provider.businessName}</h1>
              <p className="text-sm opacity-90">
                {provider.serviceCategories?.join(' • ')}
              </p>
              <div className="flex items-center mt-2">
                <div className="flex items-center space-x-1 mr-4">
                  {renderStars(provider.averageRating || 0)}
                  <span className="text-sm ml-1">
                    {provider.averageRating?.toFixed(1)} ({provider.totalReviews} reviews)
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {provider.location?.city}, {provider.location?.state}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{provider.totalReviews}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Reviews</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{provider.completedJobs || 0}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Jobs Done</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {provider.yearsInBusiness || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {provider.responseTimeMinutes || 60}m
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Response</div>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            Verification Status
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {verificationBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.type}
                  className={`flex items-center p-3 rounded-lg ${
                    badge.verified 
                      ? badge.bgColor 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <Icon 
                    className={`w-5 h-5 mr-2 ${
                      badge.verified 
                        ? badge.color 
                        : 'text-gray-400'
                    }`} 
                  />
                  <div>
                    <div className={`text-sm font-medium ${
                      badge.verified 
                        ? badge.color 
                        : 'text-gray-500'
                    }`}>
                      {badge.verified ? <CheckCircle className="w-4 h-4 inline mr-1" /> : <AlertCircle className="w-4 h-4 inline mr-1" />}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {badge.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* About Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">About</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {provider.description || 'Professional service provider with expertise in multiple categories.'}
          </p>
        </div>

        {/* Services & Pricing */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Services & Pricing</h3>
          <div className="grid gap-3">
            {provider.serviceCategories?.map((category: string, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <span className="font-medium">{category}</span>
                <span className="text-primary-600 font-bold">
                  ${provider.hourlyRate}/hour
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio/Gallery */}
        {provider.portfolioImages && provider.portfolioImages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Camera className="w-5 h-5 mr-2" />
              Portfolio
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {provider.portfolioImages.map((image: string, index: number) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleImageSelect(index)}
                >
                  <img
                    src={image}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Availability */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Availability
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            {provider.availability?.schedule ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {Object.entries(provider.availability.schedule).map(([day, hours]: [string, any]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-medium capitalize">{day}:</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {hours?.isAvailable ? `${hours.start || ''} - ${hours.end || ''}` : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Contact provider for availability information
              </p>
            )}
          </div>
        </div>

        {/* Contact Information (if authorized) */}
        {showContactInfo && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="space-y-2">
              {provider.contactInfo?.phone && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4 mr-3" />
                  {provider.contactInfo.phone}
                </div>
              )}
              {provider.contactInfo?.email && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4 mr-3" />
                  {provider.contactInfo.email}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            className="flex-1 flex items-center justify-center"
            onClick={onBookService}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Service
          </Button>
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center"
            onClick={onMessageProvider}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
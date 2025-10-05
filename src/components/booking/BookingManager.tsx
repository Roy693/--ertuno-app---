import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock,
  MapPin,
  DollarSign,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Star,
  CreditCard,
  Shield
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { ServiceOffer, ServiceRequest, ServiceProvider } from '../../types';

interface BookingManagerProps {
  offers: ServiceOffer[];
  request: ServiceRequest;
  onAcceptOffer: (offerId: string) => Promise<void>;
  onDeclineOffer: (offerId: string) => Promise<void>;
  loading?: boolean;
}

export const BookingManager: React.FC<BookingManagerProps> = ({
  offers,
  request,
  onAcceptOffer,
  onDeclineOffer,
  loading = false
}) => {
  const [selectedOffer, setSelectedOffer] = useState<ServiceOffer | null>(null);
  const [showProviderDetails, setShowProviderDetails] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'distance'>('price');
  const [filterBy, setFilterBy] = useState<'all' | 'pending' | 'accepted'>('all');

  // Mock provider data for demo
  const mockProviders: Record<string, ServiceProvider> = {
    'provider1': {
      id: 'provider1',
      email: 'john@handyman.com',
      name: 'John Smith',
      role: 'provider',
      businessName: 'Smith Home Services',
      businessDescription: 'Professional handyman with 10+ years experience',
      serviceCategories: ['home-maintenance'],
      serviceArea: [],
      location: {
        latitude: 40.7505,
        longitude: -73.9934,
        address: '789 Service Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10016',
        country: 'US'
      },
      hourlyRate: 75,
      isVerified: true,
      rating: 4.8,
      totalJobs: 156,
      avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=0ea5e9&color=fff',
      availability: {
        isActive: true,
        workingHours: {
          monday: { start: '09:00', end: '17:00', available: true },
          tuesday: { start: '09:00', end: '17:00', available: true },
          wednesday: { start: '09:00', end: '17:00', available: true },
          thursday: { start: '09:00', end: '17:00', available: true },
          friday: { start: '09:00', end: '17:00', available: true },
          saturday: { start: '09:00', end: '15:00', available: true },
          sunday: { start: '10:00', end: '14:00', available: false }
        },
        emergencyService: true
      },
      subscription: {
        plan: 'premium',
        status: 'active',
        leadsRemaining: 25,
        monthlyLeadLimit: 30,
        expiresAt: '2024-02-15T00:00:00Z'
      },
      certifications: ['Licensed Electrician', 'Insured', 'BBB Certified'],
      portfolio: [],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    'provider2': {
      id: 'provider2',
      email: 'maria@repairs.com',
      name: 'Maria Garcia',
      role: 'provider',
      businessName: 'Quick Fix Solutions',
      businessDescription: 'Fast and reliable repair services',
      serviceCategories: ['home-maintenance'],
      serviceArea: [],
      location: {
        latitude: 40.7589,
        longitude: -73.9851,
        address: '456 Fix Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10025',
        country: 'US'
      },
      hourlyRate: 85,
      isVerified: true,
      rating: 4.9,
      totalJobs: 89,
      avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=ec4899&color=fff',
      availability: {
        isActive: true,
        workingHours: {
          monday: { start: '08:00', end: '18:00', available: true },
          tuesday: { start: '08:00', end: '18:00', available: true },
          wednesday: { start: '08:00', end: '18:00', available: true },
          thursday: { start: '08:00', end: '18:00', available: true },
          friday: { start: '08:00', end: '18:00', available: true },
          saturday: { start: '09:00', end: '16:00', available: true },
          sunday: { start: '10:00', end: '15:00', available: false }
        },
        emergencyService: false
      },
      subscription: {
        plan: 'basic',
        status: 'active',
        leadsRemaining: 8,
        monthlyLeadLimit: 10,
        expiresAt: '2024-02-01T00:00:00Z'
      },
      certifications: ['Licensed', 'Insured'],
      portfolio: [],
      createdAt: '2023-06-15T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  };

  const filteredOffers = offers
    .filter(offer => {
      if (filterBy === 'all') return true;
      return offer.status === filterBy;
    })
    .sort((a, b) => {
      const providerA = mockProviders[a.providerId];
      const providerB = mockProviders[b.providerId];
      
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return (providerB?.rating || 0) - (providerA?.rating || 0);
        case 'distance':
          // Mock distance calculation
          return Math.random() - 0.5;
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'declined': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'expired': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateEstimatedTotal = (offer: ServiceOffer) => {
    const serviceFee = offer.price * 0.1; // 10% service fee
    const tax = (offer.price + serviceFee) * 0.08; // 8% tax
    return offer.price + serviceFee + tax;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {request.title}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{request.location.city}, {request.location.state}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span>${request.budget.min} - ${request.budget.max} budget</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span className="capitalize">{request.timeFrame} timeline</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
              {request.status.replace('_', ' ')}
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Posted {formatDate(request.createdAt)}
            </p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {request.description}
        </p>

        {request.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {request.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Service Offers ({offers.length})
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Compare offers from qualified professionals
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Offers</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
            <option value="distance">Sort by Distance</option>
          </select>
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOffers.map((offer) => {
            const provider = mockProviders[offer.providerId];
            if (!provider) return null;

            return (
              <motion.div
                key={offer.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Provider Info */}
                  <div className="flex-1">
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={provider.avatar}
                        alt={provider.name}
                        className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-600"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {provider.businessName}
                          </h4>
                          {provider.isVerified && (
                            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                              <Shield className="w-4 h-4" />
                              <span className="text-xs font-medium">Verified</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {provider.name} • {provider.totalJobs} completed jobs
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{provider.rating}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{provider.location?.city}, {provider.location?.state}</span>
                          </div>

                          {provider.availability.emergencyService && (
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs rounded-full">
                              Emergency Service
                            </span>
                          )}
                        </div>

                        {provider.certifications && provider.certifications.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {provider.certifications.slice(0, 3).map(cert => (
                              <span key={cert} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                {cert}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Offer Message */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {offer.message}
                      </p>
                    </div>

                    {/* Offer Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Price</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${offer.price}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {offer.estimatedDuration} hrs
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Available</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatDate(offer.availableDate)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Status</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                          {offer.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-between">
                    <div className="text-right mb-4">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${offer.price}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        + fees & tax
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Est. total: ${calculateEstimatedTotal(offer).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      {offer.status === 'pending' && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            fullWidth
                            onClick={() => setSelectedOffer(offer)}
                            loading={loading}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept Offer
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            fullWidth
                            onClick={() => onDeclineOffer(offer.id)}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                        </>
                      )}

                      {offer.status === 'accepted' && (
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          disabled
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accepted
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        onClick={() => setShowProviderDetails(provider.id)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredOffers.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No offers available
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filterBy !== 'all' ? 'Try changing your filter settings' : 'Providers will start sending offers soon'}
          </p>
        </div>
      )}

      {/* Offer Acceptance Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Confirm Booking
              </h3>
              <button
                onClick={() => setSelectedOffer(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Booking Summary */}
            <div className="space-y-6">
              {/* Service Details */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Service Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Service:</span>
                    <span className="text-gray-900 dark:text-white">{request.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Date:</span>
                    <span className="text-gray-900 dark:text-white">{formatDate(selectedOffer.availableDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                    <span className="text-gray-900 dark:text-white">{selectedOffer.estimatedDuration} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Location:</span>
                    <span className="text-gray-900 dark:text-white">{request.location.address}</span>
                  </div>
                </div>
              </div>

              {/* Provider Details */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Provider Information
                </h4>
                <div className="flex items-center space-x-4 mb-3">
                  <img
                    src={mockProviders[selectedOffer.providerId]?.avatar}
                    alt={mockProviders[selectedOffer.providerId]?.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {mockProviders[selectedOffer.providerId]?.businessName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {mockProviders[selectedOffer.providerId]?.name}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {mockProviders[selectedOffer.providerId]?.phone || '(555) 123-4567'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {mockProviders[selectedOffer.providerId]?.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Payment Breakdown
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Service cost:</span>
                    <span className="text-gray-900 dark:text-white">${selectedOffer.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Service fee (10%):</span>
                    <span className="text-gray-900 dark:text-white">${(selectedOffer.price * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Tax (8%):</span>
                    <span className="text-gray-900 dark:text-white">${((selectedOffer.price * 1.1) * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900 dark:text-white">Total:</span>
                      <span className="text-gray-900 dark:text-white">${calculateEstimatedTotal(selectedOffer).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Protection */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Payment Protection
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Your payment is held securely until the job is completed to your satisfaction.
                      Full refund guarantee if the service doesn't meet your expectations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="ghost" onClick={() => setSelectedOffer(null)}>
                Cancel
              </Button>
              <Button 
                variant="primary"
                onClick={() => {
                  onAcceptOffer(selectedOffer.id);
                  setSelectedOffer(null);
                }}
                loading={loading}
                icon={CreditCard}
              >
                Accept & Pay ${calculateEstimatedTotal(selectedOffer).toFixed(2)}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Provider Details Modal */}
      {showProviderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Provider profile content would go here */}
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Provider Profile
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Detailed provider profile coming soon
              </p>
              <Button 
                variant="primary" 
                onClick={() => setShowProviderDetails(null)}
                className="mt-4"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
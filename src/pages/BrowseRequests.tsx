import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign,
  Plus,
  Grid,
  List,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ServiceRequestCard } from '../components/requests/ServiceRequestCard';
import { ServiceRequestForm } from '../components/requests/ServiceRequestForm';
import { useAuth } from '../hooks/useAuth';
import { ServiceRequestsService } from '../services/serviceRequests';
import { SERVICE_CATEGORIES } from '../types';
import type { ServiceRequest } from '../types';

export const BrowseRequests: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    location: {
      city: '',
      state: ''
    },
    budgetRange: {
      min: '',
      max: ''
    }
  });

  useEffect(() => {
    loadRequests();
  }, [selectedCategory]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const allRequests = await ServiceRequestsService.getOpenServiceRequests(
        selectedCategory === 'all' ? undefined : selectedCategory
      );
      setRequests(allRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadRequests();
      return;
    }

    setLoading(true);
    try {
      const searchFilters = {
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        location: filters.location.city && filters.location.state ? filters.location : undefined,
        budgetRange: filters.budgetRange.min || filters.budgetRange.max ? {
          min: parseFloat(filters.budgetRange.min) || 0,
          max: parseFloat(filters.budgetRange.max) || Infinity
        } : undefined
      };

      const results = await ServiceRequestsService.searchServiceRequests(
        searchQuery,
        searchFilters
      );
      setRequests(results);
    } catch (error) {
      console.error('Error searching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (request: ServiceRequest) => {
    // Navigate to request details page or open modal
    console.log('View details for request:', request.id);
  };

  const handleSendResponse = (request: ServiceRequest) => {
    // Open response form or navigate to response page
    console.log('Send response to request:', request.id);
  };

  const handleCreateSuccess = (requestId: string) => {
    setShowCreateForm(false);
    loadRequests(); // Refresh the list
  };

  const filteredRequests = requests.filter(request => {
    // Additional client-side filtering can be done here if needed
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Browse Service Requests
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find opportunities to provide your services or post your own request
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <Button
              variant="primary"
              onClick={() => setShowCreateForm(true)}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Request
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search requests
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by keywords, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {Object.values(SERVICE_CATEGORIES).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="flex space-x-2">
              <Button variant="primary" onClick={handleSearch}>
                Search
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={filters.location.city}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      location: { ...prev.location, city: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="Enter state"
                    value={filters.location.state}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      location: { ...prev.location, state: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Min Budget
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.budgetRange.min}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      budgetRange: { ...prev.budgetRange, min: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Budget
                  </label>
                  <input
                    type="number"
                    placeholder="No limit"
                    value={filters.budgetRange.max}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      budgetRange: { ...prev.budgetRange, max: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredRequests.length} requests found
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="p-2"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="p-2"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading requests...</p>
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No requests found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or browse all categories
            </p>
            <Button variant="primary" onClick={() => setShowCreateForm(true)}>
              Post the First Request
            </Button>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }`}>
            {filteredRequests.map((request) => (
              <ServiceRequestCard
                key={request.id}
                request={request}
                onViewDetails={handleViewDetails}
                onSendResponse={handleSendResponse}
                compact={viewMode === 'list'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      {showCreateForm && (
        <ServiceRequestForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};
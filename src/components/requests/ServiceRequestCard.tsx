import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  MessageCircle,
  User,
  Star,
  Calendar,
  Eye
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { ServiceRequest } from '../../types';

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onViewDetails: (request: ServiceRequest) => void;
  onSendResponse?: (request: ServiceRequest) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({
  request,
  onViewDetails,
  onSendResponse,
  showActions = true,
  compact = false
}) => {
  const [imageIndex, setImageIndex] = useState(0);

  const formatBudget = (budget?: { min: number; max: number; currency: string }) => {
    if (!budget) return 'Budget not specified';
    
    const { min, max, currency } = budget;
    const symbol = currency === 'USD' ? '$' : currency;
    
    if (min && max) {
      return `${symbol}${min.toLocaleString()} - ${symbol}${max.toLocaleString()}`;
    } else if (min) {
      return `From ${symbol}${min.toLocaleString()}`;
    } else if (max) {
      return `Up to ${symbol}${max.toLocaleString()}`;
    }
    
    return 'Budget negotiable';
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just posted';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 ${
        compact ? 'p-4' : 'p-6'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
            {request.subCategory && (
              <span className="px-2 py-1 bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100 rounded-full text-xs font-medium">
                {request.subCategory}
              </span>
            )}
          </div>
          
          <h3 className={`font-semibold text-gray-900 dark:text-white mb-2 ${
            compact ? 'text-lg' : 'text-xl'
          }`}>
            {request.title}
          </h3>
          
          <p className={`text-gray-600 dark:text-gray-400 ${
            compact ? 'line-clamp-2' : 'line-clamp-3'
          }`}>
            {request.description}
          </p>
        </div>
      </div>

      {/* Images */}
      {request.images && request.images.length > 0 && !compact && (
        <div className="mb-4">
          <div className="relative">
            <img
              src={request.images[imageIndex]}
              alt={`Request image ${imageIndex + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />
            {request.images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {imageIndex + 1} / {request.images.length}
              </div>
            )}
          </div>
          
          {request.images.length > 1 && (
            <div className="flex space-x-2 mt-2">
              {request.images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setImageIndex(index)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                    imageIndex === index 
                      ? 'border-primary-500' 
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              {request.images.length > 4 && (
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                  +{request.images.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Details */}
      <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'} gap-4 mb-4`}>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{request.location.city}, {request.location.state}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          <span>{request.timeline}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <DollarSign className="w-4 h-4 mr-2" />
          <span>{formatBudget(request.budget)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{getTimeAgo(request.createdAt)}</span>
        </div>
      </div>

      {/* Response Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MessageCircle className="w-4 h-4 mr-1" />
            <span>{request.responseCount || 0} responses</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4 mr-1" />
            <span>ID: #{request.id.slice(-6)}</span>
          </div>
        </div>
        
        {request.status === 'open' && (
          <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span>Accepting responses</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className={`flex space-x-3 ${compact ? 'flex-col space-y-2 space-x-0' : ''}`}>
          <Button
            variant="secondary"
            onClick={() => onViewDetails(request)}
            className="flex items-center justify-center flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          
          {request.status === 'open' && onSendResponse && (
            <Button
              variant="primary"
              onClick={() => onSendResponse(request)}
              className="flex items-center justify-center flex-1"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Response
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
};
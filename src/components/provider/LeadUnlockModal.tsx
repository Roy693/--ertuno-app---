import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Unlock,
  Star,
  MapPin,
  DollarSign,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  X,
  MessageSquare,
  Phone,
  Mail
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { ServiceRequest, ServiceProvider, AIMatchResult } from '../../types';

interface LeadUnlockModalProps {
  lead: ServiceRequest & { matchScore?: AIMatchResult };
  provider: ServiceProvider;
  onUnlock: (leadId: string) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export const LeadUnlockModal: React.FC<LeadUnlockModalProps> = ({
  lead,
  provider,
  onUnlock,
  onClose,
  loading = false
}) => {
  const [step, setStep] = useState<'preview' | 'confirm' | 'unlocked'>('preview');
  const [showFullDetails, setShowFullDetails] = useState(false);

  const leadCost = 5; // Cost to unlock this lead
  const estimatedValue = lead.budget.max * 0.8; // Estimated job value

  const handleUnlock = async () => {
    if (provider.subscription.leadsRemaining <= 0 && provider.subscription.monthlyLeadLimit !== -1) {
      alert('You have no leads remaining. Please upgrade your subscription.');
      return;
    }

    try {
      await onUnlock(lead.id);
      setStep('unlocked');
    } catch (error) {
      console.error('Error unlocking lead:', error);
    }
  };

  const urgencyColors = {
    low: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900',
    medium: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900',
    high: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900',
    emergency: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900'
  };

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Unlock Lead Details
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Get full access to this potential customer and send your offer
        </p>
      </div>

      {/* Lead Preview */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {lead.title}
          </h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[lead.urgency]}`}>
            {lead.urgency}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {showFullDetails ? lead.description : `${lead.description.substring(0, 100)}...`}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">
              {lead.location.city}, {lead.location.state}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">
              ${lead.budget.min} - ${lead.budget.max}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300 capitalize">
              {lead.timeFrame}
            </span>
          </div>

          {lead.matchScore && (
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-600 dark:text-gray-300">
                {Math.round(lead.matchScore.score * 100)}% match
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowFullDetails(!showFullDetails)}
          className="text-blue-600 dark:text-blue-400 text-sm mt-3 hover:underline"
        >
          {showFullDetails ? 'Show less' : 'Show full details'}
        </button>
      </div>

      {/* Match Reasons */}
      {lead.matchScore && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">
            Why this is a good match for you:
          </h5>
          <ul className="space-y-1">
            {lead.matchScore.reasons.map((reason, index) => (
              <li key={index} className="text-sm text-green-700 dark:text-green-300 flex items-center">
                <CheckCircle className="w-3 h-3 mr-2" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Unlock Cost */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-medium text-gray-900 dark:text-white">
            Lead Unlock Cost
          </h5>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            1 Credit
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Estimated Job Value:</span>
            <div className="font-medium text-gray-900 dark:text-white">
              ${estimatedValue}
            </div>
          </div>
          
          <div>
            <span className="text-gray-500 dark:text-gray-400">Your Credits:</span>
            <div className="font-medium text-gray-900 dark:text-white">
              {provider.subscription.leadsRemaining} remaining
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="text-sm text-yellow-700 dark:text-yellow-300">
              <strong>ROI Calculation:</strong> Potential return of ${(estimatedValue - leadCost).toLocaleString()} 
              ({Math.round(((estimatedValue - leadCost) / leadCost) * 100)}% ROI)
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="primary"
          fullWidth
          onClick={() => setStep('confirm')}
          disabled={provider.subscription.leadsRemaining <= 0 && provider.subscription.monthlyLeadLimit !== -1}
          icon={Unlock}
        >
          Unlock Lead (1 Credit)
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>

      {provider.subscription.leadsRemaining <= 0 && provider.subscription.monthlyLeadLimit !== -1 && (
        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
          <p className="text-red-700 dark:text-red-300 font-medium mb-2">
            No credits remaining
          </p>
          <p className="text-red-600 dark:text-red-400 text-sm mb-3">
            Upgrade your subscription to unlock more leads
          </p>
          <Button variant="primary" size="sm">
            Upgrade Plan
          </Button>
        </div>
      )}
    </div>
  );

  const renderConfirm = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Confirm Lead Unlock
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Are you sure you want to use 1 credit to unlock this lead?
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">Credits before:</span>
          <span className="font-medium">{provider.subscription.leadsRemaining}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600 dark:text-gray-300">Credits after:</span>
          <span className="font-medium">{provider.subscription.leadsRemaining - 1}</span>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="primary"
          fullWidth
          onClick={handleUnlock}
          loading={loading}
        >
          Confirm Unlock
        </Button>
        <Button variant="ghost" onClick={() => setStep('preview')}>
          Back
        </Button>
      </div>
    </div>
  );

  const renderUnlocked = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Lead Unlocked Successfully!
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          You now have full access to this customer's details
        </p>
      </div>

      {/* Full Lead Details */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          {lead.title}
        </h4>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {lead.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Location
            </label>
            <div className="flex items-center space-x-1 mt-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white">
                {lead.location.address}, {lead.location.city}, {lead.location.state}
              </span>
            </div>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Budget
            </label>
            <div className="flex items-center space-x-1 mt-1">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white">
                ${lead.budget.min} - ${lead.budget.max}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Contact Info (Mock) */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <h5 className="font-medium text-gray-900 dark:text-white mb-3">
            Customer Contact
          </h5>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white">Sarah Johnson</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white">(555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white">sarah.johnson@email.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button variant="primary" fullWidth icon={MessageSquare}>
          Send Offer
        </Button>
        <Button variant="outline" fullWidth icon={Phone}>
          Call Now
        </Button>
      </div>

      <div className="text-center">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            {step === 'preview' && <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            {step === 'confirm' && <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
            {step === 'unlocked' && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />}
            <span className="font-medium text-gray-900 dark:text-white">
              {step === 'preview' && 'Lead Preview'}
              {step === 'confirm' && 'Confirm Purchase'}
              {step === 'unlocked' && 'Lead Unlocked'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === 'preview' && renderPreview()}
        {step === 'confirm' && renderConfirm()}
        {step === 'unlocked' && renderUnlocked()}
      </motion.div>
    </div>
  );
};
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Check,
  X,
  TrendingUp,
  Users,
  MessageSquare,
  BarChart,
  Zap,
  Crown,
  Shield,
  AlertCircle,
  Download
} from 'lucide-react';
import { Button } from '../ui/Button';
import { SUBSCRIPTION_PLANS } from '../../utils/constants';
import type { ServiceProvider } from '../../types';

interface SubscriptionManagerProps {
  provider: ServiceProvider;
  onUpgrade: (planId: string) => Promise<void>;
  onCancel: () => Promise<void>;
  onUpdatePaymentMethod: () => Promise<void>;
  onDownloadInvoice: (invoiceId: string) => Promise<void>;
  loading?: boolean;
}

interface Invoice {
  id: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl?: string;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({
  provider,
  onUpgrade,
  onCancel,
  onUpdatePaymentMethod,
  onDownloadInvoice,
  loading = false
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Mock invoices data
  const [invoices] = useState<Invoice[]>([
    {
      id: 'inv_001',
      amount: 59.99,
      date: '2024-01-01T00:00:00Z',
      status: 'paid'
    },
    {
      id: 'inv_002',
      amount: 59.99,
      date: '2023-12-01T00:00:00Z',
      status: 'paid'
    },
    {
      id: 'inv_003',
      amount: 59.99,
      date: '2023-11-01T00:00:00Z',
      status: 'paid'
    }
  ]);

  const currentPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === provider.subscription.plan);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'trial': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic': return <Zap className="w-5 h-5 text-blue-500" />;
      case 'premium': return <Crown className="w-5 h-5 text-purple-500" />;
      case 'enterprise': return <Shield className="w-5 h-5 text-gold-500" />;
      default: return <Zap className="w-5 h-5 text-gray-500" />;
    }
  };

  const calculateYearlyDiscount = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 10; // 2 months free
    const savings = monthlyPrice * 2;
    return { yearlyPrice, savings };
  };

  return (
    <div className="space-y-8">
      {/* Current Subscription Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Subscription Management
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your subscription plan and billing information
            </p>
          </div>
        </div>

        {/* Current Plan Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getPlanIcon(provider.subscription.plan)}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentPlan?.name} Plan
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(provider.subscription.status)}`}>
                  {provider.subscription.status === 'trial' ? 'Free Trial' : provider.subscription.status}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${currentPlan?.price}/mo
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {provider.subscription.status === 'trial' 
                  ? `Trial expires ${formatDate(provider.subscription.expiresAt)}`
                  : `Next billing: ${formatDate(provider.subscription.expiresAt)}`
                }
              </p>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Leads Used</span>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {(currentPlan?.leadsPerMonth || 0) - provider.subscription.leadsRemaining}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  / {currentPlan?.leadsPerMonth === -1 ? '∞' : currentPlan?.leadsPerMonth}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: currentPlan?.leadsPerMonth === -1 
                      ? '100%' 
                      : `${Math.min(100, ((currentPlan?.leadsPerMonth || 0) - provider.subscription.leadsRemaining) / (currentPlan?.leadsPerMonth || 1) * 100)}%`
                  }}
                />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Jobs Completed</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {provider.totalJobs}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Rating</span>
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {provider.rating}/5.0
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Member Since</span>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {formatDate(provider.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {provider.subscription.status === 'trial' && (
            <Button 
              variant="primary" 
              icon={CreditCard}
              onClick={() => setSelectedPlan('premium')}
              loading={loading}
            >
              Upgrade Now
            </Button>
          )}
          
          {provider.subscription.status === 'active' && (
            <>
              <Button 
                variant="outline" 
                icon={TrendingUp}
                onClick={() => setSelectedPlan('enterprise')}
              >
                Upgrade Plan
              </Button>
              
              <Button 
                variant="ghost" 
                icon={CreditCard}
                onClick={onUpdatePaymentMethod}
              >
                Update Payment Method
              </Button>
            </>
          )}
          
          <Button 
            variant="ghost" 
            icon={Download}
            onClick={() => setShowInvoices(true)}
          >
            Billing History
          </Button>

          {provider.subscription.status === 'active' && (
            <Button 
              variant="ghost" 
              icon={X}
              onClick={() => setShowCancelConfirm(true)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Cancel Subscription
            </Button>
          )}
        </div>
      </div>

      {/* Available Plans */}
      {(selectedPlan || provider.subscription.status === 'trial') && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Choose Your Plan
            </h3>
            
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  billingCycle === 'yearly' ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                Yearly
                <span className="ml-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1 rounded">
                  Save 17%
                </span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const { yearlyPrice, savings } = calculateYearlyDiscount(plan.price);
              const isCurrentPlan = plan.id === provider.subscription.plan;
              const isRecommended = plan.id === 'premium';
              
              return (
                <motion.div
                  key={plan.id}
                  className={`relative rounded-xl p-6 border-2 transition-all duration-200 ${
                    selectedPlan === plan.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : isCurrentPlan
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-3">
                      {getPlanIcon(plan.id)}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h4>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${billingCycle === 'yearly' ? (yearlyPrice / 12).toFixed(2) : plan.price}
                      <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                        /month
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Save ${savings}/month • Billed ${yearlyPrice}/year
                      </p>
                    )}
                    {billingCycle === 'monthly' && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Billed monthly
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant={selectedPlan === plan.id ? "primary" : isCurrentPlan ? "outline" : "ghost"}
                    fullWidth
                    disabled={isCurrentPlan}
                    onClick={() => {
                      if (!isCurrentPlan) {
                        setSelectedPlan(plan.id);
                      }
                    }}
                  >
                    {isCurrentPlan ? 'Current Plan' : selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {selectedPlan && selectedPlan !== provider.subscription.plan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Ready to upgrade?
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your new plan will be active immediately
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="ghost" onClick={() => setSelectedPlan(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => onUpgrade(selectedPlan)}
                    loading={loading}
                    icon={CreditCard}
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Billing History Modal */}
      <AnimatePresence>
        {showInvoices && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Billing History
                </h3>
                <button
                  onClick={() => setShowInvoices(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-auto max-h-96">
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          ${invoice.amount}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(invoice.date)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {invoice.status}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownloadInvoice(invoice.id)}
                          icon={Download}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Cancel Subscription
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to cancel your subscription? You'll lose access to all premium features 
                  at the end of your current billing cycle.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => setShowCancelConfirm(false)}
                >
                  Keep Subscription
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    onCancel();
                    setShowCancelConfirm(false);
                  }}
                  loading={loading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Cancel Subscription
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
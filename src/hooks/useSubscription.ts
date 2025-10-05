import { useState, useEffect } from 'react';
import StripeService from '../services/stripe';
import { SubscriptionService } from '../services/enhanced-firebase';
import type { ServiceProvider, SubscriptionPlan } from '../types';
import { SUBSCRIPTION_PLANS } from '../utils/constants';

interface UseSubscriptionResult {
  currentPlan: SubscriptionPlan | null;
  loading: boolean;
  error: string | null;
  upgradeSubscription: (planId: string, billingCycle?: 'monthly' | 'yearly') => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updatePaymentMethod: () => Promise<void>;
  getInvoices: () => Promise<any[]>;
  downloadInvoice: (invoiceId: string) => Promise<void>;
  checkSubscriptionStatus: () => Promise<void>;
  isFeatureAvailable: (feature: string) => boolean;
  getRemainingLeads: () => number;
  deductLead: () => Promise<boolean>;
}

export const useSubscription = (provider: ServiceProvider | null): UseSubscriptionResult => {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (provider?.subscription?.plan) {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === provider.subscription.plan);
      setCurrentPlan(plan || null);
    }
  }, [provider]);

  const upgradeSubscription = async (planId: string, billingCycle: 'monthly' | 'yearly' = 'monthly') => {
    if (!provider) {
      throw new Error('No provider found');
    }

    setLoading(true);
    setError(null);

    try {
      // If provider already has a subscription, update it
      if (provider.subscription.stripeSubscriptionId) {
        await StripeService.updateSubscription(
          provider.subscription.stripeSubscriptionId,
          planId,
          billingCycle
        );
      } else {
        // Create new subscription
        const { sessionId } = await StripeService.createCheckoutSession(
          planId,
          provider.id,
          billingCycle
        );
        await StripeService.redirectToCheckout(sessionId);
      }

      // Update local subscription data
      const newPlan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (newPlan) {
        const updatedSubscription = {
          ...provider.subscription,
          plan: planId as any,
          status: 'active' as const,
          leadsRemaining: newPlan.leadsPerMonth,
          monthlyLeadLimit: newPlan.leadsPerMonth,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };

        await SubscriptionService.updateProviderSubscription(provider.id, updatedSubscription);
        setCurrentPlan(newPlan);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upgrade subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!provider?.subscription?.stripeSubscriptionId) {
      throw new Error('No active subscription found');
    }

    setLoading(true);
    setError(null);

    try {
      await StripeService.cancelSubscription(provider.subscription.stripeSubscriptionId);
      
      // Update local subscription status
      const updatedSubscription = {
        ...provider.subscription,
        status: 'inactive' as const
      };

      await SubscriptionService.updateProviderSubscription(provider.id, updatedSubscription);
    } catch (err: any) {
      setError(err.message || 'Failed to cancel subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentMethod = async () => {
    if (!provider) {
      throw new Error('No provider found');
    }

    try {
      // Create customer portal session
      const customerId = 'cus_' + provider.id; // Mock customer ID
      const { url } = await StripeService.createPortalSession(customerId);
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to access billing portal');
      throw err;
    }
  };

  const getInvoices = async (): Promise<any[]> => {
    if (!provider) {
      throw new Error('No provider found');
    }

    setLoading(true);
    setError(null);

    try {
      const customerId = 'cus_' + provider.id; // Mock customer ID
      const invoices = await StripeService.getInvoices(customerId);
      return invoices;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoices');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    setLoading(true);
    setError(null);

    try {
      const downloadUrl = await StripeService.downloadInvoice(invoiceId);
      window.open(downloadUrl, '_blank');
    } catch (err: any) {
      setError(err.message || 'Failed to download invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    if (!provider?.subscription?.stripeSubscriptionId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const subscriptionDetails = await StripeService.getSubscriptionDetails(
        provider.subscription.stripeSubscriptionId
      );

      // Update local subscription data based on Stripe response
      const updatedSubscription = {
        ...provider.subscription,
        status: subscriptionDetails.status,
        expiresAt: new Date(subscriptionDetails.current_period_end * 1000).toISOString()
      };

      await SubscriptionService.updateProviderSubscription(provider.id, updatedSubscription);
    } catch (err: any) {
      setError(err.message || 'Failed to check subscription status');
      console.error('Subscription status check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const isFeatureAvailable = (feature: string): boolean => {
    if (!provider || !currentPlan) {
      return false;
    }

    // Check if the feature is included in the current plan
    return currentPlan.features.some(f => 
      f.toLowerCase().includes(feature.toLowerCase())
    );
  };

  const getRemainingLeads = (): number => {
    if (!provider) return 0;
    return provider.subscription.leadsRemaining || 0;
  };

  const deductLead = async (): Promise<boolean> => {
    if (!provider) {
      throw new Error('No provider found');
    }

    setLoading(true);
    setError(null);

    try {
      const success = await SubscriptionService.deductLead(provider.id);
      
      if (!success) {
        setError('No leads remaining. Please upgrade your plan.');
        return false;
      }

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to deduct lead');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentPlan,
    loading,
    error,
    upgradeSubscription,
    cancelSubscription,
    updatePaymentMethod,
    getInvoices,
    downloadInvoice,
    checkSubscriptionStatus,
    isFeatureAvailable,
    getRemainingLeads,
    deductLead
  };
};

// Utility function to check if subscription is active
export const isSubscriptionActive = (provider: ServiceProvider | null): boolean => {
  if (!provider?.subscription) return false;
  
  return (
    provider.subscription.status === 'active' || 
    provider.subscription.status === 'trial'
  ) && new Date(provider.subscription.expiresAt) > new Date();
};

// Utility function to check if provider can access leads
export const canAccessLeads = (provider: ServiceProvider | null): boolean => {
  if (!provider?.subscription) return false;
  
  return isSubscriptionActive(provider) && (
    provider.subscription.leadsRemaining > 0 || 
    provider.subscription.monthlyLeadLimit === -1
  );
};

// Utility function to get subscription color for UI
export const getSubscriptionStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
    case 'trial': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
    case 'past_due': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
    case 'canceled': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
    case 'incomplete': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900';
    default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
  }
};

// Utility function to format subscription status
export const formatSubscriptionStatus = (status: string) => {
  switch (status) {
    case 'trialing': 
    case 'trial': 
      return 'Free Trial';
    case 'past_due': 
      return 'Past Due';
    case 'canceled': 
      return 'Cancelled';
    case 'incomplete': 
      return 'Incomplete';
    default: 
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};
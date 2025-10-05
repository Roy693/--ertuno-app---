// Stripe Service for Subscription Management
// This service handles Stripe integration for subscription payments

export class StripeService {
  private static stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  private static apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  /**
   * Initialize Stripe checkout session for subscription
   */
  static async createCheckoutSession(
    planId: string, 
    providerId: string, 
    billingCycle: 'monthly' | 'yearly' = 'monthly'
  ): Promise<{ sessionId: string; url: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          planId,
          providerId,
          billingCycle,
          successUrl: `${window.location.origin}/provider/dashboard?subscription=success`,
          cancelUrl: `${window.location.origin}/provider/dashboard?subscription=cancelled`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to initialize payment');
    }
  }

  /**
   * Create customer portal session for subscription management
   */
  static async createPortalSession(
    customerId: string
  ): Promise<{ url: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/api/stripe/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          customerId,
          returnUrl: `${window.location.origin}/provider/dashboard`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to access billing portal');
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/stripe/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({ subscriptionId })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to cancel subscription');
    }
  }

  /**
   * Update subscription plan
   */
  static async updateSubscription(
    subscriptionId: string,
    newPlanId: string,
    billingCycle: 'monthly' | 'yearly' = 'monthly'
  ): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/stripe/update-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          subscriptionId,
          newPlanId,
          billingCycle
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update subscription');
    }
  }

  /**
   * Get subscription details from Stripe
   */
  static async getSubscriptionDetails(subscriptionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/api/stripe/subscription/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription details');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch subscription details');
    }
  }

  /**
   * Get invoices for a customer
   */
  static async getInvoices(customerId: string, limit = 10): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/stripe/invoices/${customerId}?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }

      const data = await response.json();
      return data.invoices || [];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch invoices');
    }
  }

  /**
   * Download invoice PDF
   */
  static async downloadInvoice(invoiceId: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/api/stripe/invoice/${invoiceId}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      const data = await response.json();
      return data.downloadUrl;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to download invoice');
    }
  }

  /**
   * Create payment intent for one-time service payments
   */
  static async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata: Record<string, string> = {}
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/api/stripe/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          metadata
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to initialize payment');
    }
  }

  /**
   * Confirm payment intent
   */
  static async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/stripe/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`
        },
        body: JSON.stringify({
          paymentIntentId,
          paymentMethodId
        })
      });

      if (!response.ok) {
        throw new Error('Payment confirmation failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Payment confirmation failed');
    }
  }

  /**
   * Get webhook events for processing
   */
  static async processWebhookEvent(
    event: any,
    signature: string
  ): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/stripe/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': signature
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        throw new Error('Webhook processing failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Webhook processing failed');
    }
  }

  /**
   * Redirect to Stripe Checkout
   */
  static async redirectToCheckout(sessionId: string): Promise<void> {
    if (!this.stripeKey) {
      throw new Error('Stripe publishable key not configured');
    }

    // For demo purposes, we'll simulate the redirect
    // In a real app, you'd use the official Stripe JS library
    console.log('Redirecting to Stripe Checkout:', sessionId);
    
    // Simulate successful payment flow
    setTimeout(() => {
      window.location.href = `${window.location.origin}/provider/dashboard?subscription=success&session_id=${sessionId}`;
    }, 2000);
  }

  /**
   * Get current authentication token
   */
  private static async getAuthToken(): Promise<string> {
    // In a real app, this would get the Firebase ID token
    // For demo purposes, return a mock token
    return 'mock-auth-token';
  }

  /**
   * Format amount for display
   */
  static formatAmount(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  }

  /**
   * Validate credit card number (basic validation)
   */
  static validateCardNumber(cardNumber: string): boolean {
    // Remove spaces and check if it's a valid number
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
  }

  /**
   * Validate expiry date
   */
  static validateExpiryDate(month: string, year: string): boolean {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
  }

  /**
   * Validate CVV
   */
  static validateCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }
}

// Subscription status helper functions
export const getSubscriptionStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
    case 'trialing': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
    case 'past_due': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
    case 'canceled': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
    case 'incomplete': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900';
    default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
  }
};

export const formatSubscriptionStatus = (status: string) => {
  switch (status) {
    case 'trialing': return 'Free Trial';
    case 'past_due': return 'Past Due';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

// Export for use in components
export default StripeService;
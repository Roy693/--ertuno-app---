import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { SUBSCRIPTION_PLANS } from '../../utils/constants';

interface PlanSelectorProps {
  selectedPlan: string | null;
  onSelectPlan: (planId: string) => void;
  onContinue: () => void;
  loading?: boolean;
  showFreeTrial?: boolean;
  billingCycle?: 'monthly' | 'yearly';
  onBillingCycleChange?: (cycle: 'monthly' | 'yearly') => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  selectedPlan,
  onSelectPlan,
  onContinue,
  loading = false,
  showFreeTrial = true,
  billingCycle = 'monthly',
  onBillingCycleChange
}) => {
  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic': return <Zap className="w-8 h-8 text-blue-500" />;
      case 'premium': return <Crown className="w-8 h-8 text-purple-500" />;
      case 'enterprise': return <Shield className="w-8 h-8 text-gold-500" />;
      default: return <Zap className="w-8 h-8 text-gray-500" />;
    }
  };

  const calculateYearlyDiscount = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 10; // 2 months free
    const savings = monthlyPrice * 2;
    return { yearlyPrice, savings };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Plan
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Start growing your business with the right plan for you
        </p>

        {onBillingCycleChange && (
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-lg ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => onBillingCycleChange(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                billingCycle === 'yearly' ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
              Yearly
              <span className="ml-2 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </span>
          </div>
        )}

        {showFreeTrial && (
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg max-w-md mx-auto">
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              🎉 Start with a 14-day free trial on any plan!
            </p>
            <p className="text-blue-600 dark:text-blue-300 text-sm mt-1">
              No credit card required. Cancel anytime.
            </p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const { yearlyPrice, savings } = calculateYearlyDiscount(plan.price);
          const isSelected = selectedPlan === plan.id;
          const isRecommended = plan.id === 'premium';
          
          return (
            <motion.div
              key={plan.id}
              className={`relative rounded-2xl p-8 border-2 transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg scale-105'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
              }`}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPlan(plan.id)}
            >
              {isRecommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {getPlanIcon(plan.id)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${billingCycle === 'yearly' ? (yearlyPrice / 12).toFixed(2) : plan.price}
                  </span>
                  <span className="text-lg text-gray-500 dark:text-gray-400">/month</span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                    Save ${savings}/month • Billed ${yearlyPrice}/year
                  </p>
                )}
                {billingCycle === 'monthly' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Billed monthly
                  </p>
                )}
                {showFreeTrial && (
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    14-day free trial included
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                variant={isSelected ? "primary" : "outline"}
                fullWidth
                className={isSelected ? "ring-2 ring-primary-500" : ""}
              >
                {isSelected ? 'Selected' : `Choose ${plan.name}`}
              </Button>

              {isSelected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 border-2 border-primary-500 rounded-2xl pointer-events-none"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={onContinue}
            loading={loading}
            className="px-12 py-4 text-lg"
          >
            {showFreeTrial ? 'Start Free Trial' : 'Continue to Payment'}
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            {showFreeTrial 
              ? "You won't be charged until your trial ends. Cancel anytime."
              : "Secure payment powered by Stripe"
            }
          </p>
        </motion.div>
      )}

      {/* Features Comparison */}
      <div className="mt-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Compare Plans
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  Features
                </th>
                {SUBSCRIPTION_PLANS.map(plan => (
                  <th key={plan.id} className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { feature: 'Monthly Leads', values: ['10', '30', 'Unlimited'] },
                { feature: 'Profile Listing', values: ['Basic', 'Featured', 'Top-tier'] },
                { feature: 'Customer Support', values: ['Email', 'Priority', '24/7 Dedicated'] },
                { feature: 'Analytics', values: ['Basic', 'Detailed', 'Custom Reports'] },
                { feature: 'API Access', values: ['❌', '❌', '✅'] },
                { feature: 'White-label Options', values: ['❌', '❌', '✅'] }
              ].map((row, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                    {row.feature}
                  </td>
                  {row.values.map((value, valueIndex) => (
                    <td key={valueIndex} className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Frequently Asked Questions
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              question: "Can I change my plan anytime?",
              answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the billing."
            },
            {
              question: "What happens if I exceed my lead limit?",
              answer: "You'll receive notifications when you're close to your limit. You can either upgrade your plan or wait for your monthly reset."
            },
            {
              question: "Is there a contract or commitment?",
              answer: "No contracts required. All plans are month-to-month and you can cancel anytime. Your access continues until the end of your billing period."
            },
            {
              question: "What payment methods do you accept?",
              answer: "We accept all major credit cards (Visa, Mastercard, American Express) and process payments securely through Stripe."
            }
          ].map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {faq.question}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
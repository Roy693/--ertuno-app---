import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp,
  Users,
  DollarSign,
  Star,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  Calendar,
  Search,
  Settings,
  Crown,
  Zap,
  CreditCard
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SubscriptionManager } from '../components/subscription/SubscriptionManager';
import { LeadUnlockModal } from '../components/provider/LeadUnlockModal';
import StripeService from '../services/stripe';
import type { ServiceProvider, ServiceRequest, ServiceOffer, AIMatchResult } from '../types';
import { SERVICE_CATEGORIES } from '../utils/constants';

interface ProviderDashboardProps {
  provider: ServiceProvider;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ provider }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'bookings' | 'settings' | 'subscription'>('overview');

  const [offers, setOffers] = useState<ServiceOffer[]>([]);
  const [matchedLeads, setMatchedLeads] = useState<(ServiceRequest & { matchScore?: AIMatchResult })[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedLead, setSelectedLead] = useState<ServiceRequest | null>(null);
  const [showLeadUnlock, setShowLeadUnlock] = useState(false);
  const [leadToUnlock, setLeadToUnlock] = useState<ServiceRequest & { matchScore?: AIMatchResult } | null>(null);
  const [offerFormData, setOfferFormData] = useState({
    message: '',
    price: 0,
    estimatedDuration: 0,
    availableDate: ''
  });

  // Mock data for demo
  useEffect(() => {
    const mockLeads: ServiceRequest[] = [
      {
        id: '1',
        userId: 'user1',
        title: 'Kitchen Faucet Repair',
        description: 'My kitchen faucet is leaking from the base. It\'s been dripping for about a week and getting worse. Need someone licensed and experienced with Delta faucets.',
        category: 'home-maintenance',
        urgency: 'medium',
        location: {
          latitude: 40.7589,
          longitude: -73.9851,
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10025',
          country: 'US'
        },
        budget: { min: 80, max: 150, currency: 'USD' },
        preferredDate: '2024-01-20',
        timeFrame: 'flexible',
        status: 'pending',
        attachments: [],
        tags: ['licensed', 'delta faucet', 'experienced'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        userId: 'user2',
        title: 'Emergency Electrical Outlet Installation',
        description: 'Need new outlet installed in home office for multiple devices. Current setup is overloaded. Urgent as I work from home.',
        category: 'home-maintenance',
        urgency: 'high',
        location: {
          latitude: 40.7505,
          longitude: -73.9934,
          address: '456 Park Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10016',
          country: 'US'
        },
        budget: { min: 150, max: 300, currency: 'USD' },
        preferredDate: '2024-01-18',
        timeFrame: 'asap',
        status: 'pending',
        attachments: [],
        tags: ['electrical', 'urgent', 'home office'],
        createdAt: '2024-01-15T14:30:00Z',
        updatedAt: '2024-01-15T14:30:00Z'
      },
      {
        id: '3',
        userId: 'user3',
        title: 'Bathroom Deep Clean',
        description: 'Need professional deep cleaning of master bathroom. Includes grout cleaning, tile restoration, and general sanitization.',
        category: 'cleaning-services',
        urgency: 'low',
        location: {
          latitude: 40.7614,
          longitude: -73.9776,
          address: '789 Broadway',
          city: 'New York',
          state: 'NY',
          zipCode: '10003',
          country: 'US'
        },
        budget: { min: 100, max: 200, currency: 'USD' },
        preferredDate: '2024-01-25',
        timeFrame: 'specific',
        status: 'pending',
        attachments: [],
        tags: ['deep clean', 'bathroom', 'grout'],
        createdAt: '2024-01-15T09:15:00Z',
        updatedAt: '2024-01-15T09:15:00Z'
      }
    ];

    // Filter leads based on provider's service categories
    const relevantLeads = mockLeads.filter(lead => 
      provider.serviceCategories.some(cat => lead.category === cat) ||
      provider.serviceCategories.includes('home-maintenance') // Catch-all for maintenance
    );


    setMatchedLeads(relevantLeads.map(lead => ({
      ...lead,
      matchScore: {
        providerId: provider.id,
        score: Math.random() * 0.4 + 0.6, // 60-100% match
        reasons: ['Location match', 'Category expertise', 'Good rating'],
        distance: Math.random() * 15 + 2, // 2-17 miles
        estimatedCost: lead.budget.min + (lead.budget.max - lead.budget.min) * Math.random()
      }
    })));
  }, [provider]);

  const filteredLeads = matchedLeads.filter(lead => {
    const matchesSearch = lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || lead.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'emergency': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSubscriptionColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'text-blue-600 dark:text-blue-400';
      case 'premium': return 'text-purple-600 dark:text-purple-400';
      case 'enterprise': return 'text-gold-600 dark:text-gold-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const handleSendOffer = async (leadId: string) => {
    if (!provider.subscription || provider.subscription.leadsRemaining <= 0) {
      // Handle subscription limit
      alert('You have reached your monthly lead limit. Please upgrade your subscription.');
      return;
    }

    setLoading(true);
    try {
      // In real app, this would call the API
      const offer: ServiceOffer = {
        id: Date.now().toString(),
        requestId: leadId,
        providerId: provider.id,
        message: offerFormData.message,
        price: offerFormData.price,
        estimatedDuration: offerFormData.estimatedDuration,
        availableDate: offerFormData.availableDate,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setOffers(prev => [...prev, offer]);
      setSelectedLead(null);
      setOfferFormData({ message: '', price: 0, estimatedDuration: 0, availableDate: '' });
      
      // Simulate lead deduction
      // In real app: await SubscriptionService.deductLead(provider.id);
      
      alert('Offer sent successfully!');
    } catch (error) {
      console.error('Error sending offer:', error);
      alert('Failed to send offer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Subscription management handlers
  const handleUpgradeSubscription = async (planId: string) => {
    setLoading(true);
    try {
      const { sessionId } = await StripeService.createCheckoutSession(planId, provider.id);
      await StripeService.redirectToCheckout(sessionId);
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Failed to upgrade subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!provider.subscription.stripeSubscriptionId) {
      alert('No active subscription to cancel.');
      return;
    }

    setLoading(true);
    try {
      await StripeService.cancelSubscription(provider.subscription.stripeSubscriptionId);
      alert('Subscription cancelled successfully. You will retain access until the end of your billing period.');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    try {
      // In a real app, you'd get the customer ID from the provider data
      const customerId = 'cus_' + provider.id; // Mock customer ID
      const { url } = await StripeService.createPortalSession(customerId);
      window.location.href = url;
    } catch (error) {
      console.error('Error accessing billing portal:', error);
      alert('Failed to access billing portal. Please try again.');
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const downloadUrl = await StripeService.downloadInvoice(invoiceId);
      // Open in new tab or trigger download
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  // Lead unlocking handlers
  const handleUnlockLead = async (leadId: string) => {
    setLoading(true);
    try {
      // In real app, this would call the API to unlock the lead and deduct credit
      // await SubscriptionService.deductLead(provider.id);
      
      // Simulate successful unlock
      console.log('Lead unlocked:', leadId);
      
      // Close modal
      setShowLeadUnlock(false);
      setLeadToUnlock(null);
      
    } catch (error) {
      console.error('Error unlocking lead:', error);
      alert('Failed to unlock lead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewLeadDetails = (lead: ServiceRequest & { matchScore?: AIMatchResult }) => {
    setLeadToUnlock(lead);
    setShowLeadUnlock(true);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Leads</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredLeads.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600 dark:text-green-400">
              +{Math.floor(Math.random() * 5 + 2)} new today
            </span>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Offers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{offers.length}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Send className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-blue-600 dark:text-blue-400">
              {Math.floor(offers.length * 0.3)} accepted
            </span>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(provider.hourlyRate * provider.totalJobs * 0.8).toFixed(0)}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600 dark:text-green-400">
              +12% from last month
            </span>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rating</p>
              <div className="flex items-center space-x-1">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{provider.rating.toFixed(1)}</p>
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {provider.totalJobs} completed jobs
            </span>
          </div>
        </motion.div>
      </div>

      {/* Subscription Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Subscription Status
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveTab('subscription')}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Plan</p>
            <div className="flex items-center space-x-2">
              <span className={`text-lg font-bold capitalize ${getSubscriptionColor(provider.subscription.plan)}`}>
                {provider.subscription.plan}
              </span>
              {provider.subscription.plan === 'enterprise' && <Crown className="w-4 h-4 text-yellow-500" />}
              {provider.subscription.plan === 'premium' && <Zap className="w-4 h-4 text-purple-500" />}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Leads Remaining</p>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {provider.subscription.leadsRemaining}
              </span>
              <span className="text-sm text-gray-500">
                / {provider.subscription.monthlyLeadLimit === -1 ? '∞' : provider.subscription.monthlyLeadLimit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-primary-500 h-2 rounded-full" 
                style={{ 
                  width: provider.subscription.monthlyLeadLimit === -1 
                    ? '100%' 
                    : `${(provider.subscription.leadsRemaining / provider.subscription.monthlyLeadLimit) * 100}%` 
                }}
              />
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Next Billing</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {new Date(provider.subscription.expiresAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {provider.subscription.leadsRemaining <= 3 && provider.subscription.monthlyLeadLimit !== -1 && (
          <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Low on leads
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  You have {provider.subscription.leadsRemaining} leads remaining. Consider upgrading to continue receiving opportunities.
                </p>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setActiveTab('subscription')}
                >
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            { action: 'New lead available', details: 'Kitchen Faucet Repair in Manhattan', time: '2 minutes ago', type: 'lead' },
            { action: 'Offer accepted', details: 'Bathroom cleaning project', time: '1 hour ago', type: 'success' },
            { action: 'Job completed', details: 'Electrical outlet installation', time: '3 hours ago', type: 'completed' },
            { action: 'New review received', details: '5-star rating from John D.', time: '1 day ago', type: 'review' }
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${
                activity.type === 'lead' ? 'bg-blue-100 dark:bg-blue-900' :
                activity.type === 'success' ? 'bg-green-100 dark:bg-green-900' :
                activity.type === 'completed' ? 'bg-purple-100 dark:bg-purple-900' :
                'bg-yellow-100 dark:bg-yellow-900'
              }`}>
                {activity.type === 'lead' && <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                {activity.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />}
                {activity.type === 'completed' && <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                {activity.type === 'review' && <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.action}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.details}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLeads = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Categories</option>
          {SERVICE_CATEGORIES.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => (
          <motion.div
            key={lead.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {lead.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(lead.urgency)}`}>
                    {lead.urgency}
                  </span>
                  {lead.matchScore && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {Math.round(lead.matchScore.score * 100)}% match
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {lead.description}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{lead.location.city}, {lead.location.state}</span>
                    {lead.matchScore && (
                      <span className="text-xs">({lead.matchScore.distance.toFixed(1)} mi)</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>${lead.budget.min} - ${lead.budget.max}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span className="capitalize">{lead.timeFrame}</span>
                  </div>
                </div>

                {lead.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {lead.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {lead.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{lead.tags.length - 3} more</span>
                    )}
                  </div>
                )}

                {lead.matchScore && lead.matchScore.reasons.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                      Why this is a good match:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {lead.matchScore.reasons.map((reason, index) => (
                        <span key={index} className="text-xs text-green-700 dark:text-green-300">
                          • {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleViewLeadDetails(lead)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Lead (1 Credit)
                </Button>
                <Button variant="ghost" size="sm">
                  Preview
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No leads available
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery || filterCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Check back later for new opportunities'
            }
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Provider Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome back, {provider.name}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {provider.businessName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {provider.isVerified ? '✓ Verified' : 'Pending Verification'}
                </p>
              </div>
              
              {provider.avatar ? (
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="w-10 h-10 rounded-full border-2 border-primary-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {provider.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview', icon: TrendingUp },
            { key: 'leads', label: 'Available Leads', icon: Users },
            { key: 'bookings', label: 'My Bookings', icon: Calendar },
            { key: 'subscription', label: 'Subscription', icon: CreditCard },
            { key: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'leads' && renderLeads()}
        {activeTab === 'bookings' && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Bookings Management
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Feature coming soon - manage your scheduled appointments and completed jobs
            </p>
          </div>
        )}
        {activeTab === 'subscription' && (
          <SubscriptionManager
            provider={provider}
            onUpgrade={handleUpgradeSubscription}
            onCancel={handleCancelSubscription}
            onUpdatePaymentMethod={handleUpdatePaymentMethod}
            onDownloadInvoice={handleDownloadInvoice}
            loading={loading}
          />
        )}
        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Provider Settings
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Feature coming soon - update your profile, availability, and preferences
            </p>
          </div>
        )}
      </div>

      {/* Offer Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Send Offer
              </h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Lead Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {selectedLead.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {selectedLead.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>📍 {selectedLead.location.city}, {selectedLead.location.state}</span>
                <span>💰 ${selectedLead.budget.min} - ${selectedLead.budget.max}</span>
                <span className="capitalize">{selectedLead.urgency} priority</span>
              </div>
            </div>

            {/* Offer Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Message
                </label>
                <textarea
                  value={offerFormData.message}
                  onChange={(e) => setOfferFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Introduce yourself and explain why you're the right choice for this job..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Price ($)
                  </label>
                  <input
                    type="number"
                    value={offerFormData.price}
                    onChange={(e) => setOfferFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="150"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estimated Duration (hours)
                  </label>
                  <input
                    type="number"
                    value={offerFormData.estimatedDuration}
                    onChange={(e) => setOfferFormData(prev => ({ ...prev, estimatedDuration: Number(e.target.value) }))}
                    placeholder="2"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Available Date
                </label>
                <input
                  type="date"
                  value={offerFormData.availableDate}
                  onChange={(e) => setOfferFormData(prev => ({ ...prev, availableDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Cost Notice */}
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  This will use 1 of your {provider.subscription.leadsRemaining} remaining leads
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="ghost" onClick={() => setSelectedLead(null)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={() => handleSendOffer(selectedLead.id)}
                loading={loading}
                disabled={!offerFormData.message || !offerFormData.price || !offerFormData.availableDate}
              >
                Send Offer
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Lead Unlock Modal */}
      {showLeadUnlock && leadToUnlock && (
        <LeadUnlockModal
          lead={leadToUnlock}
          provider={provider}
          onUnlock={handleUnlockLead}
          onClose={() => {
            setShowLeadUnlock(false);
            setLeadToUnlock(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};
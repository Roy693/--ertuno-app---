import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  Settings, 
  Plus, 
  MessageCircle,
  Search,
  Grid,
  List,
  FileText,
  Users,
  Briefcase,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Eye
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ChatList } from '../components/chat/ChatList';
import { ChatWindow } from '../components/chat/ChatWindow';
import { ServiceRequestForm } from '../components/requests/ServiceRequestForm';
import { ServiceRequestCard } from '../components/requests/ServiceRequestCard';
import { useAuth } from '../hooks/useAuth';
import { ServicesService } from '../services/firebase';
import { ServiceRequestsService } from '../services/serviceRequests';
import { ChatService } from '../services/chat';
import type { Service, ServiceRequest, Conversation } from '../types';

type DashboardView = 'overview' | 'requests' | 'chat' | 'services' | 'professional';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [services, setServices] = useState<Service[]>([]);
  const [myRequests, setMyRequests] = useState<ServiceRequest[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeChats: 0,
    completedServices: 0,
    earnings: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Load user's services
      const userServices = await ServicesService.getUserServices(user.id);
      setServices(userServices);

      // Load user's service requests
      const userRequests = await ServiceRequestsService.getUserServiceRequests(user.id);
      setMyRequests(userRequests);

      // Update stats
      setStats({
        totalRequests: userRequests.length,
        activeChats: 0, // Will be updated when conversations load
        completedServices: userRequests.filter(r => r.status === 'completed').length,
        earnings: 0 // Calculate from completed services
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleCreateRequestSuccess = (requestId: string) => {
    setShowCreateForm(false);
    loadDashboardData();
  };

  const handleViewRequest = (request: ServiceRequest) => {
    // Navigate to request details or open modal
    console.log('View request:', request.id);
  };

  if (!user) return null;

  // Overview Dashboard
  const OverviewDashboard = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 dark:bg-primary-800 rounded-lg">
              <FileText className="w-6 h-6 text-primary-600 dark:text-primary-300" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalRequests}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Chats</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeChats}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-800 rounded-lg">
              <Star className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedServices}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Earnings</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.earnings}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={() => setShowCreateForm(true)}
              className="w-full justify-start"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Service Request
            </Button>
            <Button
              variant="secondary"
              onClick={() => setCurrentView('requests')}
              className="w-full justify-start"
            >
              <Eye className="w-4 h-4 mr-2" />
              Browse Requests
            </Button>
            <Button
              variant="secondary"
              onClick={() => setCurrentView('chat')}
              className="w-full justify-start"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Open Messages
            </Button>
          </div>
        </motion.div>

        {/* Recent Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Requests</h3>
          {myRequests.slice(0, 3).map((request) => (
            <div key={request.id} className="mb-3 last:mb-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {request.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {request.responseCount || 0} responses
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  request.status === 'open' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                }`}>
                  {request.status}
                </span>
              </div>
            </div>
          ))}
          {myRequests.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">No requests yet</p>
          )}
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-primary-600 dark:text-primary-300" />
              </div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Welcome to ERTUNO!</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Just now</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  // Chat View
  const ChatView = () => (
    <div className="h-[calc(100vh-200px)] bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex h-full">
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
          <ChatList
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversation?.id}
          />
        </div>
        <div className="flex-1">
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              onBack={() => setSelectedConversation(null)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a conversation from the sidebar to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Requests View
  const RequestsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          My Service Requests
        </h3>
        <Button
          variant="primary"
          onClick={() => setShowCreateForm(true)}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading requests...</p>
          </div>
        </div>
      ) : myRequests.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No requests yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Post your first service request to get started
          </p>
          <Button variant="primary" onClick={() => setShowCreateForm(true)}>
            Create Your First Request
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myRequests.map((request) => (
            <ServiceRequestCard
              key={request.id}
              request={request}
              onViewDetails={handleViewRequest}
              showActions={false}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" onClick={handleSignOut} className="flex items-center">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                Welcome back, {user.name}!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your requests, chat with professionals, and grow your network
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'requests', label: 'My Requests', icon: FileText },
                { id: 'chat', label: 'Messages', icon: MessageCircle },
                { id: 'services', label: 'Services', icon: Briefcase }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCurrentView(id as DashboardView)}
                  className={`${
                    currentView === id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {currentView === 'overview' && <OverviewDashboard />}
        {currentView === 'chat' && <ChatView />}
        {currentView === 'requests' && <RequestsView />}
        {currentView === 'services' && <OverviewDashboard />} {/* Placeholder for services view */}
      </div>

      {/* Create Request Modal */}
      {showCreateForm && (
        <ServiceRequestForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleCreateRequestSuccess}
        />
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  Eye,
  MessageCircle,
  Star,
  Filter
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { BackButton } from '../../components/ui/BackButton';

export const JobPosterDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'drafts'>('active');

  // Mock data for job posts
  const jobPosts = {
    active: [
      {
        id: '1',
        title: 'Plumbing Repair in Kitchen',
        category: 'Home Repair',
        budget: { min: 100, max: 300, currency: '€' },
        location: 'Milano, IT',
        responses: 12,
        views: 45,
        createdAt: '2024-10-20',
        status: 'open'
      },
      {
        id: '2',
        title: 'Logo Design for New Business',
        category: 'Design',
        budget: { min: 200, max: 500, currency: '€' },
        location: 'Roma, IT',
        responses: 8,
        views: 67,
        createdAt: '2024-10-18',
        status: 'in_progress'
      }
    ],
    completed: [
      {
        id: '3',
        title: 'House Cleaning Service',
        category: 'Cleaning',
        budget: { min: 50, max: 80, currency: '€' },
        location: 'Napoli, IT',
        responses: 15,
        views: 89,
        createdAt: '2024-09-15',
        status: 'completed',
        rating: 5
      }
    ],
    drafts: [
      {
        id: '4',
        title: 'Web Development Project',
        category: 'Technology',
        budget: { min: 1000, max: 3000, currency: '€' },
        location: 'Torino, IT',
        responses: 0,
        views: 0,
        createdAt: '2024-10-25',
        status: 'draft'
      }
    ]
  };

  const stats = [
    { label: 'Active Jobs', value: jobPosts.active.length, icon: Search, color: 'blue' },
    { label: 'Total Responses', value: '35', icon: MessageCircle, color: 'green' },
    { label: 'Completed Projects', value: jobPosts.completed.length, icon: Star, color: 'purple' },
    { label: 'Total Spent', value: '€1,250', icon: DollarSign, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackButton />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Job Poster Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your service requests and find professionals
                </p>
              </div>
            </div>
            <Button variant="primary" icon={Plus}>
              Post New Job
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {(['active', 'completed', 'drafts'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab} Jobs ({jobPosts[tab].length})
                </button>
              ))}
            </nav>
          </div>

          {/* Job Posts List */}
          <div className="p-6">
            {jobPosts[activeTab].length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No {activeTab} jobs
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {activeTab === 'drafts' 
                    ? 'Start creating your first job post'
                    : `You don't have any ${activeTab} jobs yet`
                  }
                </p>
                <Button variant="primary" icon={Plus}>
                  Create New Job Post
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobPosts[activeTab].map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {job.createdAt}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {job.budget.min}-{job.budget.max} {job.budget.currency}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.status === 'open' ? 'bg-green-100 text-green-800' :
                        job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {job.views} views
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {job.responses} responses
                        </span>
                        {'rating' in job && job.rating && (
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            {job.rating}/5
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {job.status !== 'completed' && (
                          <Button variant="primary" size="sm">
                            Manage
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
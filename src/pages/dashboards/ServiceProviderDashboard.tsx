import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  Star,
  MessageCircle,
  TrendingUp,
  Award,
  Settings
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { BackButton } from '../../components/ui/BackButton';

export const ServiceProviderDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'active' | 'completed'>('opportunities');

  // Mock data for service opportunities and jobs
  const opportunities = [
    {
      id: '1',
      title: 'Plumbing Repair in Kitchen',
      category: 'Home Repair',
      budget: { min: 100, max: 300, currency: '€' },
      location: 'Milano, IT',
      distance: '2.5 km',
      postedAt: '2 hours ago',
      responses: 5,
      urgency: 'high'
    },
    {
      id: '2',
      title: 'House Cleaning Service',
      category: 'Cleaning',
      budget: { min: 50, max: 80, currency: '€' },
      location: 'Milano, IT',
      distance: '1.2 km',
      postedAt: '4 hours ago',
      responses: 12,
      urgency: 'medium'
    }
  ];

  const activeJobs = [
    {
      id: '3',
      title: 'Logo Design for New Business',
      category: 'Design',
      budget: 350,
      currency: '€',
      client: 'Mario Rossi',
      location: 'Roma, IT',
      deadline: '2024-11-01',
      progress: 65,
      status: 'in_progress'
    }
  ];

  const completedJobs = [
    {
      id: '4',
      title: 'Website Development',
      category: 'Technology',
      budget: 1200,
      currency: '€',
      client: 'Anna Bianchi',
      location: 'Milano, IT',
      completedAt: '2024-10-15',
      rating: 5,
      review: 'Excellent work, very professional!'
    }
  ];

  const stats = [
    { label: 'Active Jobs', value: activeJobs.length, icon: Briefcase, color: 'blue' },
    { label: 'Monthly Earnings', value: '€2,450', icon: DollarSign, color: 'green' },
    { label: 'Rating Average', value: '4.9', icon: Star, color: 'yellow' },
    { label: 'Profile Views', value: '127', icon: Users, color: 'purple' }
  ];

  const profileCompletion = 85;

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
                  Service Provider Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Find jobs, manage projects, and grow your business
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" icon={Settings}>
                Profile Settings
              </Button>
              <Button variant="primary" icon={Search}>
                Browse Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Completion Alert */}
        {profileCompletion < 100 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="w-5 h-5 text-blue-500 mr-2" />
                <div>
                  <p className="text-blue-800 dark:text-blue-200 font-medium">
                    Complete your profile ({profileCompletion}%)
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">
                    Add portfolio items and certifications to get more job opportunities
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Complete Profile
              </Button>
            </div>
          </motion.div>
        )}

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
              {(['opportunities', 'active', 'completed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab === 'opportunities' ? 'Job Opportunities' : 
                   tab === 'active' ? 'Active Projects' : 'Completed'}
                  {tab === 'opportunities' && ` (${opportunities.length})`}
                  {tab === 'active' && ` (${activeJobs.length})`}
                  {tab === 'completed' && ` (${completedJobs.length})`}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Job Opportunities Tab */}
            {activeTab === 'opportunities' && (
              <div className="space-y-4">
                {opportunities.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {job.title}
                          </h3>
                          {job.urgency === 'high' && (
                            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location} • {job.distance}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {job.postedAt}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {job.budget.min}-{job.budget.max} {job.budget.currency}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {job.responses} responses
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {job.category}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="primary" size="sm">
                          Send Proposal
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Active Projects Tab */}
            {activeTab === 'active' && (
              <div className="space-y-4">
                {activeJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No active projects
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Browse job opportunities to start earning
                    </p>
                    <Button variant="primary" icon={Search}>
                      Browse Jobs
                    </Button>
                  </div>
                ) : (
                  activeJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            Client: {job.client}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{job.budget} {job.currency}</span>
                            <span>Due: {job.deadline}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Progress: {job.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {job.category}
                        </span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" icon={MessageCircle}>
                            Message Client
                          </Button>
                          <Button variant="primary" size="sm">
                            Update Progress
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Completed Projects Tab */}
            {activeTab === 'completed' && (
              <div className="space-y-4">
                {completedJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          Client: {job.client}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{job.budget} {job.currency}</span>
                          <span>Completed: {job.completedAt}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < job.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {job.rating}/5 stars
                        </span>
                      </div>
                    </div>
                    {job.review && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                        <p className="text-gray-700 dark:text-gray-300 italic">
                          "{job.review}"
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {job.category}
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
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
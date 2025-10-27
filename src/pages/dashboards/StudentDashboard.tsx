import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Trophy, 
  Calendar, 
  Clock, 
  Star,
  Target,
  TrendingUp,
  MessageCircle,
  FileText,
  Award,
  MapPin,
  Plus,
  Search,
  Eye,
  Download
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { BackButton } from '../../components/ui/BackButton';

export const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'projects' | 'portfolio' | 'mentorship'>('opportunities');

  // Mock data for student activities
  const opportunities = [
    {
      id: '1',
      title: 'Frontend Developer Internship',
      company: 'TechStartup Milano',
      type: 'internship',
      duration: '6 months',
      stipend: { amount: 800, currency: '€/month' },
      location: 'Milano, IT',
      requirements: ['React', 'JavaScript', 'CSS'],
      deadline: '2024-11-15',
      applied: false,
      match_score: 92
    },
    {
      id: '2',
      title: 'Research Assistant - AI Lab',
      company: 'Politecnico di Milano',
      type: 'research',
      duration: '1 year',
      stipend: { amount: 1200, currency: '€/month' },
      location: 'Milano, IT',
      requirements: ['Python', 'Machine Learning', 'Research Experience'],
      deadline: '2024-11-30',
      applied: true,
      match_score: 88
    },
    {
      id: '3',
      title: 'Thesis Project - Smart Cities',
      company: 'Smart City Initiative',
      type: 'thesis',
      duration: '6 months',
      stipend: { amount: 500, currency: '€/month' },
      location: 'Roma, IT',
      requirements: ['IoT', 'Data Analysis', 'Urban Planning'],
      deadline: '2024-12-01',
      applied: false,
      match_score: 85
    }
  ];

  const currentProjects = [
    {
      id: '1',
      title: 'Smart City IoT Infrastructure',
      type: 'University Project',
      supervisor: 'Prof. Marco Rossi',
      role: 'Lead Developer',
      progress: 75,
      deadline: '2024-12-15',
      team_size: 5,
      skills_gained: ['IoT', 'Python', 'Data Visualization'],
      status: 'active'
    },
    {
      id: '2',
      title: 'Mobile App Development',
      type: 'Freelance Project',
      client: 'Local Business',
      role: 'Full-Stack Developer',
      progress: 40,
      deadline: '2024-11-20',
      payment: '€1,500',
      skills_gained: ['React Native', 'Node.js', 'MongoDB'],
      status: 'active'
    }
  ];

  const portfolioItems = [
    {
      id: '1',
      title: 'E-commerce Web Application',
      type: 'Web Development',
      description: 'Full-stack e-commerce platform with React and Node.js',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      images: 3,
      demo_url: 'https://demo.example.com',
      github_url: 'https://github.com/student/ecommerce',
      date: '2024-09-15',
      featured: true
    },
    {
      id: '2',
      title: 'Machine Learning Image Classifier',
      type: 'Research Project',
      description: 'CNN model for image classification with 95% accuracy',
      technologies: ['Python', 'TensorFlow', 'Keras', 'OpenCV'],
      images: 2,
      paper_url: 'https://arxiv.org/paper',
      github_url: 'https://github.com/student/ml-classifier',
      date: '2024-08-20',
      featured: false
    }
  ];

  const mentorships = [
    {
      id: '1',
      mentor: {
        name: 'Dr. Elena Verdi',
        title: 'Senior Software Engineer',
        company: 'Google',
        expertise: ['Software Architecture', 'System Design', 'Leadership'],
        rating: 4.9
      },
      program: 'Industry Mentorship Program',
      duration: '6 months',
      status: 'active',
      next_meeting: '2024-10-30 15:00',
      sessions_completed: 8,
      total_sessions: 12
    },
    {
      id: '2',
      mentor: {
        name: 'Prof. Anna Bianchi',
        title: 'Professor of Environmental Engineering',
        company: 'Politecnico di Milano',
        expertise: ['Research Methodology', 'Academic Writing', 'Project Management'],
        rating: 4.8
      },
      program: 'Academic Research Mentorship',
      duration: '1 year',
      status: 'active',
      next_meeting: '2024-11-02 10:00',
      sessions_completed: 15,
      total_sessions: 20
    }
  ];

  const stats = [
    { label: 'GPA', value: '3.85', icon: GraduationCap, color: 'blue' },
    { label: 'Active Projects', value: currentProjects.length, icon: BookOpen, color: 'green' },
    { label: 'Skills Acquired', value: '24', icon: Trophy, color: 'purple' },
    { label: 'Portfolio Items', value: portfolioItems.length, icon: Star, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackButton className="text-white hover:bg-white/10" />
              <div className="flex items-center">
                <GraduationCap className="w-8 h-8 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold">
                    Student Dashboard
                  </h1>
                  <p className="text-purple-100 mt-1">
                    Alessandro Conti • Computer Engineering • 2nd Year Master
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" icon={Plus} className="border-white text-white hover:bg-white hover:text-purple-600">
                Add Project
              </Button>
              <Button variant="primary" icon={Search} className="bg-white text-purple-600 hover:bg-purple-50">
                Find Opportunities
              </Button>
            </div>
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
              {(['opportunities', 'projects', 'portfolio', 'mentorship'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab === 'opportunities' && `Opportunities (${opportunities.length})`}
                  {tab === 'projects' && `My Projects (${currentProjects.length})`}
                  {tab === 'portfolio' && `Portfolio (${portfolioItems.length})`}
                  {tab === 'mentorship' && `Mentors (${mentorships.length})`}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Opportunities Tab */}
            {activeTab === 'opportunities' && (
              <div className="space-y-6">
                {opportunities.map((opportunity) => (
                  <motion.div
                    key={opportunity.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {opportunity.title}
                          </h3>
                          <div className="ml-3 flex items-center">
                            <Target className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm font-medium text-green-600">
                              {opportunity.match_score}% match
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="font-medium">{opportunity.company}</span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {opportunity.location}
                          </span>
                          <span>{opportunity.duration}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm mb-3">
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {opportunity.stipend.amount} {opportunity.stipend.currency}
                          </span>
                          <span className="text-red-600 dark:text-red-400">
                            Deadline: {opportunity.deadline}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Required:</span>
                          {opportunity.requirements.map((req) => (
                            <span key={req} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium mb-2 block ${
                          opportunity.type === 'internship' ? 'bg-blue-100 text-blue-800' :
                          opportunity.type === 'research' ? 'bg-purple-100 text-purple-800' :
                          opportunity.type === 'thesis' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {opportunity.type}
                        </span>
                        {opportunity.applied && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            Applied
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {!opportunity.applied ? (
                        <Button variant="primary" size="sm">
                          Apply Now
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          Applied
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                {currentProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {project.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>{project.type}</span>
                          {project.supervisor && <span>Supervisor: {project.supervisor}</span>}
                          {project.client && <span>Client: {project.client}</span>}
                          <span>Role: {project.role}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm mb-3">
                          <span>Deadline: {project.deadline}</span>
                          {project.team_size && <span>{project.team_size} team members</span>}
                          {project.payment && (
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {project.payment}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Skills:</span>
                          {project.skills_gained.map((skill) => (
                            <span key={skill} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {project.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Progress: {project.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="primary" size="sm">
                        Update Progress
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                {portfolioItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border border-gray-200 dark:border-gray-700 rounded-lg p-6 ${
                      item.featured ? 'ring-2 ring-yellow-400 bg-yellow-50 dark:bg-yellow-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          {item.featured && (
                            <Star className="w-5 h-5 text-yellow-500 ml-2" />
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-2 mb-3">
                          {item.technologies.map((tech) => (
                            <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{item.date}</span>
                          <span>{item.images} images</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {item.type}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex space-x-2">
                        {item.demo_url && (
                          <Button variant="outline" size="sm" icon={Eye}>
                            Live Demo
                          </Button>
                        )}
                        {item.github_url && (
                          <Button variant="outline" size="sm">
                            GitHub
                          </Button>
                        )}
                        {item.paper_url && (
                          <Button variant="outline" size="sm" icon={FileText}>
                            Research Paper
                          </Button>
                        )}
                      </div>
                      <Button variant="primary" size="sm">
                        Edit Project
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Mentorship Tab */}
            {activeTab === 'mentorship' && (
              <div className="space-y-6">
                {mentorships.map((mentorship) => (
                  <motion.div
                    key={mentorship.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {mentorship.mentor.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          {mentorship.mentor.title} at {mentorship.mentor.company}
                        </p>
                        <div className="flex items-center mb-3">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{mentorship.mentor.rating}/5</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Expertise:</span>
                          {mentorship.mentor.expertise.map((skill) => (
                            <span key={skill} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{mentorship.program}</span>
                          <span>{mentorship.duration}</span>
                          <span>Next: {mentorship.next_meeting}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {mentorship.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Sessions: {mentorship.sessions_completed}/{mentorship.total_sessions}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {Math.round((mentorship.sessions_completed / mentorship.total_sessions) * 100)}% complete
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${(mentorship.sessions_completed / mentorship.total_sessions) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" icon={MessageCircle}>
                        Message
                      </Button>
                      <Button variant="outline" size="sm" icon={Calendar}>
                        Schedule Session
                      </Button>
                      <Button variant="primary" size="sm">
                        View Program
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
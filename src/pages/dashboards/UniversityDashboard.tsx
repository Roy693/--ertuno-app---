import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  MessageCircle, 
  Calendar,
  MapPin,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Star,
  Building
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { BackButton } from '../../components/ui/BackButton';

export const UniversityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'students' | 'collaborations' | 'research'>('projects');

  // Mock data for university activities
  const projects = [
    {
      id: '1',
      title: 'Smart City IoT Infrastructure Development',
      department: 'Computer Engineering',
      status: 'active',
      students: 15,
      budget: { amount: 50000, currency: '€' },
      startDate: '2024-01-15',
      endDate: '2024-12-15',
      progress: 45,
      industry_partners: ['TechCorp', 'Milano Smart City'],
      supervisor: 'Prof. Marco Rossi'
    },
    {
      id: '2',
      title: 'Sustainable Energy Solutions for Historic Buildings',
      department: 'Environmental Engineering',
      status: 'planning',
      students: 8,
      budget: { amount: 75000, currency: '€' },
      startDate: '2024-02-01',
      endDate: '2024-11-30',
      progress: 15,
      industry_partners: ['GreenTech Solutions'],
      supervisor: 'Prof. Anna Bianchi'
    }
  ];

  const students = [
    {
      id: '1',
      name: 'Alessandro Conti',
      program: 'Master in Computer Engineering',
      year: '2nd Year',
      gpa: 3.8,
      projects: ['Smart City IoT Infrastructure'],
      skills: ['Python', 'IoT', 'Machine Learning'],
      availability: 'full-time',
      portfolio_score: 92
    },
    {
      id: '2',
      name: 'Giulia Romano',
      program: 'PhD in Environmental Engineering',
      year: '3rd Year',
      gpa: 3.9,
      projects: ['Sustainable Energy Solutions'],
      skills: ['Renewable Energy', 'Data Analysis', 'Research'],
      availability: 'part-time',
      portfolio_score: 88
    }
  ];

  const collaborations = [
    {
      id: '1',
      title: 'Industry Partnership with TechCorp',
      type: 'Corporate Collaboration',
      partner: 'TechCorp Milano',
      value: '€125,000',
      duration: '24 months',
      status: 'active',
      projects_count: 3,
      students_involved: 25
    },
    {
      id: '2',
      title: 'EU Research Grant - Horizon 2024',
      type: 'Research Grant',
      partner: 'European Commission',
      value: '€500,000',
      duration: '36 months',
      status: 'approved',
      projects_count: 1,
      students_involved: 40
    }
  ];

  const researchOutputs = [
    {
      id: '1',
      title: 'Machine Learning Applications in Urban Planning',
      type: 'Research Paper',
      authors: ['Prof. Marco Rossi', 'Dr. Elena Verdi', '5 students'],
      journal: 'IEEE Smart Cities',
      status: 'published',
      citations: 25,
      date: '2024-09-15'
    },
    {
      id: '2',
      title: 'Sustainable Building Solutions Patent',
      type: 'Patent',
      authors: ['Prof. Anna Bianchi', 'Alessandro Conti'],
      status: 'pending',
      application_number: 'IT2024001234',
      date: '2024-10-01'
    }
  ];

  const stats = [
    { label: 'Active Projects', value: projects.filter(p => p.status === 'active').length, icon: BookOpen, color: 'blue' },
    { label: 'Total Students', value: students.length, icon: Users, color: 'green' },
    { label: 'Industry Partners', value: '8', icon: Building, color: 'purple' },
    { label: 'Research Papers', value: '15', icon: Award, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackButton className="text-white hover:bg-white/10" />
              <div className="flex items-center">
                <GraduationCap className="w-8 h-8 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold">
                    University Dashboard
                  </h1>
                  <p className="text-blue-100 mt-1">
                    Politecnico di Milano - Department of Engineering
                  </p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" icon={Upload} className="border-white text-white hover:bg-white hover:text-blue-600">
                Upload Research
              </Button>
              <Button variant="primary" icon={Plus} className="bg-white text-blue-600 hover:bg-blue-50">
                New Project
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
              {(['projects', 'students', 'collaborations', 'research'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab === 'projects' && `Academic Projects (${projects.length})`}
                  {tab === 'students' && `Students (${students.length})`}
                  {tab === 'collaborations' && `Partnerships (${collaborations.length})`}
                  {tab === 'research' && `Research Output (${researchOutputs.length})`}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                {projects.map((project) => (
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
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <span>{project.department}</span>
                          <span>Supervisor: {project.supervisor}</span>
                          <span>{project.students} students</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-600 dark:text-green-400">
                            Budget: {project.budget.amount.toLocaleString()} {project.budget.currency}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {project.startDate} - {project.endDate}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Industry Partners:</span>
                        {project.industry_partners.map((partner) => (
                          <span key={partner} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {partner}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="primary" size="sm">
                          Manage Project
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="space-y-4">
                {students.map((student) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {student.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>{student.program}</span>
                          <span>{student.year}</span>
                          <span>GPA: {student.gpa}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          {student.skills.map((skill) => (
                            <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Current Projects: {student.projects.join(', ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-2">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{student.portfolio_score}/100</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          student.availability === 'full-time' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {student.availability}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" icon={MessageCircle}>
                        Contact
                      </Button>
                      <Button variant="primary" size="sm">
                        Assign to Project
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Collaborations Tab */}
            {activeTab === 'collaborations' && (
              <div className="space-y-4">
                {collaborations.map((collab) => (
                  <motion.div
                    key={collab.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {collab.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>{collab.partner}</span>
                          <span>{collab.duration}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            Value: {collab.value}
                          </span>
                          <span>{collab.projects_count} projects</span>
                          <span>{collab.students_involved} students involved</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        collab.status === 'active' ? 'bg-green-100 text-green-800' :
                        collab.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {collab.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {collab.type}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Agreement
                        </Button>
                        <Button variant="primary" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Research Tab */}
            {activeTab === 'research' && (
              <div className="space-y-4">
                {researchOutputs.map((output) => (
                  <motion.div
                    key={output.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {output.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>Authors: {output.authors.join(', ')}</span>
                          <span>{output.date}</span>
                        </div>
                        {output.type === 'Research Paper' && output.journal && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Published in: {output.journal}
                            {output.citations && ` • ${output.citations} citations`}
                          </div>
                        )}
                        {output.type === 'Patent' && output.application_number && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Application: {output.application_number}
                          </div>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        output.status === 'published' ? 'bg-green-100 text-green-800' :
                        output.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {output.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                        {output.type}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" icon={Eye}>
                          View
                        </Button>
                        <Button variant="outline" size="sm" icon={Download}>
                          Download
                        </Button>
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
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, FileText, Shield, Users, AlertTriangle, Scale, Mail } from 'lucide-react';
import { Logo } from '../components/ui/Logo';

export const TermsOfService: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: FileText },
    { id: 'acceptance', title: 'Acceptance of Terms', icon: Shield },
    { id: 'description', title: 'Description of Service', icon: Users },
    { id: 'eligibility', title: 'Eligibility', icon: Users },
    { id: 'accounts', title: 'User Accounts', icon: Users },
    { id: 'conduct', title: 'User Conduct', icon: AlertTriangle },
    { id: 'content', title: 'User Content', icon: FileText },
    { id: 'services', title: 'Service Transactions', icon: Scale },
    { id: 'fees', title: 'Fees and Payments', icon: Scale },
    { id: 'privacy', title: 'Privacy Policy', icon: Shield },
    { id: 'termination', title: 'Termination', icon: AlertTriangle },
    { id: 'disclaimers', title: 'Disclaimers', icon: AlertTriangle },
    { id: 'limitation', title: 'Limitation of Liability', icon: Shield },
    { id: 'indemnification', title: 'Indemnification', icon: Scale },
    { id: 'governing', title: 'Governing Law', icon: Scale },
    { id: 'changes', title: 'Changes to Terms', icon: FileText },
    { id: 'contact', title: 'Contact Information', icon: Mail },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="light" size="md" showText={true} />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Effective Date: October 24, 2025
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Table of Contents
                </h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full flex items-center text-sm px-3 py-2 rounded-lg transition-colors duration-200 ${
                        activeSection === section.id
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <section.icon className="w-4 h-4 mr-2" />
                      {section.title}
                      <ChevronRight className="w-3 h-3 ml-auto" />
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      Terms of Service
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>Effective Date: October 24, 2025</span>
                      <span>•</span>
                      <span>Last Updated: October 24, 2025</span>
                    </div>
                  </div>

                  {/* Terms Content */}
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    
                    <section id="overview">
                      <h2>1. Overview</h2>
                      <p>
                        Welcome to ERTUNO ("we," "our," or "us"), the sacred platform connecting service providers 
                        and seekers across Europe. These Terms of Service ("Terms") govern your use of our platform, 
                        website, and mobile applications (collectively, the "Service").
                      </p>
                      <p>
                        ERTUNO is built on Sicilian grit and global tech, creating the holy site where connections, 
                        traders, and deals flourish through trust, innovation, and community.
                      </p>
                    </section>

                    <section id="acceptance">
                      <h2>2. Acceptance of Terms</h2>
                      <p>
                        By accessing or using ERTUNO, you agree to be bound by these Terms. If you disagree with 
                        any part of these terms, you may not access the Service.
                      </p>
                      <p>
                        These Terms apply to all visitors, users, and others who access or use the Service, 
                        including both service providers and service seekers.
                      </p>
                    </section>

                    <section id="description">
                      <h2>3. Description of Service</h2>
                      <p>
                        ERTUNO provides a digital marketplace platform that facilitates connections between:
                      </p>
                      <ul>
                        <li><strong>Service Seekers:</strong> Individuals or businesses seeking professional services</li>
                        <li><strong>Service Providers:</strong> Verified professionals offering their expertise</li>
                      </ul>
                      <p>
                        Our platform features live messaging, service marketplace functionality, professional 
                        verification systems, and secure transaction processing.
                      </p>
                    </section>

                    <section id="eligibility">
                      <h2>4. Eligibility</h2>
                      <p>
                        To use ERTUNO, you must:
                      </p>
                      <ul>
                        <li>Be at least 18 years old</li>
                        <li>Have the legal authority to enter into these Terms</li>
                        <li>Not be prohibited from using the Service under applicable laws</li>
                        <li>Provide accurate and complete registration information</li>
                      </ul>
                    </section>

                    <section id="accounts">
                      <h2>5. User Accounts</h2>
                      <h3>5.1 Account Creation</h3>
                      <p>
                        You must create an account to access certain features. You are responsible for:
                      </p>
                      <ul>
                        <li>Maintaining the confidentiality of your account credentials</li>
                        <li>All activities under your account</li>
                        <li>Notifying us immediately of unauthorized access</li>
                      </ul>
                      
                      <h3>5.2 Professional Verification</h3>
                      <p>
                        Service providers may undergo professional verification to display verified badges. 
                        This process may include identity verification, skill assessment, and background checks.
                      </p>
                    </section>

                    <section id="conduct">
                      <h2>6. User Conduct</h2>
                      <p>
                        Users must not:
                      </p>
                      <ul>
                        <li>Violate laws or regulations</li>
                        <li>Infringe intellectual property rights</li>
                        <li>Harass, abuse, or harm others</li>
                        <li>Post false, misleading, or fraudulent content</li>
                        <li>Spam or send unsolicited communications</li>
                        <li>Interfere with platform security or functionality</li>
                        <li>Attempt to circumvent fees or payment systems</li>
                      </ul>
                    </section>

                    <section id="content">
                      <h2>7. User Content</h2>
                      <h3>7.1 Content Ownership</h3>
                      <p>
                        You retain ownership of content you post but grant ERTUNO a license to use, 
                        display, and distribute it for platform operations.
                      </p>
                      
                      <h3>7.2 Content Standards</h3>
                      <p>
                        All content must be:
                      </p>
                      <ul>
                        <li>Accurate and truthful</li>
                        <li>Appropriate and professional</li>
                        <li>Free from harmful or illegal material</li>
                        <li>Compliant with applicable laws and regulations</li>
                      </ul>
                    </section>

                    <section id="services">
                      <h2>8. Service Transactions</h2>
                      <h3>8.1 Platform Role</h3>
                      <p>
                        ERTUNO facilitates connections between users but is not a party to service agreements. 
                        We do not provide the services listed on our platform.
                      </p>
                      
                      <h3>8.2 User Agreements</h3>
                      <p>
                        Service agreements are between providers and seekers. Users are responsible for:
                      </p>
                      <ul>
                        <li>Negotiating terms directly</li>
                        <li>Ensuring service quality and delivery</li>
                        <li>Resolving disputes independently</li>
                      </ul>
                    </section>

                    <section id="fees">
                      <h2>9. Fees and Payments</h2>
                      <h3>9.1 Service Seeker Fees</h3>
                      <p>
                        ERTUNO is free for service seekers to post requests and connect with providers.
                      </p>
                      
                      <h3>9.2 Service Provider Fees</h3>
                      <p>
                        Providers pay commission-based fees on successful transactions. Fee structures are:
                      </p>
                      <ul>
                        <li>Transparent and disclosed upfront</li>
                        <li>Scalable based on transaction value</li>
                        <li>Founder-friendly with competitive rates</li>
                      </ul>
                      
                      <h3>9.3 Payment Processing</h3>
                      <p>
                        Payments are processed through secure third-party processors. ERTUNO is not responsible 
                        for payment processor errors or delays.
                      </p>
                    </section>

                    <section id="privacy">
                      <h2>10. Privacy Policy</h2>
                      <p>
                        Our Privacy Policy describes how we collect, use, and protect your information. 
                        Key principles include:
                      </p>
                      <ul>
                        <li>GDPR compliance and European data protection</li>
                        <li>We never sell your data</li>
                        <li>Transparent data practices</li>
                        <li>User control over personal information</li>
                      </ul>
                      <p>
                        The Privacy Policy is incorporated into these Terms by reference.
                      </p>
                    </section>

                    <section id="termination">
                      <h2>11. Termination</h2>
                      <h3>11.1 User Termination</h3>
                      <p>
                        You may terminate your account at any time through account settings or by contacting support.
                      </p>
                      
                      <h3>11.2 Platform Termination</h3>
                      <p>
                        We may suspend or terminate accounts for violations of these Terms, including:
                      </p>
                      <ul>
                        <li>Fraudulent activity</li>
                        <li>Repeated policy violations</li>
                        <li>Harmful behavior toward other users</li>
                        <li>Legal compliance requirements</li>
                      </ul>
                    </section>

                    <section id="disclaimers">
                      <h2>12. Disclaimers</h2>
                      <p>
                        ERTUNO is provided "AS IS" without warranties. We disclaim all warranties including:
                      </p>
                      <ul>
                        <li>Service availability and uninterrupted access</li>
                        <li>Accuracy of user-provided information</li>
                        <li>Quality of services provided by users</li>
                        <li>Fitness for particular purposes</li>
                      </ul>
                    </section>

                    <section id="limitation">
                      <h2>13. Limitation of Liability</h2>
                      <p>
                        To the fullest extent permitted by law, ERTUNO shall not be liable for:
                      </p>
                      <ul>
                        <li>Indirect, incidental, or consequential damages</li>
                        <li>Loss of profits, data, or business opportunities</li>
                        <li>User disputes or service quality issues</li>
                        <li>Third-party actions or content</li>
                      </ul>
                      <p>
                        Our total liability is limited to the fees paid by you in the 12 months preceding the claim.
                      </p>
                    </section>

                    <section id="indemnification">
                      <h2>14. Indemnification</h2>
                      <p>
                        You agree to indemnify and hold ERTUNO harmless from claims arising from:
                      </p>
                      <ul>
                        <li>Your use of the Service</li>
                        <li>Violation of these Terms</li>
                        <li>Infringement of third-party rights</li>
                        <li>Your service transactions with other users</li>
                      </ul>
                    </section>

                    <section id="governing">
                      <h2>15. Governing Law</h2>
                      <p>
                        These Terms are governed by the laws of Italy and the European Union. 
                        Disputes shall be resolved in competent Italian courts, subject to EU jurisdiction.
                      </p>
                      <p>
                        Users consent to the jurisdiction of Italian courts for legal proceedings related to these Terms.
                      </p>
                    </section>

                    <section id="changes">
                      <h2>16. Changes to Terms</h2>
                      <p>
                        We may modify these Terms at any time. Changes will be effective when posted with 
                        an updated effective date. Continued use constitutes acceptance of modified Terms.
                      </p>
                      <p>
                        Significant changes will be communicated through email or platform notifications 
                        at least 30 days before taking effect.
                      </p>
                    </section>

                    <section id="contact">
                      <h2>17. Contact Information</h2>
                      <p>
                        For questions about these Terms, contact us at:
                      </p>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-4">
                        <p><strong>ERTUNO Legal Department</strong></p>
                        <p>Email: support@ertuno.com</p>
                        <p>Address: European Union</p>
                        <p>Response Time: We respond fast and build together</p>
                      </div>
                    </section>

                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
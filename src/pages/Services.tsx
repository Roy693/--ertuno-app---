import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Wrench, 
  Palette, 
  Monitor, 
  Calendar, 
  Scale, 
  Star,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Shield,
  Clock
} from 'lucide-react';
import { BackButton } from '../components/ui/BackButton';

export const Services: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const serviceCategories = [
    {
      id: 'home-repairs',
      title: 'Home Repairs',
      icon: Home,
      color: 'from-blue-500 to-purple-600',
      description: 'Professional home maintenance and repair services',
      services: [
        'Plumbing - Emergency repairs, installations, maintenance',
        'Electrical - Wiring, lighting, safety inspections', 
        'Carpentry - Custom furniture, repairs, installations',
        'Painting - Interior/exterior, commercial/residential',
        'HVAC - Heating, cooling, ventilation systems'
      ]
    },
    {
      id: 'cleaning',
      title: 'Cleaning & Maintenance', 
      icon: Wrench,
      color: 'from-green-500 to-teal-600',
      description: 'Keep your space spotless and well-maintained',
      services: [
        'House Cleaning - Regular, deep cleaning, move-in/out',
        'Office Cleaning - Commercial spaces, daily maintenance',
        'Window Cleaning - Residential and commercial buildings',
        'Carpet Cleaning - Deep cleaning, stain removal',
        'Garden Maintenance - Landscaping, pruning, lawn care'
      ]
    },
    {
      id: 'design',
      title: 'Design & Branding',
      icon: Palette,
      color: 'from-pink-500 to-red-600', 
      description: 'Creative professionals for all your visual needs',
      services: [
        'Graphic Design - Logos, branding, print materials',
        'Web Design - Modern, responsive website creation',
        'Interior Design - Space planning, decoration',
        'Photography - Events, portraits, commercial',
        'Video Production - Promotional, social media content'
      ]
    },
    {
      id: 'tech',
      title: 'Tech Support & Development',
      icon: Monitor,
      color: 'from-indigo-500 to-blue-600',
      description: 'Technology solutions and digital expertise',
      services: [
        'Computer Repair - Hardware fixes, virus removal',
        'Web Development - Custom websites, e-commerce',
        'Mobile Apps - iOS, Android development', 
        'IT Support - Network setup, troubleshooting',
        'Digital Marketing - SEO, social media, ads'
      ]
    },
    {
      id: 'events',
      title: 'Event Planning & Logistics',
      icon: Calendar,
      color: 'from-yellow-500 to-orange-600',
      description: 'Make your events memorable and stress-free',
      services: [
        'Wedding Planning - Full service, coordination',
        'Corporate Events - Conferences, team building',
        'Catering - Professional food services',
        'Entertainment - DJs, bands, performers',
        'Venue Management - Setup, coordination, cleanup'
      ]
    },
    {
      id: 'legal',
      title: 'Legal & Financial Consulting',
      icon: Scale,
      color: 'from-purple-500 to-indigo-600',
      description: 'Professional advice and consulting services',
      services: [
        'Legal Advice - Contracts, disputes, compliance',
        'Tax Services - Preparation, planning, consulting',
        'Business Consulting - Strategy, operations',
        'Accounting - Bookkeeping, financial planning',
        'Real Estate - Buying, selling, property law'
      ]
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'All providers are background-checked and verified'
    },
    {
      icon: Star,
      title: 'Rated & Reviewed', 
      description: 'See real ratings from previous customers'
    },
    {
      icon: MessageCircle,
      title: 'Instant Chat',
      description: 'Communicate directly with providers in real-time'
    },
    {
      icon: Clock,
      title: 'Quick Response',
      description: 'Get quotes and responses within minutes'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-20">
      {/* Back Button */}
      <div className="absolute top-24 left-4 z-10">
        <BackButton className="text-white hover:bg-white/10" />
      </div>
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6">
              What can you find on ERTUNO?
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              From home repairs to creative services, we connect you with verified professionals 
              who are ready to help. All providers are verified, rated, and ready to help.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-yellow-500 text-black rounded-full font-semibold">
              <CheckCircle className="w-5 h-5 mr-2" />
              Custom requests—just post and we'll match you
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 group-hover:scale-105">
                  {/* Category Header */}
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mr-4`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{category.title}</h3>
                      <p className="text-purple-200 text-sm">{category.description}</p>
                    </div>
                  </div>

                  {/* Expand Indicator */}
                  <motion.div 
                    className="flex items-center text-yellow-400 font-medium"
                    animate={{ rotate: selectedCategory === category.id ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-4 h-4 mr-1" />
                    {selectedCategory === category.id ? 'Hide Services' : 'View Services'}
                  </motion.div>

                  {/* Services List */}
                  <AnimatePresence>
                    {selectedCategory === category.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-white/20"
                      >
                        <ul className="space-y-2">
                          {category.services.map((service, serviceIndex) => (
                            <motion.li
                              key={serviceIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: serviceIndex * 0.1 }}
                              className="flex items-start text-purple-100 text-sm"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{service}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose ERTUNO?</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              We make finding the right professional simple, secure, and stress-free.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-200 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Don't see what you need?
            </h2>
            <p className="text-lg text-purple-100 mb-6">
              Post your custom request and we'll find the right professional for you. 
              From unique projects to specialized services, ERTUNO has you covered.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-4 rounded-full text-lg transition-colors duration-200"
            >
              Post Custom Request
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
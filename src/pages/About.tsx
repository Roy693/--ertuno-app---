import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  MessageCircle,
  Star,
  CheckCircle
} from 'lucide-react';

export const About: React.FC = () => {
  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Cities Covered', value: '25+', icon: MapPin },
    { label: 'Completed Jobs', value: '15K+', icon: CheckCircle },
    { label: 'User Satisfaction', value: '98%', icon: Star }
  ];

  const values = [
    {
      icon: Zap,
      title: 'Speed',
      description: 'Find the right professional in seconds, not days. Our platform is built for instant connections.'
    },
    {
      icon: Shield,
      title: 'Trust', 
      description: 'Every service provider is verified, rated, and background-checked for your peace of mind.'
    },
    {
      icon: MessageCircle,
      title: 'Simplicity',
      description: 'Intuitive chat interface makes communication effortless. No complex forms or confusing processes.'
    },
    {
      icon: Globe,
      title: 'Multilingual',
      description: 'Supporting multiple languages across Europe. Breaking down language barriers for better service.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6">
              About ERTUNO
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              ERTUNO is built for speed, trust, and simplicity.
              We connect citizens with verified service providers across Europe—instantly.
              Whether you need a plumber in Palermo or a designer in Berlin, ERTUNO finds the right match in seconds.
            </p>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto">
              Our platform is secure, multilingual, and optimized for mobile.
              <span className="font-semibold text-yellow-400"> Built in Sicily, designed for the world.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">{stat.value}</div>
                <div className="text-purple-200 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Everything we build is guided by four core principles that put users first.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{value.title}</h3>
                </div>
                <p className="text-purple-200 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-8">Born in Sicily</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="text-lg text-purple-100 leading-relaxed mb-6">
                ERTUNO was born from a simple frustration: finding reliable service providers shouldn't be complicated. 
                Our founders experienced this challenge firsthand in Sicily, where traditional methods of finding professionals 
                often relied on word-of-mouth and lengthy phone calls.
              </p>
              <p className="text-lg text-purple-100 leading-relaxed mb-6">
                We envisioned a platform that could bridge this gap instantly, securely, and intuitively. 
                Starting from the beautiful island of Sicily, we've expanded our vision across Europe, 
                maintaining our commitment to simplicity and trust.
              </p>
              <p className="text-lg text-yellow-400 font-semibold">
                Today, ERTUNO connects thousands of users with verified professionals across 25+ cities, 
                proving that great ideas can come from anywhere and reach everywhere.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
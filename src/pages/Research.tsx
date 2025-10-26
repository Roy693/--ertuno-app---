import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Lightbulb,
  FlaskConical,
  Trophy,
  Network,
  Target,
  Microscope,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Mail,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useI18n } from '../hooks/useI18n';

export const Research: React.FC = () => {
  const { t } = useI18n();

  const benefits = [
    {
      icon: Users,
      title: 'Profili Accademici Verificati',
      description: 'Sistema di verifica per ricercatori, professori e istituzioni accademiche con credenziali validate.'
    },
    {
      icon: Network,
      title: 'Collaborazioni Inter-disciplinari', 
      description: 'Connessioni tra diverse aree di ricerca per progetti innovativi e interdisciplinari.'
    },
    {
      icon: Target,
      title: 'Matching Intelligente',
      description: 'Algoritmi avanzati per abbinare competenze accademiche con esigenze professionali specifiche.'
    },
    {
      icon: Lightbulb,
      title: 'Opportunità Studenti',
      description: 'Piattaforma per mentorship, tirocini e supporto tesi con professionisti del settore.'
    },
    {
      icon: FlaskConical,
      title: 'Marketplace Ricerca',
      description: 'Spazio dedicato per bandi aperti, dataset condivisi e progetti pilota collaborativi.'
    },
    {
      icon: Trophy,
      title: 'Riconoscimenti Accademici',
      description: 'Sistema di badge e certificazioni per valorizzare contributi alla ricerca applicata.'
    }
  ];

  const researchFeatures = [
    {
      title: 'Verified Academic Profiles',
      description: 'Profili accademici verificati per ricercatori, professori e istituzioni',
      users: '500+ Ricercatori'
    },
    {
      title: 'Research Marketplace',
      description: 'Bandi aperti, dataset e progetti pilota per collaborazioni innovative',
      users: '50+ Progetti Attivi'
    },
    {
      title: 'Student Opportunities',
      description: 'Mentorship, tirocini e supporto tesi con professionisti verificati',
      users: '1000+ Studenti'
    },
    {
      title: 'Inter-disciplinary Network',
      description: 'Connessioni tra diverse aree di ricerca e settori professionali',
      users: '25+ Discipline'
    }
  ];

  const academicPartners = [
    'Università Statale Milano',
    'Politecnico di Torino', 
    'La Sapienza Roma',
    'Università di Bologna',
    'Campus Bio-Medico',
    'LUISS Guido Carli'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 pt-20">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-6">
              <GraduationCap className="w-16 h-16 text-teal-400 mr-4" />
              <h1 className="text-5xl lg:text-6xl font-bold text-white">
                {t('research.title')}
              </h1>
            </div>
            <p className="text-xl text-slate-200 mb-8 max-w-4xl mx-auto leading-relaxed">
              {t('research.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('research.mission.title')}
            </h2>
            <p className="text-lg text-slate-300 max-w-4xl mx-auto leading-relaxed">
              {t('research.mission.description')}
            </p>
          </motion.div>

          {/* Research Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {researchFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-300 text-sm mb-3">
                  {feature.description}
                </p>
                <div className="text-teal-400 font-medium text-sm">
                  {feature.users}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('research.benefits.title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-orange-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Academic Partners Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Partner Accademici
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Istituzioni di eccellenza che collaborano con ERTUNO
            </p>
          </motion.div>

          {/* Partner Logos Placeholder */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {academicPartners.map((partner, index) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 flex items-center justify-center min-h-[100px]"
              >
                <div className="text-center">
                  <Microscope className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                  <div className="text-white text-sm font-medium">
                    {partner}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-gradient-to-r from-teal-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('research.cta.title')}
            </h2>
            <p className="text-xl text-slate-200 mb-8 leading-relaxed">
              {t('research.cta.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                icon={Mail}
                className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
              >
                {t('research.cta.proposal')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={Calendar}
                className="border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
              >
                {t('research.cta.demo')}
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-slate-300 text-sm">
                Contatti: <span className="text-teal-400 font-medium">research@ertuno.com</span> | 
                Tel: <span className="text-teal-400 font-medium">+39 02 1234 5678</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
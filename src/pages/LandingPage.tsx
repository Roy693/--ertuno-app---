import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Star, 
  MessageCircle, 
  Shield, 
  Clock,
  CheckCircle,
  Users,
  Smartphone,
  Download,
  ArrowRight,
  Zap,
  Globe
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PWAInstallButton } from '../components/ui/PWAInstallButton';
import { Logo } from '../components/ui/Logo';
import { useI18n } from '../hooks/useI18n';

interface LandingPageProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLearnMore
}) => {
  const { t } = useI18n();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({
    providers: 0,
    completedJobs: 0,
    cities: 0,
    satisfaction: 0
  });

  // Animate stats on load
  useEffect(() => {
    const animateStats = () => {
      const targets = { providers: 2500, completedJobs: 15000, cities: 25, satisfaction: 98 };
      Object.entries(targets).forEach(([key, target]) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
        }, 20);
      });
    };
    animateStats();
  }, []);

  const testimonials = [
    {
      name: "Maria Rossi",
      role: "Proprietaria di Casa",
      content: "Ho trovato un elettricista perfetto in 30 minuti. Chat immediata, preventivo chiaro, lavoro eccellente!",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Maria+Rossi&background=8b5cf6&color=fff"
    },
    {
      name: "Giovanni Bianchi", 
      role: "Idraulico Verificato",
      content: "ERTUNO mi ha fatto crescere il business del 300%. Clienti di qualità, pagamenti sicuri, zero stress.",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Giovanni+Bianchi&background=06b6d4&color=fff"
    },
    {
      name: "Sofia Chen",
      role: "Graphic Designer",
      content: "La Live Messaging rende tutto semplice. I clienti adorano la comunicazione immediata!",
      rating: 5,
      image: "https://ui-avatars.com/api/?name=Sofia+Chen&background=f59e0b&color=fff"
    }
  ];

  const serviceCategories = [
    { name: "Casa & Giardino", count: "850+ professionisti", icon: "🏠" },
    { name: "Servizi Professionali", count: "620+ professionisti", icon: "💼" },
    { name: "Servizi Personali", count: "430+ professionisti", icon: "👥" },
    { name: "Auto & Trasporti", count: "290+ professionisti", icon: "🚗" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* ERTUNO Title with Tuno Icon */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center justify-center mb-8"
            >
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white/10 backdrop-blur-sm rounded-3xl px-8 py-6 border border-white/20 shadow-2xl">
                {/* ERTUNO Logo */}
                <motion.div 
                  className="flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Logo 
                    variant="dark" 
                    size="xl" 
                    showText={false}
                    className="w-20 h-20 sm:w-24 sm:h-24"
                  />
                </motion.div>
                
                {/* Brand Text */}
                <div className="text-center sm:text-left">
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight">
                    ER<span className="text-teal-400">TU</span><span className="text-orange-400">NO</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-blue-200 font-medium mt-2">
                    {t('hero.tagline')}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-slate-200 max-w-3xl mx-auto mb-12"
            >
              {t('hero.description')}
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">{stats.providers.toLocaleString()}+</div>
                <div className="text-purple-200">{t('hero.stats.providers')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">{stats.completedJobs.toLocaleString()}+</div>
                <div className="text-purple-200">{t('hero.stats.requests')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">{stats.cities}+</div>
                <div className="text-purple-200">{t('hero.stats.cities')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">{stats.satisfaction}%</div>
                <div className="text-purple-200">{t('hero.stats.users')}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={onGetStarted}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-8 py-4 text-lg"
              >
                <Zap className="w-5 h-5 mr-2" />
{t('hero.cta.primary')}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => window.open('/mobile/', '_blank')}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-8 py-4 text-lg"
              >
                <Smartphone className="w-5 h-5 mr-2" />
{t('hero.cta.secondary')}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intelligent Match Section - Ricerca Intelligente */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              <Search className="w-10 h-10 inline mr-3 text-teal-400" />
              {t('landing.search.title')}
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              {t('landing.search.description')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{t('landing.search.chatTitle')}</h3>
                    <p className="text-purple-200">{t('landing.search.chatSubtitle')}</p>
                  </div>
                </div>
                <p className="text-purple-100">
                  {t('landing.search.chatDescription')}
                </p>
              </div>

              <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{t('landing.search.verifiedTitle')}</h3>
                    <p className="text-purple-200">{t('landing.search.verifiedSubtitle')}</p>
                  </div>
                </div>
                <p className="text-purple-100">
                  {t('landing.search.verifiedDescription')}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Search Demo Interface */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {t('landing.search.trySearch')}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    "{t('landing.search.searchExample')}"
                  </p>
                  <Button variant="primary" className="bg-orange-500 hover:bg-orange-400 shadow-lg">
{t('landing.search.findProvider')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Verified Providers Section - Provider Verificati */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              <Shield className="w-10 h-10 inline mr-3 text-teal-400" />
              Provider Verificati
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Solo professionisti di fiducia. Documenti controllati, recensioni verificate, qualità garantita.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {serviceCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/20 rounded-2xl p-6 text-center backdrop-blur-sm hover:bg-white/30 transition-all"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-purple-200 text-sm">{category.count}</p>
              </motion.div>
            ))}
          </div>

          {/* Sample Provider Profiles */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Marco Elettricista", rating: 4.9, reviews: 127, specialty: "Impianti Elettrici", verified: true },
              { name: "Anna Pulizie", rating: 5.0, reviews: 89, specialty: "Pulizie Domestiche", verified: true },
              { name: "Luigi Idraulico", rating: 4.8, reviews: 203, specialty: "Emergenze 24/7", verified: true }
            ].map((provider, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=random`}
                    alt={provider.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                      {provider.verified && <CheckCircle className="w-4 h-4 text-teal-500" />}
                    </div>
                    <p className="text-sm text-gray-600">{provider.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-orange-500 fill-current" />
                    <span className="font-semibold">{provider.rating}</span>
                    <span className="text-gray-500 text-sm">({provider.reviews})</span>
                  </div>
                  <Button variant="secondary" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chatta
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Chat Preview (Live Messaging) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              <MessageCircle className="w-10 h-10 inline mr-3 text-blue-400" />
              Live Messaging ERTUNO
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Comunicazione istantanea, foto, vocali, posizione. L'esperienza chat che conosci e ami.
            </p>
          </motion.div>

          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Phone Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://ui-avatars.com/api/?name=Marco+Elettricista&background=4f46e5&color=fff"
                    alt="Marco"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">Marco Elettricista</h3>
                    <p className="text-xs opacity-80">Online ora</p>
                  </div>
                  <div className="ml-auto">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 space-y-3 h-80 overflow-y-auto">
                <div className="flex space-x-2">
                  <img
                    src="https://ui-avatars.com/api/?name=Tu&background=6b7280&color=fff"
                    alt="Tu"
                    className="w-6 h-6 rounded-full mt-1"
                  />
                  <div className="bg-gray-100 rounded-2xl px-3 py-2 max-w-xs">
                    <p className="text-sm">Ciao! Ho un problema con il quadro elettrico che salta continuamente</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white rounded-2xl px-3 py-2 max-w-xs">
                    <p className="text-sm">Ciao! Posso aiutarti. Puoi mandarmi una foto del quadro?</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <img
                    src="https://ui-avatars.com/api/?name=Tu&background=6b7280&color=fff"
                    alt="Tu"
                    className="w-6 h-6 rounded-full mt-1"
                  />
                  <div className="bg-gray-100 rounded-2xl px-3 py-2">
                    <div className="w-32 h-20 bg-gray-300 rounded-lg mb-1"></div>
                    <p className="text-xs text-gray-500">📸 Foto del quadro elettrico</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white rounded-2xl px-3 py-2 max-w-xs">
                    <p className="text-sm">Perfetto! Il problema sembra un sovraccarico. Posso venire domani mattina. Preventivo: €120</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <img
                    src="https://ui-avatars.com/api/?name=Tu&background=6b7280&color=fff"
                    alt="Tu"
                    className="w-6 h-6 rounded-full mt-1"
                  />
                  <div className="bg-gray-100 rounded-2xl px-3 py-2">
                    <p className="text-sm">Perfetto! Confermo per domani alle 9:00 👍</p>
                  </div>
                </div>

                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Lavoro Confermato
                  </span>
                </div>
              </div>

              {/* Chat Input */}
              <div className="border-t p-3">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-100 rounded-full px-3 py-2">
                    <p className="text-sm text-gray-500">Scrivi un messaggio...</p>
                  </div>
                  <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile Download Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              <Smartphone className="w-10 h-10 inline mr-3 text-teal-400" />
              Scarica l'App Mobile
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Porta ERTUNO sempre con te. Chat, ricerca, pagamenti. Tutto dal tuo smartphone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <PWAInstallButton
                variant="primary"
                size="lg"
                className="bg-green-500 hover:bg-green-400 text-white font-semibold px-8 py-4 text-lg"
              />
              <Button
                variant="secondary"
                size="lg"
                onClick={() => window.open('/mobile/', '_blank')}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-8 py-4 text-lg"
              >
                <Globe className="w-5 h-5 mr-2" />
                Versione Web Mobile
              </Button>
            </div>

            <div className="text-purple-200">
              <p>✓ Funziona offline  ✓ Notifiche push  ✓ GPS integrato  ✓ Chat sicura</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Cosa Dicono i Nostri Utenti</h2>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-700 mb-6">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              <div className="flex items-center justify-center space-x-3">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              Pronto a Rivoluzionare il Tuo Business?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Unisciti a migliaia di professionisti che stanno già crescendo con ERTUNO.
              Chat, lavora, fattura. Tutto in un posto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={onGetStarted}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-12 py-6 text-xl"
              >
                <Users className="w-6 h-6 mr-2" />
                Inizia Gratis Ora
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onLearnMore}
                className="bg-teal-500 hover:bg-teal-400 text-white border-teal-400 px-12 py-6 text-xl shadow-2xl"
              >
                <Clock className="w-6 h-6 mr-2" />
                Prenota Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useLocation } from './hooks/useLocation';
import Button from '../components/ui/Button';
import Card, { CardBody, CardTitle, CardDescription } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import { colors, spacing, typography, shadows } from '../styles/theme';

interface EnhancedLandingPageProps {
  onGetStarted: () => void;
  onBecomeProvider: () => void;
}

export const EnhancedLandingPage: React.FC<EnhancedLandingPageProps> = ({
  onGetStarted,
  onBecomeProvider
}) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({
    providers: 0,
    completedJobs: 0,
    cities: 0,
    satisfaction: 0
  });
  const { location, requestLocation } = useLocation();

  // Animate stats on load
  useEffect(() => {
    const animateStats = () => {
      const targets = { providers: 2500, completedJobs: 15000, cities: 25, satisfaction: 98 };
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;

      let step = 0;
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setStats({
          providers: Math.floor(targets.providers * progress),
          completedJobs: Math.floor(targets.completedJobs * progress),
          cities: Math.floor(targets.cities * progress),
          satisfaction: Math.floor(targets.satisfaction * progress)
        });

        if (step >= steps) {
          clearInterval(interval);
        }
      }, increment);
    };

    setTimeout(animateStats, 500);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: '🔍',
      title: 'Ricerca Intelligente',
      description: 'AI-powered per trovare il professionista perfetto in pochi secondi',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: '✅',
      title: 'Provider Verificati',
      description: 'Tutti i professionisti sono controllati e certificati',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: '⚡',
      title: 'Booking Istantaneo',
      description: 'Prenota e paga in sicurezza con un click',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: '🤖',
      title: 'Assistente AI',
      description: 'Supporto 24/7 per ogni tua esigenza',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      icon: '📍',
      title: 'Servizio Locale',
      description: 'Trova professionisti nella tua zona',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      icon: '💰',
      title: 'Prezzi Trasparenti',
      description: 'Nessun costo nascosto, paghi quello che vedi',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Rossi',
      role: 'Cliente Soddisfatta',
      avatar: '/api/placeholder/60/60',
      text: 'Ho risolto il problema dell\'impianto elettrico in casa in meno di 2 ore. Servizio fantastico!',
      rating: 5,
      location: 'Comiso'
    },
    {
      name: 'Giuseppe Benedetto',
      role: 'Provider Elettricista',
      avatar: '/api/placeholder/60/60',
      text: 'ERTUNO mi ha permesso di espandere la mia clientela del 300%. Piattaforma eccezionale!',
      rating: 5,
      location: 'Ragusa'
    },
    {
      name: 'Anna Lombardi',
      role: 'Cliente Soddisfatta',
      avatar: '/api/placeholder/60/60',
      text: 'Servizio di pulizia professionale a casa mia. Qualità e velocità incredibili.',
      rating: 5,
      location: 'Vittoria'
    }
  ];

  const categories = [
    { name: 'Casa & Giardino', icon: '🏠', jobs: '1,200+ lavori' },
    { name: 'Bellezza & Benessere', icon: '💅', jobs: '800+ lavori' },
    { name: 'Trasporti', icon: '🚗', jobs: '600+ lavori' },
    { name: 'Tecnologia', icon: '💻', jobs: '400+ lavori' },
    { name: 'Animali', icon: '🐕', jobs: '300+ lavori' },
    { name: 'Eventi', icon: '🎉', jobs: '500+ lavori' }
  ];

  const heroStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  };

  const heroContentStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${spacing[6]}`,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: spacing[12],
    alignItems: 'center'
  };

  const heroTextStyle: React.CSSProperties = {
    color: 'white'
  };

  const heroTitleStyle: React.CSSProperties = {
    fontSize: '3.5rem',
    fontWeight: typography.fontWeight.bold,
    lineHeight: '1.1',
    marginBottom: spacing[6]
  };

  const heroSubtitleStyle: React.CSSProperties = {
    fontSize: typography.fontSize.xl,
    lineHeight: '1.6',
    marginBottom: spacing[8],
    opacity: 0.9
  };

  const statsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: spacing[8],
    marginTop: spacing[12],
    padding: spacing[8],
    backgroundColor: 'white',
    borderRadius: '2rem',
    boxShadow: shadows.xl
  };

  const statStyle: React.CSSProperties = {
    textAlign: 'center'
  };

  const statNumberStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
    marginBottom: spacing[2]
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600]
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={heroStyle}>
        <div style={heroContentStyle}>
          <div style={heroTextStyle}>
            <h1 style={heroTitleStyle}>
              Trova il Professionista Perfetto 
              <span style={{ color: colors.secondary[400] }}> in Sicilia</span>
            </h1>
            <p style={heroSubtitleStyle}>
              La piattaforma AI-powered che connette cittadini e professionisti locali. 
              Servizi di qualità, vicino a te{location ? ` a ${location}` : ''}.
            </p>
            
            <div style={{ display: 'flex', gap: spacing[4], marginBottom: spacing[8] }}>
              <Button
                variant="secondary"
                size="xl"
                onClick={onGetStarted}
                rightIcon={<span>→</span>}
              >
                Trova un Servizio
              </Button>
              
              <Button
                variant="outline"
                size="xl"
                onClick={onBecomeProvider}
                style={{ color: 'white', borderColor: 'white' }}
              >
                Diventa Provider
              </Button>
            </div>

            {!location && (
              <button
                onClick={requestLocation}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  padding: `${spacing[2]} ${spacing[4]}`,
                  borderRadius: '2rem',
                  fontSize: typography.fontSize.sm,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2]
                }}
              >
                📍 Rileva la mia posizione per servizi locali
              </button>
            )}
          </div>

          <div>
            {/* Hero Image/Animation Placeholder */}
            <div style={{
              width: '100%',
              height: '500px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '4rem'
            }}>
              🚀
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: `${spacing[16]} ${spacing[6]}`, marginTop: '-6rem', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={statsContainerStyle}>
            <div style={statStyle}>
              <div style={statNumberStyle}>{stats.providers.toLocaleString()}+</div>
              <div style={statLabelStyle}>Provider Attivi</div>
            </div>
            <div style={statStyle}>
              <div style={statNumberStyle}>{stats.completedJobs.toLocaleString()}+</div>
              <div style={statLabelStyle}>Lavori Completati</div>
            </div>
            <div style={statStyle}>
              <div style={statNumberStyle}>{stats.cities}+</div>
              <div style={statLabelStyle}>Città Coperte</div>
            </div>
            <div style={statStyle}>
              <div style={statNumberStyle}>{stats.satisfaction}%</div>
              <div style={statLabelStyle}>Soddisfazione</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: `${spacing[16]} ${spacing[6]}`, backgroundColor: colors.gray[50] }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: spacing[12] }}>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: typography.fontWeight.bold,
              color: colors.gray[900],
              marginBottom: spacing[4]
            }}>
              Perché Scegliere ERTUNO?
            </h2>
            <p style={{
              fontSize: typography.fontSize.xl,
              color: colors.gray[600],
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              La tecnologia al servizio della qualità. Scopri cosa ci rende unici.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: spacing[8]
          }}>
            {features.map((feature, index) => (
              <Card
                key={index}
                variant="interactive"
                style={{
                  background: feature.gradient,
                  color: 'white',
                  border: 'none',
                  transform: 'translateY(0)',
                  transition: 'all 0.3s ease'
                }}
              >
                <CardBody>
                  <div style={{ 
                    fontSize: '3rem', 
                    marginBottom: spacing[4],
                    textAlign: 'center'
                  }}>
                    {feature.icon}
                  </div>
                  <CardTitle style={{ color: 'white', textAlign: 'center' }}>
                    {feature.title}
                  </CardTitle>
                  <CardDescription style={{ color: 'rgba(255, 255, 255, 0.9)', textAlign: 'center' }}>
                    {feature.description}
                  </CardDescription>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: `${spacing[16]} ${spacing[6]}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: typography.fontWeight.bold,
            textAlign: 'center',
            marginBottom: spacing[12],
            color: colors.gray[900]
          }}>
            Categorie Popolari
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: spacing[6]
          }}>
            {categories.map((category, index) => (
              <Card key={index} variant="interactive">
                <CardBody style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: spacing[4] }}>
                    {category.icon}
                  </div>
                  <CardTitle style={{ fontSize: typography.fontSize.lg }}>
                    {category.name}
                  </CardTitle>
                  <Badge variant="secondary" size="sm" style={{ marginTop: spacing[3] }}>
                    {category.jobs}
                  </Badge>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ 
        padding: `${spacing[16]} ${spacing[6]}`, 
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: typography.fontWeight.bold,
            color: 'white',
            marginBottom: spacing[12]
          }}>
            Cosa Dicono di Noi
          </h2>

          <Card style={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: 'none'
          }}>
            <CardBody style={{ padding: spacing[8] }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: spacing[6] }}>
                <Avatar
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  size="lg"
                />
                <div style={{ marginLeft: spacing[4], textAlign: 'left' }}>
                  <h4 style={{ 
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.semibold,
                    margin: 0,
                    color: colors.gray[900]
                  }}>
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.gray[600],
                    margin: 0
                  }}>
                    {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].location}
                  </p>
                </div>
              </div>

              <p style={{
                fontSize: typography.fontSize.lg,
                fontStyle: 'italic',
                color: colors.gray[700],
                lineHeight: '1.6',
                marginBottom: spacing[4]
              }}>
                "{testimonials[currentTestimonial].text}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: spacing[1] }}>
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <span key={i} style={{ color: colors.secondary[500], fontSize: '1.2rem' }}>
                    ⭐
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Testimonial indicators */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: spacing[2], 
            marginTop: spacing[6] 
          }}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentTestimonial ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: `${spacing[16]} ${spacing[6]}`,
        backgroundColor: colors.gray[900],
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: typography.fontWeight.bold,
            marginBottom: spacing[6]
          }}>
            Pronto a Iniziare?
          </h2>
          <p style={{
            fontSize: typography.fontSize.xl,
            marginBottom: spacing[8],
            opacity: 0.9
          }}>
            Unisciti alla community ERTUNO e scopri un nuovo modo di trovare servizi di qualità.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing[4],
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <Button
              variant="secondary"
              size="xl"
              fullWidth
              onClick={onGetStarted}
            >
              Inizia Ora - È Gratis
            </Button>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={onBecomeProvider}
              style={{ color: 'white', borderColor: 'white' }}
            >
              Diventa Provider
            </Button>
          </div>

          <p style={{
            fontSize: typography.fontSize.sm,
            opacity: 0.7,
            marginTop: spacing[6]
          }}>
            Nessun costo di iscrizione • Supporto 24/7 • Garanzia soddisfatti o rimborsati
          </p>
        </div>
      </section>
    </div>
  );
};
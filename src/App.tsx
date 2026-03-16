import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Logo } from './components/ui/Logo';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingGuard, ProviderRoute, RequesterRoute } from './components/auth/OnboardingGuard';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { BrowseRequests } from './pages/BrowseRequests';
import { ServiceProviderDashboard } from './pages/dashboards/ServiceProviderDashboard';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Research } from './pages/Research';
import { TermsOfService } from './pages/TermsOfService';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { ProviderOnboarding } from './pages/onboarding/ProviderOnboarding';
import { RequesterOnboarding } from './pages/onboarding/RequesterOnboarding';
import { ProviderProfile } from './pages/profiles/ProviderProfile';
import { RequesterProfile } from './pages/profiles/RequesterProfile';
import { ProviderAccount } from './pages/account/ProviderAccount';
import { RequesterAccount } from './pages/account/RequesterAccount';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { I18nProvider } from './hooks/useI18n';
import { CookieConsentProvider } from './hooks/useCookieConsent';
import { CookieConsentBanner } from './components/ui/CookieConsentBanner';
import { CookieSettingsModal } from './components/ui/CookieSettingsModal';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-blue-900 dark:to-teal-900">
        <div className="text-center">
          {/* ERTUNO Logo */}
          <div className="mb-8">
            <Logo 
              variant={loading ? 'light' : 'dark'} 
              size="xl" 
              showText={true}
              showTagline={false}
              className="animate-pulse"
            />
          </div>
          
          {/* Loading Spinner */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ertuno-teal mx-auto mb-4"></div>
          <p className="text-ertuno-navy dark:text-slate-200 font-medium">Loading your experience...</p>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/" />;
};

// Role-based Dashboard Routing Component
const RoleDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  switch (user.role) {
    case 'service_requester':
      return (
        <OnboardingGuard requiredRole="service_requester">
          <Dashboard />
        </OnboardingGuard>
      );
    case 'service_provider':
      return (
        <OnboardingGuard requiredRole="service_provider">
          <ServiceProviderDashboard />
        </OnboardingGuard>
      );
    default:
      // Fallback to generic dashboard for unknown roles
      return <Dashboard />;
  }
};

// Main App Content Component
const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleLoginClick = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const handleSignupClick = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  const handleGetStarted = () => {
    if (user) {
      // User is logged in, redirect to dashboard or specific action
      return;
    } else {
      // User not logged in, show signup modal
      handleSignupClick();
    }
  };

  const handleLearnMore = () => {
    // Scroll to features section or navigate to about page
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Header - Only show on public pages */}
      {!user && (
        <Header
          onLoginClick={handleLoginClick}
          onSignupClick={handleSignupClick}
          theme={theme as 'light' | 'dark'}
          onThemeChange={toggleTheme}
        />
      )}

      {/* Main Content */}
      <main className={!user ? 'pt-0' : ''}>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <LandingPage
                  onGetStarted={handleGetStarted}
                  onLearnMore={handleLearnMore}
                />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/browse"
            element={
              <ProtectedRoute>
                <BrowseRequests />
              </ProtectedRoute>
            }
          />

          {/* Onboarding Routes */}
          <Route
            path="/onboarding/provider"
            element={
              <ProtectedRoute>
                <ProviderOnboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding/requester"
            element={
              <ProtectedRoute>
                <RequesterOnboarding />
              </ProtectedRoute>
            }
          />

          {/* Public Profile Routes */}
          <Route path="/provider/:providerId" element={<ProviderProfile />} />
          <Route path="/requester/:requesterId" element={<RequesterProfile />} />

          {/* Private Account Routes */}
          <Route
            path="/account/provider"
            element={
              <ProviderRoute>
                <ProviderAccount />
              </ProviderRoute>
            }
          />
          <Route
            path="/account/requester"
            element={
              <RequesterRoute>
                <RequesterAccount />
              </RequesterRoute>
            }
          />

          {/* Public Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/research" element={<Research />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer - Show on all pages */}
      <Footer theme={theme as 'light' | 'dark'} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Cookie Consent Banner and Settings Modal */}
      <CookieConsentBanner />
      <CookieSettingsModal />
    </>
  );
};

// Main App Component with Providers
const App: React.FC = () => {
  return (
    <I18nProvider>
      <CookieConsentProvider>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                <AppContent />
              </div>
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </CookieConsentProvider>
    </I18nProvider>
  );
};

export default App;
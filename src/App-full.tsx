import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ServiceSearch } from './pages/ServiceSearch';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { SupportWidget } from './components/support/SupportWidget';
import { CookieConsent } from './components/privacy/CookieConsent';
import { updateCookiePreferences, setUserId } from './lib/analytics';
import { cssVars } from './styles/theme';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/" />;
};

// Main App Content Component
const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  // Check cookie consent status on load
  useEffect(() => {
    const hasConsent = localStorage.getItem('ertuno_cookie_consent');
    if (!hasConsent) {
      setShowCookieConsent(true);
    }
  }, []);

  // Set analytics user ID when user logs in
  useEffect(() => {
    if (user?.uid) {
      setUserId(user.uid);
    }
  }, [user]);

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

  const handleBecomeProvider = () => {
    if (user) {
      // User is logged in, redirect to provider setup/dashboard
      return;
    } else {
      // User not logged in, show signup modal with provider context
      setAuthMode('signup');
      setAuthModalOpen(true);
    }
  };

  const handleProviderSelect = (provider: any) => {
    console.log('Selected provider:', provider);
    // Handle provider selection logic
  };

  const handleMessageProvider = (provider: any) => {
    console.log('Message provider:', provider);
    // Handle messaging logic
  };

  const handleBookService = (provider: any) => {
    console.log('Book service with:', provider);
    // Handle booking logic
  };

  // Handle cookie consent
  const handleCookieAccept = (preferences: any) => {
    localStorage.setItem('ertuno_cookie_consent', JSON.stringify(preferences));
    updateCookiePreferences(preferences);
    setShowCookieConsent(false);
  };

  return (
    <>
      {/* Inject CSS Variables */}
      <style>{cssVars}</style>

      {/* Header - Only show on public pages */}
      {!user && (
        <Header
          onLoginClick={handleLoginClick}
          onSignupClick={handleSignupClick}
          onBecomeProvider={handleBecomeProvider}
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
                  onBecomeProvider={handleBecomeProvider}
                />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ServiceSearch
                onProviderSelect={handleProviderSelect}
                onMessageProvider={handleMessageProvider}
                onBookService={handleBookService}
              />
            }
          />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer - Only show on public pages */}
      {!user && <Footer theme={theme as 'light' | 'dark'} />}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Support Widget */}
      <SupportWidget />

      {/* Cookie Consent */}
      {showCookieConsent && (
        <CookieConsent onAccept={handleCookieAccept} />
      )}
    </>
  );
};

// Main App Component with Providers
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <AppContent />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
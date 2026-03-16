import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { KycService } from '../../services/kycService';

interface OnboardingGuardProps {
  children: React.ReactNode;
  requiredRole?: 'service_provider' | 'service_requester';
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading } = useAuth();
  const [kycStatus, setKycStatus] = useState<{
    loading: boolean;
    needsOnboarding: boolean;
    redirectPath?: string;
  }>({
    loading: true,
    needsOnboarding: false
  });

  useEffect(() => {
    const checkKycStatus = async () => {
      if (!user) {
        setKycStatus({ loading: false, needsOnboarding: false });
        return;
      }

      // If role is required and user doesn't have it, redirect to home
      if (requiredRole && user.role !== requiredRole) {
        setKycStatus({ 
          loading: false, 
          needsOnboarding: true,
          redirectPath: '/'
        });
        return;
      }

      try {
        if (user.role === 'service_provider') {
          const providerKyc = await KycService.getProviderKyc(user.id);
          
          if (!providerKyc) {
            // No KYC data exists, needs onboarding
            setKycStatus({ 
              loading: false, 
              needsOnboarding: true,
              redirectPath: '/onboarding/provider'
            });
            return;
          }

          if (!providerKyc.legal_declaration_accepted || providerKyc.verification_status === 'pending') {
            // KYC incomplete, continue onboarding
            setKycStatus({ 
              loading: false, 
              needsOnboarding: true,
              redirectPath: '/onboarding/provider'
            });
            return;
          }

          // KYC complete
          setKycStatus({ loading: false, needsOnboarding: false });

        } else if (user.role === 'service_requester') {
          const requesterKyc = await KycService.getRequesterKyc(user.id);
          
          if (!requesterKyc) {
            // No KYC data exists, needs onboarding
            setKycStatus({ 
              loading: false, 
              needsOnboarding: true,
              redirectPath: '/onboarding/requester'
            });
            return;
          }

          if (!requesterKyc.legal_declaration_accepted || requesterKyc.verification_status === 'pending') {
            // KYC incomplete, continue onboarding
            setKycStatus({ 
              loading: false, 
              needsOnboarding: true,
              redirectPath: '/onboarding/requester'
            });
            return;
          }

          // KYC complete
          setKycStatus({ loading: false, needsOnboarding: false });

        } else {
          // Unknown role, allow access
          setKycStatus({ loading: false, needsOnboarding: false });
        }

      } catch (error) {
        console.error('Error checking KYC status:', error);
        // On error, allow access (fail open)
        setKycStatus({ loading: false, needsOnboarding: false });
      }
    };

    if (!loading) {
      checkKycStatus();
    }
  }, [user, loading, requiredRole]);

  // Show loading while checking authentication or KYC
  if (loading || kycStatus.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // User not authenticated, redirect to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // User needs onboarding, redirect to appropriate onboarding page
  if (kycStatus.needsOnboarding && kycStatus.redirectPath) {
    return <Navigate to={kycStatus.redirectPath} replace />;
  }

  // All checks passed, render protected content
  return <>{children}</>;
};

// Convenience wrapper for provider-only routes
export const ProviderRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <OnboardingGuard requiredRole="service_provider">
    {children}
  </OnboardingGuard>
);

// Convenience wrapper for requester-only routes
export const RequesterRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <OnboardingGuard requiredRole="service_requester">
    {children}
  </OnboardingGuard>
);
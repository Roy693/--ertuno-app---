import { useState, useEffect, useContext, createContext } from 'react';
import type { ReactNode } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { AuthService } from '../services/authService';
import type { User, AuthState } from '../types';

// Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string, role?: 'job_poster' | 'service_provider' | 'university' | 'student') => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const user = await AuthService.getCurrentUser();
          setAuthState(prev => ({
            ...prev,
            user,
            loading: false,
          }));
        } catch (error: any) {
          setAuthState(prev => ({
            ...prev,
            user: null,
            loading: false,
            error: error.message,
          }));
        }
      } else {
        setAuthState(prev => ({
          ...prev,
          user: null,
          loading: false,
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, role: 'job_poster' | 'service_provider' | 'university' | 'student' = 'job_poster') => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const user = await AuthService.signUp(email, password, name, role);
      setAuthState(prev => ({ ...prev, user, loading: false }));
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const user = await AuthService.signIn(email, password);
      setAuthState(prev => ({ ...prev, user, loading: false }));
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const user = await AuthService.signInWithGoogle();
      setAuthState(prev => ({ ...prev, user, loading: false }));
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      const user = await AuthService.signInWithFacebook();
      setAuthState(prev => ({ ...prev, user, loading: false }));
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await AuthService.signOut();
      setAuthState(prev => ({ ...prev, user: null, loading: false }));
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
      throw error;
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
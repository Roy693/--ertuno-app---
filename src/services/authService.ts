import { AuthService as FirebaseAuthService } from './firebase';
import { MockAuthService } from './mockAuth';
import { isMockMode } from '../config/auth';
import type { User } from '../types';

// Unified Auth Service that switches between Firebase and Mock
export class UnifiedAuthService {
  private static get service() {
    // Always use Firebase Auth for production unless explicitly in mock mode
    return isMockMode() ? MockAuthService : FirebaseAuthService;
  }

  static async signUp(email: string, password: string, name: string, role: 'service_requester' | 'service_provider' = 'service_requester'): Promise<User> {
    if (isMockMode()) {
      console.log('🚧 Using Mock Auth Service - Firebase credentials not configured');
      return MockAuthService.signUp(email, password, name, role);
    }
    console.log('🔥 Using Firebase Auth Service - Production mode');
    return FirebaseAuthService.signUp(email, password, name, role);
  }

  static async signIn(email: string, password: string): Promise<User> {
    if (isMockMode()) {
      console.log('🚧 Using Mock Auth Service - Firebase credentials not configured');
      return MockAuthService.signIn(email, password);
    }
    console.log('🔥 Using Firebase Auth Service - Production mode');
    return FirebaseAuthService.signIn(email, password);
  }

  static async signInWithGoogle(): Promise<User> {
    if (isMockMode()) {
      console.log('🚧 Using Mock Auth Service - Firebase credentials not configured');
      return MockAuthService.signInWithGoogle();
    }
    console.log('🔥 Using Firebase Auth Service - Production mode');
    return FirebaseAuthService.signInWithGoogle();
  }

  static async signInWithFacebook(): Promise<User> {
    if (isMockMode()) {
      console.log('🚧 Using Mock Auth Service - Firebase credentials not configured');
      return MockAuthService.signInWithFacebook();
    }
    console.log('🔥 Using Firebase Auth Service - Production mode');
    return FirebaseAuthService.signInWithFacebook();
  }

  static async signOut(): Promise<void> {
    if (isMockMode()) {
      console.log('🚧 Using Mock Auth Service - Firebase credentials not configured');
      return MockAuthService.signOut();
    }
    return FirebaseAuthService.signOut();
  }

  static onAuthStateChange(callback: (user: any) => void) {
    if (isMockMode()) {
      console.log('🚧 Using Mock Auth Service - Firebase credentials not configured');
      return MockAuthService.onAuthStateChange(callback);
    }
    return FirebaseAuthService.onAuthStateChange(callback);
  }

  static async getCurrentUser(): Promise<User | null> {
    if (isMockMode()) {
      return MockAuthService.getCurrentUser();
    }
    return FirebaseAuthService.getCurrentUser();
  }

  static async sendPasswordReset(email: string): Promise<void> {
    if (isMockMode()) {
      console.log('🚧 Using Mock Auth Service - Password reset email simulated');
      return MockAuthService.sendPasswordReset(email);
    }
    console.log('🔥 Using Firebase Auth Service - Sending real password reset');
    return FirebaseAuthService.sendPasswordReset(email);
  }

  // Utility method to check current mode
  static getAuthMode(): 'firebase' | 'mock' {
    return isMockMode() ? 'mock' : 'firebase';
  }

  // Method to get auth status for debugging
  static getAuthStatus() {
    return {
      mode: this.getAuthMode(),
      isMock: isMockMode(),
      hasFirebaseConfig: !!import.meta.env.VITE_FIREBASE_API_KEY && 
                        import.meta.env.VITE_FIREBASE_API_KEY !== 'demo-key-replace-with-real-firebase-key'
    };
  }
}

// Export as default auth service
export { UnifiedAuthService as AuthService };
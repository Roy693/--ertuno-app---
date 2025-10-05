import { AuthService as FirebaseAuthService } from './firebase';
import { MockAuthService } from './mockAuth';
import { isMockMode } from '../config/auth';
import type { User } from '../types';

// Unified Auth Service that switches between Firebase and Mock
export class UnifiedAuthService {
  private static get service() {
    return isMockMode() ? MockAuthService : FirebaseAuthService;
  }

  static async signUp(email: string, password: string, name: string, role: 'citizen' | 'provider' = 'citizen'): Promise<User> {
    if (isMockMode()) {
      console.log('🚧 Using Mock Auth Service - Firebase credentials not configured');
      return MockAuthService.signUp(email, password, name, role);
    }
    return FirebaseAuthService.signUp(email, password, name, role);
  }

  static async signIn(email: string, password: string): Promise<User> {
    if (isMockMode()) {
      console.log('🚧 Using Mock Auth Service - Firebase credentials not configured');
      return MockAuthService.signIn(email, password);
    }
    return FirebaseAuthService.signIn(email, password);
  }

  static async signInWithGoogle(): Promise<User> {
    if (isMockMode()) {
      console.log('🚧 Using Mock Auth Service - Firebase credentials not configured');
      return MockAuthService.signInWithGoogle();
    }
    return FirebaseAuthService.signInWithGoogle();
  }

  static async signInWithFacebook(): Promise<User> {
    if (isMockMode()) {
      console.log('🚧 Using Mock Auth Service - Firebase credentials not configured');
      return MockAuthService.signInWithFacebook();
    }
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
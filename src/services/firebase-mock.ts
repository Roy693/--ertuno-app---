// Mock Firebase service for demo purposes
import type { User, Service } from '../types';

// Mock Firebase Auth
export class AuthService {
  static async signUp(email: string, _password: string, name: string): Promise<User> {
    return {
      id: 'demo-user-1',
      email,
      name,
      role: 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static async signIn(email: string, _password: string): Promise<User> {
    return {
      id: 'demo-user-1',
      email,
      name: 'Demo User',
      role: 'user',
      avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0ea5e9&color=fff',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static async signInWithGoogle(): Promise<User> {
    return {
      id: 'demo-google-user',
      email: 'demo@google.com',
      name: 'Google Demo User',
      role: 'user',
      avatar: 'https://ui-avatars.com/api/?name=Google+User&background=db2777&color=fff',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static async signInWithFacebook(): Promise<User> {
    return {
      id: 'demo-facebook-user',
      email: 'demo@facebook.com',
      name: 'Facebook Demo User',
      role: 'user',
      avatar: 'https://ui-avatars.com/api/?name=Facebook+User&background=eab308&color=fff',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static async signOut(): Promise<void> {
    // Mock sign out
  }

  static onAuthStateChange(callback: (user: any) => void) {
    // Mock auth state - no user initially
    setTimeout(() => callback(null), 100);
    return () => {}; // Unsubscribe function
  }

  static async getCurrentUser(): Promise<User | null> {
    return null;
  }

  static async getIdToken(): Promise<string | null> {
    return 'mock-token';
  }
}

// Mock Services Service
export class ServicesService {
  static async getUserServices(userId: string): Promise<Service[]> {
    return [
      {
        id: '1',
        name: 'Creative Website Design',
        description: 'Modern and responsive website design for creative agencies and portfolios.',
        icon: '🎨',
        category: 'design',
        createdAt: '2024-01-15T10:00:00Z',
        userId,
      },
      {
        id: '2',
        name: 'Mobile App Development',
        description: 'Cross-platform mobile application development using React Native.',
        icon: '📱',
        category: 'development',
        createdAt: '2024-01-10T14:30:00Z',
        userId,
      },
      {
        id: '3',
        name: 'Brand Identity Package',
        description: 'Complete brand identity design including logo, colors, and typography.',
        icon: '🔖',
        category: 'branding',
        createdAt: '2024-01-05T09:15:00Z',
        userId,
      },
      {
        id: '4',
        name: 'Digital Marketing Strategy',
        description: 'Comprehensive digital marketing strategy and campaign management.',
        icon: '📊',
        category: 'marketing',
        createdAt: '2024-01-01T16:45:00Z',
        userId,
      },
    ];
  }

  static async createService(userId: string, serviceData: any): Promise<Service> {
    return {
      id: Date.now().toString(),
      ...serviceData,
      userId,
      createdAt: new Date().toISOString(),
    };
  }
}
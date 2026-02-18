import type { User } from '../types';

// Mock Firebase Auth Service for Development
export class MockAuthService {
  private static users: Map<string, User> = new Map();
  private static currentUser: User | null = null;
  
  static async signUp(email: string, password: string, name: string, role: 'job_poster' | 'service_provider' | 'university' | 'student' = 'job_poster'): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = Array.from(this.users.values()).find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    // Create new user
    const userData: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
      isProfessional: role === 'service_provider',
      isAcademic: role === 'university' || role === 'student',
      verificationStatus: (role === 'service_provider' || role === 'university') ? 'pending' : undefined,
      academicVerification: (role === 'university' || role === 'student') ? 'pending' : undefined,
    };
    
    this.users.set(userData.id, userData);
    this.currentUser = userData;
    
    // Store in localStorage for persistence
    localStorage.setItem('mockUser', JSON.stringify(userData));
    localStorage.setItem('mockUsers', JSON.stringify(Array.from(this.users.entries())));
    
    return userData;
  }
  
  static async signIn(email: string, password: string): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Load users from localStorage
    this.loadUsers();
    
    // Find user by email
    const user = Array.from(this.users.values()).find(u => u.email === email);
    if (!user) {
      throw new Error('User not found. Please check your email or sign up.');
    }
    
    // In real implementation, verify password here
    // For demo, we just accept any password
    
    this.currentUser = user;
    localStorage.setItem('mockUser', JSON.stringify(user));
    
    return user;
  }
  
  static async signInWithGoogle(): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Create mock Google user
    const userData: User = {
      id: `google_${Date.now()}`,
      email: 'demo@gmail.com',
      name: 'Demo Google User',
      role: 'job_poster',
      avatar: 'https://ui-avatars.com/api/?name=Demo+Google&background=4285f4&color=fff',
      createdAt: new Date().toISOString(),
    };
    
    this.users.set(userData.id, userData);
    this.currentUser = userData;
    
    localStorage.setItem('mockUser', JSON.stringify(userData));
    localStorage.setItem('mockUsers', JSON.stringify(Array.from(this.users.entries())));
    
    return userData;
  }
  
  static async signInWithFacebook(): Promise<User> {
    // Simulate network delay  
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Create mock Facebook user
    const userData: User = {
      id: `facebook_${Date.now()}`,
      email: 'demo@facebook.com',
      name: 'Demo Facebook User',
      role: 'job_poster',
      avatar: 'https://ui-avatars.com/api/?name=Demo+Facebook&background=1877f2&color=fff',
      createdAt: new Date().toISOString(),
    };
    
    this.users.set(userData.id, userData);
    this.currentUser = userData;
    
    localStorage.setItem('mockUser', JSON.stringify(userData));
    localStorage.setItem('mockUsers', JSON.stringify(Array.from(this.users.entries())));
    
    return userData;
  }
  
  static async signOut(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.currentUser = null;
    localStorage.removeItem('mockUser');
  }
  
  static onAuthStateChange(callback: (user: any) => void) {
    // Load persisted user on init
    this.loadCurrentUser();
    
    // Initial call
    setTimeout(() => callback(this.currentUser), 100);
    
    // Return unsubscribe function
    return () => {};
  }
  
  static async getCurrentUser(): Promise<User | null> {
    this.loadCurrentUser();
    return this.currentUser;
  }
  
  private static loadUsers() {
    try {
      const stored = localStorage.getItem('mockUsers');
      if (stored) {
        const userEntries = JSON.parse(stored);
        this.users = new Map(userEntries);
      }
    } catch (error) {
      console.warn('Could not load mock users:', error);
    }
  }
  
  private static loadCurrentUser() {
    try {
      const stored = localStorage.getItem('mockUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Could not load current user:', error);
      this.currentUser = null;
    }
  }

  static async sendPasswordReset(email: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists
    this.loadUsers();
    const userExists = Array.from(this.users.values()).some(u => u.email === email);
    if (!userExists) {
      throw new Error('No user found with this email address');
    }
    
    console.log(`Mock: Password reset email sent to ${email}`);
  }
}
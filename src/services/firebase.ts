import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  type User as FirebaseUser
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../utils/constants';
import type { User, Service } from '../types';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Auth Service
export class AuthService {
  static async signUp(email: string, password: string, name: string, role: 'citizen' | 'provider' = 'citizen'): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create user document in Firestore
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name,
        role,
        createdAt: new Date().toISOString(),
        // Set professional fields for providers
        isProfessional: role === 'provider',
        verificationStatus: role === 'provider' ? 'pending' : undefined,
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      return userData;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    }
  }

  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      return userDoc.data() as User;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  static async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Check if user exists in Firestore
      let userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // Create new user document
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || 'Google User',
          avatar: firebaseUser.photoURL || undefined,
          role: 'citizen', // Default role for social login
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        return userData;
      }

      return userDoc.data() as User;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  }

  static async signInWithFacebook(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const firebaseUser = result.user;

      // Check if user exists in Firestore
      let userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // Create new user document
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || 'Facebook User',
          avatar: firebaseUser.photoURL || undefined,
          role: 'citizen', // Default role for social login
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        return userData;
      }

      return userDoc.data() as User;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with Facebook');
    }
  }

  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  static onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  static async getCurrentUser(): Promise<User | null> {
    if (!auth.currentUser) return null;

    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (!userDoc.exists()) return null;

      return userDoc.data() as User;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async getIdToken(): Promise<string | null> {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  }
}

// Services Service (for user services/projects)
export class ServicesService {
  static async getUserServices(userId: string): Promise<Service[]> {
    try {
      const servicesRef = collection(db, 'users', userId, 'services');
      const snapshot = await getDocs(servicesRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch services');
    }
  }

  static async createService(userId: string, serviceData: Omit<Service, 'id' | 'userId' | 'createdAt'>): Promise<Service> {
    try {
      const serviceId = doc(collection(db, 'users', userId, 'services')).id;
      const service: Service = {
        id: serviceId,
        ...serviceData,
        userId,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', userId, 'services', serviceId), service);
      return service;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create service');
    }
  }
}
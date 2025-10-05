import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../utils/constants';
import type { 
  User, 
  ServiceProvider, 
  ServiceRequest, 
  ServiceOffer, 
  Booking, 
  Location, 
  MatchingCriteria,
  AIMatchResult
} from '../types';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);



// Enhanced Auth Service with Role-based Authentication
export class EnhancedAuthService {
  static async signUpUser(email: string, password: string, name: string, phone?: string, location?: Location): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name,
        phone,
        location,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      return userData;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create user account');
    }
  }

  static async signUpProvider(
    email: string, 
    password: string, 
    name: string, 
    businessName: string,
    serviceCategories: string[],
    location: Location,
    phone?: string
  ): Promise<ServiceProvider> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const providerData: ServiceProvider = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name,
        phone,
        role: 'provider',
        businessName,
        businessDescription: '',
        serviceCategories,
        serviceArea: [location],
        location,
        hourlyRate: 0,
        isVerified: false,
        rating: 0,
        totalJobs: 0,
        availability: {
          isActive: true,
          workingHours: {
            monday: { start: '09:00', end: '17:00', available: true },
            tuesday: { start: '09:00', end: '17:00', available: true },
            wednesday: { start: '09:00', end: '17:00', available: true },
            thursday: { start: '09:00', end: '17:00', available: true },
            friday: { start: '09:00', end: '17:00', available: true },
            saturday: { start: '09:00', end: '15:00', available: true },
            sunday: { start: '10:00', end: '14:00', available: false }
          },
          emergencyService: false
        },
        subscription: {
          plan: 'basic',
          status: 'trial',
          leadsRemaining: 3,
          monthlyLeadLimit: 10,
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days trial
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'providers', firebaseUser.uid), providerData);
      return providerData;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create provider account');
    }
  }

  static async signIn(email: string, password: string): Promise<User | ServiceProvider> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Check if user is a provider first
      const providerDoc = await getDoc(doc(db, 'providers', firebaseUser.uid));
      if (providerDoc.exists()) {
        return providerDoc.data() as ServiceProvider;
      }

      // Otherwise, get regular user data
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      return userDoc.data() as User;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  static async getCurrentUser(): Promise<User | ServiceProvider | null> {
    if (!auth.currentUser) return null;

    try {
      // Check provider first
      const providerDoc = await getDoc(doc(db, 'providers', auth.currentUser.uid));
      if (providerDoc.exists()) {
        return providerDoc.data() as ServiceProvider;
      }

      // Check regular user
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (!userDoc.exists()) return null;

      return userDoc.data() as User;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<User | ServiceProvider>): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const providerDoc = await getDoc(doc(db, 'providers', userId));
      
      if (providerDoc.exists()) {
        await updateDoc(doc(db, 'providers', userId), {
          ...updates,
          updatedAt: new Date().toISOString()
        });
      } else if (userDoc.exists()) {
        await updateDoc(doc(db, 'users', userId), {
          ...updates,
          updatedAt: new Date().toISOString()
        });
      } else {
        throw new Error('User not found');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  // ... other existing methods
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

  static async getIdToken(): Promise<string | null> {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  }
}

// Service Request Management
export class ServiceRequestService {
  static async createRequest(requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceRequest> {
    try {
      const docRef = await addDoc(collection(db, 'serviceRequests'), {
        ...requestData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        id: docRef.id,
        ...requestData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create service request');
    }
  }

  static async getUserRequests(userId: string): Promise<ServiceRequest[]> {
    try {
      const q = query(
        collection(db, 'serviceRequests'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ServiceRequest[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user requests');
    }
  }

  static async getRequestsByLocation(location: Location, radius: number = 25): Promise<ServiceRequest[]> {
    try {
      // Note: For production, you'd want to use geohashing for efficient geo queries
      const q = query(
        collection(db, 'serviceRequests'),
        where('status', 'in', ['pending', 'offers_received']),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ServiceRequest[];

      // Client-side filtering by distance (for demo)
      return requests.filter(request => {
        const distance = this.calculateDistance(location, request.location);
        return distance <= radius;
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch requests by location');
    }
  }

  private static calculateDistance(loc1: Location, loc2: Location): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(loc2.latitude - loc1.latitude);
    const dLon = this.toRadians(loc2.longitude - loc1.longitude);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(loc1.latitude)) * Math.cos(this.toRadians(loc2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI/180);
  }
}

// AI-Powered Matching Service
export class AIMatchingService {
  static async findMatchingProviders(criteria: MatchingCriteria): Promise<AIMatchResult[]> {
    try {
      // Get providers in the category
      const q = query(
        collection(db, 'providers'),
        where('serviceCategories', 'array-contains', criteria.category),
        where('subscription.status', '==', 'active'),
        where('availability.isActive', '==', true)
      );

      const querySnapshot = await getDocs(q);
      const providers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ServiceProvider[];

      // Calculate match scores
      const matches: AIMatchResult[] = providers
        .map(provider => this.calculateMatchScore(provider, criteria))
        .filter(match => match.score > 0.3) // Minimum threshold
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Top 5 matches

      return matches;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to find matching providers');
    }
  }

  private static calculateMatchScore(provider: ServiceProvider, criteria: MatchingCriteria): AIMatchResult {
    let score = 0;
    const reasons: string[] = [];

    // Distance scoring (30% weight)
    const distance = this.calculateDistance(criteria.location, provider.location!);
    const distanceScore = Math.max(0, 1 - (distance / 50)); // 50 mile max
    score += distanceScore * 0.3;
    
    if (distance <= 10) reasons.push('Very close to your location');
    else if (distance <= 25) reasons.push('Within your area');

    // Rating scoring (25% weight)
    const ratingScore = provider.rating / 5;
    score += ratingScore * 0.25;
    
    if (provider.rating >= 4.5) reasons.push('Highly rated professional');
    else if (provider.rating >= 4.0) reasons.push('Well-rated service provider');

    // Price scoring (20% weight) - inverse relationship
    const priceScore = Math.max(0, 1 - ((provider.hourlyRate - criteria.budget) / criteria.budget));
    score += Math.max(0, priceScore) * 0.2;
    
    if (provider.hourlyRate <= criteria.budget * 0.8) reasons.push('Great value pricing');
    else if (provider.hourlyRate <= criteria.budget) reasons.push('Within your budget');

    // Availability scoring (15% weight)
    let availabilityScore = 0.5; // Base availability
    if (provider.availability.emergencyService && criteria.urgency === 'emergency') {
      availabilityScore = 1.0;
      reasons.push('Offers emergency services');
    }
    score += availabilityScore * 0.15;

    // Experience scoring (10% weight)
    const experienceScore = Math.min(1, provider.totalJobs / 100);
    score += experienceScore * 0.1;
    
    if (provider.totalJobs >= 50) reasons.push('Extensive experience');
    else if (provider.totalJobs >= 10) reasons.push('Experienced provider');

    // Additional bonuses
    if (provider.isVerified) {
      score += 0.05;
      reasons.push('Trusted Provider');
    }

    return {
      providerId: provider.id,
      score: Math.min(1, score),
      reasons,
      distance,
      estimatedCost: provider.hourlyRate
    };
  }

  private static calculateDistance(loc1: Location, loc2: Location): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(loc2.latitude - loc1.latitude);
    const dLon = this.toRadians(loc2.longitude - loc1.longitude);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(loc1.latitude)) * Math.cos(this.toRadians(loc2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI/180);
  }
}

// Offer Management Service
export class OfferService {
  static async createOffer(offerData: Omit<ServiceOffer, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceOffer> {
    try {
      const docRef = await addDoc(collection(db, 'serviceOffers'), {
        ...offerData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        id: docRef.id,
        ...offerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create offer');
    }
  }

  static async getOffersForRequest(requestId: string): Promise<ServiceOffer[]> {
    try {
      const q = query(
        collection(db, 'serviceOffers'),
        where('requestId', '==', requestId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ServiceOffer[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch offers');
    }
  }

  static async acceptOffer(offerId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Update the accepted offer
      batch.update(doc(db, 'serviceOffers', offerId), {
        status: 'accepted',
        updatedAt: serverTimestamp()
      });

      // Decline other offers for the same request
      const offerDoc = await getDoc(doc(db, 'serviceOffers', offerId));
      if (offerDoc.exists()) {
        const offer = offerDoc.data() as ServiceOffer;
        
        const otherOffersQuery = query(
          collection(db, 'serviceOffers'),
          where('requestId', '==', offer.requestId),
          where('id', '!=', offerId)
        );
        
        const otherOffers = await getDocs(otherOffersQuery);
        otherOffers.docs.forEach(doc => {
          batch.update(doc.ref, {
            status: 'declined',
            updatedAt: serverTimestamp()
          });
        });

        // Update request status
        batch.update(doc(db, 'serviceRequests', offer.requestId), {
          status: 'booked',
          updatedAt: serverTimestamp()
        });
      }

      await batch.commit();
    } catch (error: any) {
      throw new Error(error.message || 'Failed to accept offer');
    }
  }
}

// Booking Management Service
export class BookingService {
  static async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...bookingData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        id: docRef.id,
        ...bookingData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create booking');
    }
  }

  static async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch user bookings');
    }
  }

  static async getProviderBookings(providerId: string): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, 'bookings'),
        where('providerId', '==', providerId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch provider bookings');
    }
  }
}

// Subscription Management Service
export class SubscriptionService {
  static async updateProviderSubscription(
    providerId: string, 
    subscriptionData: Partial<ServiceProvider['subscription']>
  ): Promise<void> {
    try {
      await updateDoc(doc(db, 'providers', providerId), {
        subscription: subscriptionData,
        updatedAt: new Date().toISOString()
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update subscription');
    }
  }

  static async deductLead(providerId: string): Promise<boolean> {
    try {
      const providerDoc = await getDoc(doc(db, 'providers', providerId));
      if (!providerDoc.exists()) {
        throw new Error('Provider not found');
      }

      const provider = providerDoc.data() as ServiceProvider;
      if (provider.subscription.leadsRemaining <= 0 && provider.subscription.monthlyLeadLimit !== -1) {
        return false; // No leads remaining
      }

      await updateDoc(doc(db, 'providers', providerId), {
        'subscription.leadsRemaining': provider.subscription.leadsRemaining - 1,
        updatedAt: new Date().toISOString()
      });

      return true;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to deduct lead');
    }
  }
}
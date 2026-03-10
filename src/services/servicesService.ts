import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  doc, 
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  type QueryConstraint 
} from 'firebase/firestore';
import { db } from './firebase';
import type { ServiceRequest, ServiceResponse, User } from '../types';

export interface ServiceProvider {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  categories: string[];
  zones: string[];
  rating: number;
  reviewCount: number;
  profileImage?: string;
  portfolioImages: string[];
  experience: string;
  skills: string[];
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
      radius: number; // Service radius in km
    };
  };
  pricing?: {
    hourlyRate?: number;
    fixedPrices?: { [service: string]: number };
    currency: string;
  };
  availability: {
    workingHours: string[];
    daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
    timezone: string;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface ServiceListing {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  zone: string;
  pricing: {
    type: 'hourly' | 'fixed' | 'custom';
    amount?: number;
    currency: string;
    description?: string;
  };
  images: string[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class ServicesService {
  // Get all service providers with optional filtering
  static async getServiceProviders(filters?: {
    category?: string;
    zone?: string;
    minRating?: number;
    maxDistance?: number;
    userLocation?: { lat: number; lng: number };
  }): Promise<ServiceProvider[]> {
    try {
      const constraints: QueryConstraint[] = [];
      
      // Add status filter for verified providers only
      constraints.push(where('verificationStatus', '==', 'verified'));
      
      if (filters?.category) {
        constraints.push(where('categories', 'array-contains', filters.category));
      }
      
      if (filters?.zone) {
        constraints.push(where('zones', 'array-contains', filters.zone));
      }
      
      if (filters?.minRating) {
        constraints.push(where('rating', '>=', filters.minRating));
      }
      
      // Order by rating (highest first)
      constraints.push(orderBy('rating', 'desc'));
      constraints.push(limit(50)); // Limit results for performance
      
      const q = query(collection(db, 'serviceProviders'), ...constraints);
      const snapshot = await getDocs(q);
      
      const providers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ServiceProvider[];
      
      // If user location is provided, filter by distance
      if (filters?.userLocation && filters?.maxDistance) {
        return providers.filter(provider => {
          if (!provider.location.coordinates) return false;
          
          const distance = calculateDistance(
            filters.userLocation!,
            provider.location.coordinates
          );
          
          return distance <= (filters.maxDistance || provider.location.coordinates.radius);
        });
      }
      
      return providers;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch service providers');
    }
  }
  
  // Get service listings by zone/category
  static async getServiceListings(filters?: {
    category?: string;
    zone?: string;
    search?: string;
  }): Promise<ServiceListing[]> {
    try {
      const constraints: QueryConstraint[] = [];
      
      // Only active listings
      constraints.push(where('isActive', '==', true));
      
      if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
      }
      
      if (filters?.zone) {
        constraints.push(where('zone', '==', filters.zone));
      }
      
      // Order by creation date (newest first)
      constraints.push(orderBy('createdAt', 'desc'));
      constraints.push(limit(100));
      
      const q = query(collection(db, 'serviceListings'), ...constraints);
      const snapshot = await getDocs(q);
      
      let listings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ServiceListing[];
      
      // Apply text search filter if provided
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        listings = listings.filter(listing => 
          listing.title.toLowerCase().includes(searchTerm) ||
          listing.description.toLowerCase().includes(searchTerm) ||
          listing.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      return listings;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch service listings');
    }
  }
  
  // Get service provider by ID
  static async getServiceProvider(providerId: string): Promise<ServiceProvider | null> {
    try {
      const docRef = doc(db, 'serviceProviders', providerId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as ServiceProvider;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch service provider');
    }
  }
  
  // Create or update service provider profile
  static async updateServiceProvider(userId: string, providerData: Partial<ServiceProvider>): Promise<ServiceProvider> {
    try {
      const providerId = `provider_${userId}`;
      const docRef = doc(db, 'serviceProviders', providerId);
      
      // Check if provider exists
      const existingDoc = await getDoc(docRef);
      const isUpdate = existingDoc.exists();
      
      const updatedData: Partial<ServiceProvider> = {
        ...providerData,
        userId,
        updatedAt: new Date().toISOString(),
        ...(isUpdate ? {} : { createdAt: new Date().toISOString() })
      };
      
      await setDoc(docRef, updatedData, { merge: true });
      
      // Return the updated provider
      const updatedDoc = await getDoc(docRef);
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      } as ServiceProvider;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update service provider');
    }
  }
  
  // Create service listing
  static async createServiceListing(providerId: string, listingData: Omit<ServiceListing, 'id' | 'providerId' | 'createdAt' | 'updatedAt'>): Promise<ServiceListing> {
    try {
      const docRef = await addDoc(collection(db, 'serviceListings'), {
        ...listingData,
        providerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      return {
        id: docRef.id,
        providerId,
        ...listingData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create service listing');
    }
  }
  
  // Get available zones (could be predefined or dynamic)
  static async getAvailableZones(): Promise<string[]> {
    // For now, return predefined zones. In production, this could be dynamic
    return [
      'Milan Center',
      'Milan North',
      'Milan South',
      'Milan East',
      'Milan West',
      'Rome Center',
      'Rome North',
      'Rome South',
      'Naples Center',
      'Naples North',
      'Turin Center',
      'Florence Center',
      'Bologna Center',
      'Palermo Center',
      'Genoa Center',
      'Venice Center'
    ];
  }
  
  // Get service categories
  static getServiceCategories(): { id: string; name: string; subcategories: string[] }[] {
    return [
      {
        id: 'home_services',
        name: 'Home Services',
        subcategories: [
          'Plumbing',
          'Electrical',
          'Painting',
          'Carpentry',
          'Cleaning',
          'Gardening',
          'HVAC',
          'Roofing',
          'Flooring',
          'Appliance Repair'
        ]
      },
      {
        id: 'professional_services',
        name: 'Professional Services',
        subcategories: [
          'Legal',
          'Accounting',
          'Consulting',
          'Marketing',
          'Web Development',
          'Graphic Design',
          'Photography',
          'Writing',
          'Translation',
          'Real Estate'
        ]
      },
      {
        id: 'personal_services',
        name: 'Personal Services',
        subcategories: [
          'Fitness Training',
          'Tutoring',
          'Pet Care',
          'Childcare',
          'Beauty & Wellness',
          'Event Planning',
          'Moving Services',
          'Personal Shopping',
          'Life Coaching',
          'Music Lessons'
        ]
      },
      {
        id: 'automotive',
        name: 'Automotive',
        subcategories: [
          'Car Repair',
          'Car Detailing',
          'Roadside Assistance',
          'Auto Insurance',
          'Vehicle Inspection',
          'Motorcycle Services',
          'Truck Services',
          'Car Rental'
        ]
      }
    ];
  }
}

// Helper function to calculate distance between two coordinates
function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}
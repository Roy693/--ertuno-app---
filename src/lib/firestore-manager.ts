import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  serverTimestamp, 
  DocumentData,
  DocumentReference,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Types for better type safety
export interface BaseDocument {
  id?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface UserDocument extends BaseDocument {
  uid: string;
  email: string;
  role: 'user' | 'provider' | 'admin';
  name: string;
  location?: {
    city: string;
    region: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  profileImage?: string;
  phone?: string;
  verified: boolean;
  trustScore: number;
}

export interface ProviderDocument extends BaseDocument {
  uid: string;
  email: string;
  role: 'provider';
  name: string;
  services: string[];
  subscriptionStatus: 'free' | 'premium' | 'enterprise';
  rating: number;
  reviewCount: number;
  location: {
    city: string;
    region: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  businessName?: string;
  description?: string;
  availability: string[];
  badges: string[];
  responseTime: number; // in hours
  completedJobs: number;
  profileImages: string[];
}

export interface LeadDocument extends BaseDocument {
  userId: string;
  category: string;
  title: string;
  description: string;
  location: {
    city: string;
    region: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  urgency: 'low' | 'medium' | 'high';
  mediaUrls: string[];
  proposals: string[]; // provider IDs who proposed
  selectedProviderId?: string;
  deadlineDate?: Timestamp;
}

export interface BookingDocument extends BaseDocument {
  leadId: string;
  userId: string;
  providerId: string;
  scheduledDate: Timestamp;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  totalAmount?: number;
  notes?: string;
  completedDate?: Timestamp;
  rating?: number;
  review?: string;
}

export interface ChatDocument extends BaseDocument {
  participants: string[]; // [userId, providerId]
  lastMessage: {
    text: string;
    senderId: string;
    timestamp: Timestamp;
  };
  leadId?: string;
  bookingId?: string;
}

export interface MessageDocument extends BaseDocument {
  chatId: string;
  senderId: string;
  text: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  readBy: string[];
}

// Core Firestore Manager Class
class FirestoreManager {
  
  /**
   * Generic function to create a document with existence check
   */
  async createDocument<T extends DocumentData>(
    collectionName: string, 
    docId: string | null, 
    data: Omit<T, 'id' | 'createdAt'>
  ): Promise<DocumentReference | null> {
    try {
      const docData = {
        ...data,
        createdAt: serverTimestamp()
      } as T;

      if (docId) {
        // Use specific doc ID (for users/providers using uid)
        const docRef = doc(db, collectionName, docId);
        
        // Check if document already exists
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log(`Document ${docId} already exists in ${collectionName}`);
          return docRef;
        }

        await setDoc(docRef, docData);
        console.log(`Created document ${docId} in ${collectionName}`);
        return docRef;
      } else {
        // Auto-generate doc ID (for leads/bookings)
        const docRef = await addDoc(collection(db, collectionName), docData);
        console.log(`Created document ${docRef.id} in ${collectionName}`);
        return docRef;
      }
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      return null;
    }
  }

  /**
   * Create user document (triggered on signup/first login)
   */
  async createUserDocument(
    uid: string, 
    email: string, 
    name: string, 
    location?: string
  ): Promise<DocumentReference | null> {
    const userData: Omit<UserDocument, 'id' | 'createdAt'> = {
      uid,
      email,
      role: 'user',
      name,
      location: location ? {
        city: location,
        region: 'Sicilia'
      } : undefined,
      verified: false,
      trustScore: 0
    };

    return this.createDocument<UserDocument>('users', uid, userData);
  }

  /**
   * Create provider document (triggered on provider registration)
   */
  async createProviderDocument(
    uid: string,
    email: string,
    name: string,
    services: string[],
    location: string,
    businessName?: string
  ): Promise<DocumentReference | null> {
    const providerData: Omit<ProviderDocument, 'id' | 'createdAt'> = {
      uid,
      email,
      role: 'provider',
      name,
      services,
      subscriptionStatus: 'free',
      rating: 0,
      reviewCount: 0,
      location: {
        city: location,
        region: 'Sicilia'
      },
      businessName,
      availability: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      badges: [],
      responseTime: 24,
      completedJobs: 0,
      profileImages: []
    };

    return this.createDocument<ProviderDocument>('providers', uid, providerData);
  }

  /**
   * Create lead document (triggered when user posts a job)
   */
  async createLeadDocument(
    userId: string,
    category: string,
    title: string,
    description: string,
    location: string,
    urgency: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<DocumentReference | null> {
    const leadData: Omit<LeadDocument, 'id' | 'createdAt'> = {
      userId,
      category,
      title,
      description,
      location: {
        city: location,
        region: 'Sicilia'
      },
      status: 'open',
      urgency,
      mediaUrls: [],
      proposals: []
    };

    return this.createDocument<LeadDocument>('leads', null, leadData);
  }

  /**
   * Create booking document (triggered when provider confirms job)
   */
  async createBookingDocument(
    leadId: string,
    userId: string,
    providerId: string,
    scheduledDate: Date
  ): Promise<DocumentReference | null> {
    const bookingData: Omit<BookingDocument, 'id' | 'createdAt'> = {
      leadId,
      userId,
      providerId,
      scheduledDate: Timestamp.fromDate(scheduledDate),
      status: 'confirmed',
      paymentStatus: 'pending'
    };

    return this.createDocument<BookingDocument>('bookings', null, bookingData);
  }

  /**
   * Create chat document for user-provider communication
   */
  async createChatDocument(
    userId: string,
    providerId: string,
    leadId?: string
  ): Promise<DocumentReference | null> {
    const chatId = `${userId}_${providerId}`;
    
    const chatData: Omit<ChatDocument, 'id' | 'createdAt'> = {
      participants: [userId, providerId],
      lastMessage: {
        text: 'Chat iniziata',
        senderId: 'system',
        timestamp: serverTimestamp() as Timestamp
      },
      leadId
    };

    return this.createDocument<ChatDocument>('chats', chatId, chatData);
  }

  /**
   * Input validation helper
   */
  validateInput(data: any, requiredFields: string[]): boolean {
    for (const field of requiredFields) {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        console.error(`Required field missing: ${field}`);
        return false;
      }
    }
    return true;
  }

  /**
   * Error handling wrapper for UI operations
   */
  async safeOperation<T>(
    operation: () => Promise<T>, 
    errorMessage: string,
    fallbackValue: T
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error(errorMessage, error);
      // Here you could show a toast notification to the user
      return fallbackValue;
    }
  }
}

// Export singleton instance
export const firestoreManager = new FirestoreManager();

// Export helper functions for common operations
export const createUser = (uid: string, email: string, name: string, location?: string) =>
  firestoreManager.createUserDocument(uid, email, name, location);

export const createProvider = (uid: string, email: string, name: string, services: string[], location: string, businessName?: string) =>
  firestoreManager.createProviderDocument(uid, email, name, services, location, businessName);

export const createLead = (userId: string, category: string, title: string, description: string, location: string, urgency?: 'low' | 'medium' | 'high') =>
  firestoreManager.createLeadDocument(userId, category, title, description, location, urgency);

export const createBooking = (leadId: string, userId: string, providerId: string, scheduledDate: Date) =>
  firestoreManager.createBookingDocument(leadId, userId, providerId, scheduledDate);

export const createChat = (userId: string, providerId: string, leadId?: string) =>
  firestoreManager.createChatDocument(userId, providerId, leadId);
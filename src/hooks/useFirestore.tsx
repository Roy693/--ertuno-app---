import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  DocumentData,
  QueryConstraint 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';
import { 
  firestoreManager,
  UserDocument,
  ProviderDocument,
  LeadDocument,
  BookingDocument 
} from '../lib/firestore-manager';

// Hook for managing user signup and document creation
export const useUserSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signupUser = async (
    uid: string, 
    email: string, 
    name: string, 
    location?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const docRef = await firestoreManager.createUserDocument(uid, email, name, location);
      if (!docRef) {
        throw new Error('Failed to create user document');
      }
      return docRef;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { signupUser, loading, error };
};

// Hook for provider registration
export const useProviderRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerProvider = async (
    uid: string,
    email: string,
    name: string,
    services: string[],
    location: string,
    businessName?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      if (!firestoreManager.validateInput(
        { uid, email, name, services, location }, 
        ['uid', 'email', 'name', 'services', 'location']
      )) {
        throw new Error('Missing required fields');
      }

      const docRef = await firestoreManager.createProviderDocument(
        uid, email, name, services, location, businessName
      );
      
      if (!docRef) {
        throw new Error('Failed to create provider document');
      }
      
      return docRef;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Provider registration failed';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { registerProvider, loading, error };
};

// Hook for creating leads
export const useLeadCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLead = async (
    userId: string,
    category: string,
    title: string,
    description: string,
    location: string,
    urgency: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    setLoading(true);
    setError(null);

    try {
      if (!firestoreManager.validateInput(
        { userId, category, title, description, location }, 
        ['userId', 'category', 'title', 'description', 'location']
      )) {
        throw new Error('Missing required fields');
      }

      const docRef = await firestoreManager.createLeadDocument(
        userId, category, title, description, location, urgency
      );
      
      if (!docRef) {
        throw new Error('Failed to create lead');
      }
      
      return docRef;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Lead creation failed';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createLead, loading, error };
};

// Hook for creating bookings
export const useBookingCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = async (
    leadId: string,
    userId: string,
    providerId: string,
    scheduledDate: Date
  ) => {
    setLoading(true);
    setError(null);

    try {
      if (!firestoreManager.validateInput(
        { leadId, userId, providerId, scheduledDate }, 
        ['leadId', 'userId', 'providerId', 'scheduledDate']
      )) {
        throw new Error('Missing required fields');
      }

      const docRef = await firestoreManager.createBookingDocument(
        leadId, userId, providerId, scheduledDate
      );
      
      if (!docRef) {
        throw new Error('Failed to create booking');
      }
      
      return docRef;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Booking creation failed';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error };
};

// Real-time data hooks
export const useRealtimeCollection = <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const documents: T[] = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(documents);
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
};

// Hook for user-specific leads
export const useUserLeads = () => {
  const { user } = useAuth();
  
  const constraints = user ? [
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  ] : [];

  return useRealtimeCollection<LeadDocument>('leads', constraints);
};

// Hook for provider-specific data
export const useProviderData = () => {
  const { user } = useAuth();
  
  // Get leads in the provider's location and service categories
  const [leads, setLeads] = useState<LeadDocument[]>([]);
  const [bookings, setBookings] = useState<BookingDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Get bookings for this provider
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('providerId', '==', user.uid),
      orderBy('scheduledDate', 'desc')
    );

    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingData: BookingDocument[] = [];
      snapshot.forEach(doc => {
        bookingData.push({ id: doc.id, ...doc.data() } as BookingDocument);
      });
      setBookings(bookingData);
    });

    // Get open leads (simplified - in production, filter by location/services)
    const leadsQuery = query(
      collection(db, 'leads'),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribeLeads = onSnapshot(leadsQuery, (snapshot) => {
      const leadData: LeadDocument[] = [];
      snapshot.forEach(doc => {
        leadData.push({ id: doc.id, ...doc.data() } as LeadDocument);
      });
      setLeads(leadData);
      setLoading(false);
    });

    return () => {
      unsubscribeBookings();
      unsubscribeLeads();
    };
  }, [user]);

  return { leads, bookings, loading };
};

// Hook for nearby providers (location-aware)
export const useNearbyProviders = (location?: string, category?: string) => {
  const constraints: QueryConstraint[] = [
    where('role', '==', 'provider'),
    orderBy('rating', 'desc'),
    limit(20)
  ];

  // In production, you'd add geolocation queries here
  if (location) {
    // constraints.push(where('location.city', '==', location));
  }

  return useRealtimeCollection<ProviderDocument>('providers', constraints);
};

// Hook for real-time notifications
export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Listen for new leads if user is a provider
    // Listen for booking updates if user is a customer
    // This is a simplified version - in production you'd have a notifications collection

    const mockNotifications = [
      {
        id: '1',
        type: 'new_lead',
        title: 'Nuovo lavoro disponibile',
        message: 'Riparazione idraulica a Comiso',
        timestamp: new Date(),
        read: false
      }
    ];

    setNotifications(mockNotifications);
  }, [user]);

  return { notifications };
};
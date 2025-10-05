import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc,
  deleteDoc,
  query, 
  orderBy, 
  where,
  getDocs,
  getDoc,
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import type { ServiceRequest, ServiceResponse } from '../types';

export class ServiceRequestsService {
  // Create a new service request
  static async createServiceRequest(
    userId: string,
    requestData: Omit<ServiceRequest, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'responseCount' | 'status'>
  ): Promise<string> {
    const serviceRequest = {
      ...requestData,
      userId,
      status: 'open' as const,
      responseCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'serviceRequests'), serviceRequest);
    return docRef.id;
  }

  // Get all open service requests (for professionals to browse)
  static async getOpenServiceRequests(
    category?: string,
    location?: { city: string; state: string }
  ): Promise<ServiceRequest[]> {
    let q = query(
      collection(db, 'serviceRequests'),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    );

    if (category && category !== 'all') {
      q = query(
        collection(db, 'serviceRequests'),
        where('status', '==', 'open'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    let requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
    } as ServiceRequest));

    // Filter by location if provided
    if (location) {
      requests = requests.filter(request => 
        request.location.city.toLowerCase() === location.city.toLowerCase() &&
        request.location.state.toLowerCase() === location.state.toLowerCase()
      );
    }

    return requests;
  }

  // Get service requests created by a user
  static async getUserServiceRequests(userId: string): Promise<ServiceRequest[]> {
    const q = query(
      collection(db, 'serviceRequests'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
    } as ServiceRequest));
  }

  // Get a specific service request
  static async getServiceRequest(requestId: string): Promise<ServiceRequest | null> {
    const docRef = doc(db, 'serviceRequests', requestId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      } as ServiceRequest;
    }
    
    return null;
  }

  // Update service request status
  static async updateServiceRequestStatus(
    requestId: string, 
    status: ServiceRequest['status']
  ): Promise<void> {
    const docRef = doc(db, 'serviceRequests', requestId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp()
    });
  }

  // Submit a professional response to a service request
  static async submitResponse(
    serviceRequestId: string,
    professionalId: string,
    responseData: Omit<ServiceResponse, 'id' | 'serviceRequestId' | 'professionalId' | 'createdAt' | 'status'>
  ): Promise<string> {
    const response = {
      ...responseData,
      serviceRequestId,
      professionalId,
      status: 'pending' as const,
      createdAt: serverTimestamp()
    };

    // Add the response
    const docRef = await addDoc(collection(db, 'serviceResponses'), response);

    // Increment response count on the service request
    const serviceRequestRef = doc(db, 'serviceRequests', serviceRequestId);
    await updateDoc(serviceRequestRef, {
      responseCount: increment(1),
      updatedAt: serverTimestamp()
    });

    return docRef.id;
  }

  // Get responses for a service request
  static async getServiceRequestResponses(serviceRequestId: string): Promise<ServiceResponse[]> {
    const q = query(
      collection(db, 'serviceResponses'),
      where('serviceRequestId', '==', serviceRequestId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
    } as ServiceResponse));
  }

  // Get responses submitted by a professional
  static async getProfessionalResponses(professionalId: string): Promise<ServiceResponse[]> {
    const q = query(
      collection(db, 'serviceResponses'),
      where('professionalId', '==', professionalId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
    } as ServiceResponse));
  }

  // Accept/decline a response
  static async updateResponseStatus(
    responseId: string,
    status: ServiceResponse['status']
  ): Promise<void> {
    const docRef = doc(db, 'serviceResponses', responseId);
    await updateDoc(docRef, {
      status
    });

    // If accepting, update service request status to in_progress
    if (status === 'accepted') {
      const responseDoc = await getDoc(docRef);
      if (responseDoc.exists()) {
        const serviceRequestId = responseDoc.data().serviceRequestId;
        await this.updateServiceRequestStatus(serviceRequestId, 'in_progress');
      }
    }
  }

  // Search service requests
  static async searchServiceRequests(
    searchTerm: string,
    filters?: {
      category?: string;
      location?: { city: string; state: string };
      budgetRange?: { min: number; max: number };
    }
  ): Promise<ServiceRequest[]> {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation - consider using Algolia for production
    let q = query(
      collection(db, 'serviceRequests'),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    let requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
    } as ServiceRequest));

    // Client-side filtering (consider server-side for production)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      requests = requests.filter(request => 
        request.title.toLowerCase().includes(term) ||
        request.description.toLowerCase().includes(term)
      );
    }

    if (filters) {
      if (filters.category && filters.category !== 'all') {
        requests = requests.filter(request => request.category === filters.category);
      }

      if (filters.location) {
        requests = requests.filter(request => 
          request.location.city.toLowerCase() === filters.location!.city.toLowerCase() &&
          request.location.state.toLowerCase() === filters.location!.state.toLowerCase()
        );
      }

      if (filters.budgetRange) {
        requests = requests.filter(request => {
          if (!request.budget) return false;
          return request.budget.min >= filters.budgetRange!.min && 
                 request.budget.max <= filters.budgetRange!.max;
        });
      }
    }

    return requests;
  }

  // Get real-time updates for service requests
  static subscribeToServiceRequests(
    userId: string,
    callback: (requests: ServiceRequest[]) => void
  ) {
    const q = query(
      collection(db, 'serviceRequests'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
      } as ServiceRequest));
      
      callback(requests);
    });
  }
}
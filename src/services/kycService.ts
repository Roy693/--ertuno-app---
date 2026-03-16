import { db, storage } from './firebase';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { User } from '../types';

// KYC Data Types
export interface ProviderKycData {
  uid: string;
  type: 'private' | 'business';
  verification_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  
  // Common fields
  profile_image?: string;
  cover_image?: string;
  services_offered: string[];
  description: string;
  work_photos: string[];
  work_area: {
    regions: string[];
    radius_km: number;
  };
  
  // Private provider fields
  identity_front?: string;
  identity_back?: string;
  selfie_verification?: string;
  full_name?: string;
  experience_years?: number;
  qualifications: {
    text: string;
    documents: string[];
  };
  
  // Business provider fields  
  representative_identity?: string;
  business_document?: string;
  vat_number?: string;
  business_name?: string;
  legal_address?: string;
  business_certifications?: string[];
  
  // Legal declaration
  legal_declaration_accepted: boolean;
  legal_declaration_timestamp: string;
}

export interface RequesterKycData {
  uid: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  
  identity_front: string;
  identity_back: string;
  selfie_verification: string;
  profile_image: string;
  full_name: string;
  description: string;
  
  legal_declaration_accepted: boolean;
  legal_declaration_timestamp: string;
}

export class KycService {
  // Provider KYC Methods
  static async saveProviderKyc(data: ProviderKycData): Promise<void> {
    const docRef = doc(db, 'providers_pending_verification', data.uid);
    await setDoc(docRef, {
      ...data,
      updated_at: new Date().toISOString()
    });
  }

  static async getProviderKyc(uid: string): Promise<ProviderKycData | null> {
    const docRef = doc(db, 'providers_pending_verification', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as ProviderKycData : null;
  }

  static async updateProviderKyc(uid: string, updates: Partial<ProviderKycData>): Promise<void> {
    const docRef = doc(db, 'providers_pending_verification', uid);
    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString()
    });
  }

  // Requester KYC Methods
  static async saveRequesterKyc(data: RequesterKycData): Promise<void> {
    const docRef = doc(db, 'requesters_pending_verification', data.uid);
    await setDoc(docRef, {
      ...data,
      updated_at: new Date().toISOString()
    });
  }

  static async getRequesterKyc(uid: string): Promise<RequesterKycData | null> {
    const docRef = doc(db, 'requesters_pending_verification', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as RequesterKycData : null;
  }

  static async updateRequesterKyc(uid: string, updates: Partial<RequesterKycData>): Promise<void> {
    const docRef = doc(db, 'requesters_pending_verification', uid);
    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString()
    });
  }

  // File Upload Methods
  static async uploadFile(
    file: File, 
    path: string, 
    userId: string
  ): Promise<string> {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `kyc/${userId}/${path}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  static async uploadMultipleFiles(
    files: File[], 
    path: string, 
    userId: string
  ): Promise<string[]> {
    const uploadPromises = files.map(file => 
      this.uploadFile(file, path, userId)
    );
    return await Promise.all(uploadPromises);
  }

  static async deleteFile(url: string): Promise<void> {
    try {
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Continue even if delete fails
    }
  }

  // Public Profile Methods
  static async getPublicProviderProfile(uid: string): Promise<ProviderKycData | null> {
    // First check approved providers
    const approvedRef = doc(db, 'providers_approved', uid);
    const approvedSnap = await getDoc(approvedRef);
    
    if (approvedSnap.exists()) {
      return approvedSnap.data() as ProviderKycData;
    }

    // If not found in approved, check if pending but visible
    const pendingData = await this.getProviderKyc(uid);
    if (pendingData && pendingData.verification_status === 'approved') {
      return pendingData;
    }

    return null;
  }

  static async getPublicRequesterProfile(uid: string): Promise<RequesterKycData | null> {
    const approvedRef = doc(db, 'requesters_approved', uid);
    const approvedSnap = await getDoc(approvedRef);
    
    if (approvedSnap.exists()) {
      return approvedSnap.data() as RequesterKycData;
    }

    const pendingData = await this.getRequesterKyc(uid);
    if (pendingData && pendingData.verification_status === 'approved') {
      return pendingData;
    }

    return null;
  }

  // Search Methods
  static async searchProviders(
    services?: string[], 
    region?: string,
    limit: number = 20
  ): Promise<ProviderKycData[]> {
    let q = query(
      collection(db, 'providers_approved'),
      where('verification_status', '==', 'approved')
    );

    if (services && services.length > 0) {
      q = query(q, where('services_offered', 'array-contains-any', services));
    }

    if (region) {
      q = query(q, where('work_area.regions', 'array-contains', region));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as ProviderKycData);
  }

  // Validation Methods
  static validateProviderKyc(data: Partial<ProviderKycData>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.type) errors.push('Account type is required');
    if (!data.services_offered || data.services_offered.length === 0) {
      errors.push('At least one service must be selected');
    }
    if (!data.description?.trim()) errors.push('Description is required');
    if (!data.legal_declaration_accepted) {
      errors.push('Legal declaration must be accepted');
    }

    // Type-specific validation
    if (data.type === 'private') {
      if (!data.full_name?.trim()) errors.push('Full name is required');
      if (!data.identity_front) errors.push('Identity document front is required');
      if (!data.identity_back) errors.push('Identity document back is required');
      if (!data.selfie_verification) errors.push('Selfie verification is required');
      if (!data.experience_years || data.experience_years < 0) {
        errors.push('Valid experience years required');
      }
    } else if (data.type === 'business') {
      if (!data.business_name?.trim()) errors.push('Business name is required');
      if (!data.vat_number?.trim()) errors.push('VAT number is required');
      if (!data.legal_address?.trim()) errors.push('Legal address is required');
      if (!data.representative_identity) {
        errors.push('Representative identity document is required');
      }
      if (!data.business_document) {
        errors.push('Business document is required');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateRequesterKyc(data: Partial<RequesterKycData>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.full_name?.trim()) errors.push('Full name is required');
    if (!data.description?.trim()) errors.push('Description is required');
    if (!data.identity_front) errors.push('Identity document front is required');
    if (!data.identity_back) errors.push('Identity document back is required');
    if (!data.selfie_verification) errors.push('Selfie verification is required');
    if (!data.legal_declaration_accepted) {
      errors.push('Legal declaration must be accepted');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
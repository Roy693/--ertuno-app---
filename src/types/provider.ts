export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
}

export interface VerificationStatus {
  identityVerified: boolean;
  licenseVerified: boolean;
  insuranceVerified: boolean;
  backgroundCheckPassed: boolean;
}

export interface Availability {
  schedule?: {
    [key: string]: {
      isAvailable: boolean;
      start?: string;
      end?: string;
    };
  };
}

export interface ServiceProvider {
  id: string;
  businessName: string;
  serviceCategories?: string[];
  location?: Location;
  hourlyRate: number;
  averageRating?: number;
  totalReviews: number;
  isOnline?: boolean;
  profilePhoto?: string;
  description?: string;
  verificationStatus?: VerificationStatus;
  responseTimeMinutes?: number;
  completedJobs?: number;
  yearsInBusiness?: number;
  portfolioImages?: string[];
  distance?: number;
  contactInfo?: ContactInfo;
  availability?: Availability;
}

export interface ServiceRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  serviceCategory: string;
  location: Location;
  budget: {
    min: number;
    max: number;
  };
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  preferredDate: string;
  status: 'pending' | 'matched' | 'booked' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ServiceOffer {
  id: string;
  providerId: string;
  requestId: string;
  price: number;
  message: string;
  estimatedDuration: string;
  availableDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  profilePhoto?: string;
  location?: Location;
  preferences?: {
    maxDistance: number;
    budgetRange: {
      min: number;
      max: number;
    };
    preferredProviders: string[];
  };
  createdAt: string;
}

export interface AIMatchResult {
  score: number;
  factors: {
    distance: number;
    rating: number;
    price: number;
    availability: number;
    experience: number;
  };
  reasoning: string;
}
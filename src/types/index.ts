// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  // User role system - Production role hierarchy
  role: 'job_poster' | 'service_provider' | 'university' | 'student';
  // Professional provider fields
  isProfessional?: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  businessName?: string;
  businessDescription?: string;
  serviceCategories?: string[];
  rating?: number;
  reviewCount?: number;
  
  // Academic/Research fields
  isAcademic?: boolean;
  institution?: string;
  department?: string;
  position?: string; // Professor, Researcher, PhD Student, etc.
  researchAreas?: string[];
  orcid?: string; // ORCID ID for researcher identification
  academicVerification?: 'pending' | 'verified' | 'rejected';
  location?: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

// Auth Types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  createdAt: string;
  userId: string;
}

// Service Request Types (Professional Services Marketplace)
export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: string; // "ASAP", "Within a week", etc.
  location: {
    city: string;
    state: string;
    postcode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images?: string[];
  userId: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  responseCount?: number;
}

// Professional Response to Service Request
export interface ServiceResponse {
  id: string;
  serviceRequestId: string;
  professionalId: string;
  message: string;
  quote?: {
    amount: number;
    currency: string;
    breakdown?: string;
  };
  availability: string;
  estimatedDuration?: string;
  portfolio?: {
    images: string[];
    description: string;
  };
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'withdrawn';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon?: string;
}

// Chat Types (Live Messaging System)
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'location' | 'quote';
  timestamp: string;
  readBy: string[];
  replyTo?: string; // Reference to another message ID
  metadata?: {
    quoteId?: string; // For service quotes
    fileName?: string; // For file messages
    fileSize?: number;
    imageUrl?: string;
    location?: {
      lat: number;
      lng: number;
      address?: string;
    };
  };
}

export interface Conversation {
  id: string;
  participants: string[];
  type: 'direct' | 'service_request'; // Direct chat or service-related
  serviceRequestId?: string; // If related to a service request
  lastMessage?: ChatMessage;
  updatedAt: string;
  createdAt: string;
  isActive: boolean;
  metadata?: {
    title?: string; // For service conversations
    category?: string;
  };
}

// Review and Rating Types
export interface Review {
  id: string;
  serviceRequestId: string;
  reviewerId: string; // User who posted the request
  professionalId: string; // Professional being reviewed
  rating: number; // 1-5 stars
  comment?: string;
  images?: string[];
  createdAt: string;
  response?: {
    comment: string;
    createdAt: string;
  };
}

// Service Categories (Expanded)
export const SERVICE_CATEGORIES = {
  HOME_IMPROVEMENT: {
    id: 'home_improvement',
    name: 'Home Improvement',
    subcategories: [
      'Plumbing',
      'Electrical',
      'Painting & Decorating',
      'Carpentry',
      'Roofing',
      'Flooring',
      'Kitchen Renovation',
      'Bathroom Renovation',
      'Garden & Landscaping',
      'Cleaning Services'
    ]
  },
  PROFESSIONAL_SERVICES: {
    id: 'professional_services',
    name: 'Professional Services',
    subcategories: [
      'Accounting',
      'Legal Services',
      'Web Development',
      'Graphic Design',
      'Marketing',
      'Photography',
      'Writing & Translation',
      'Business Consulting',
      'IT Support',
      'Real Estate'
    ]
  },
  PERSONAL_SERVICES: {
    id: 'personal_services',
    name: 'Personal Services',
    subcategories: [
      'Personal Training',
      'Tutoring',
      'Pet Care',
      'Childcare',
      'Elder Care',
      'Beauty & Wellness',
      'Event Planning',
      'Transportation',
      'Personal Shopping',
      'Life Coaching'
    ]
  },
  AUTOMOTIVE: {
    id: 'automotive',
    name: 'Automotive',
    subcategories: [
      'Car Repair',
      'Car Cleaning',
      'Roadside Assistance',
      'Vehicle Inspection',
      'Auto Insurance',
      'Car Rental',
      'Motorcycle Services',
      'Truck Services'
    ]
  }
} as const;

export type ServiceCategoryId = keyof typeof SERVICE_CATEGORIES;
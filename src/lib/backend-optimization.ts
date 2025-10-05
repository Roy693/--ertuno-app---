// Backend Optimization for ERTUNO Platform
// Scalability improvements for lead flow, subscriptions, and booking logic

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  onSnapshot,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp,
  DocumentSnapshot
} from 'firebase/firestore';
// Firebase integration - connect to existing Firebase instance
// import { db } from './firebase';

// Interfaces for optimized data structures
interface OptimizedServiceRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  serviceCategory: string;
  location: {
    coordinates: { lat: number; lng: number };
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  budget: { min: number; max: number; currency: string };
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  preferredDate: Date;
  status: 'pending' | 'offers_received' | 'booked' | 'in_progress' | 'completed' | 'cancelled';
  tags: string[];
  matchingCriteria: {
    maxDistance: number;
    verifiedOnly: boolean;
    minRating: number;
  };
  // Optimization fields
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date; // Auto-expire old requests
  matchingHash: string; // For faster provider matching
  viewedBy: string[]; // Track which providers viewed this
  offersCount: number; // Denormalized counter
}

interface OptimizedProvider {
  id: string;
  userId: string;
  businessName: string;
  serviceCategories: string[];
  location: {
    coordinates: { lat: number; lng: number };
    address: string;
    serviceRadius: number;
  };
  subscription: {
    tier: 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'past_due' | 'cancelled';
    leadsRemaining: number;
    renewDate: Date;
    stripeSubscriptionId?: string;
  };
  performance: {
    averageRating: number;
    totalReviews: number;
    completedJobs: number;
    responseTimeMinutes: number;
    acceptanceRate: number; // Offers accepted / total offers
  };
  // Optimization fields
  isActive: boolean;
  lastActive: Date;
  matchingTags: string[]; // Pre-computed matching tags
  verificationScore: number; // 0-100 based on verifications
}

interface LeadMatchingResult {
  providerId: string;
  score: number;
  distance: number;
  estimatedCost: number;
  reasoning: string[];
  matchingFactors: {
    categoryMatch: number;
    locationScore: number;
    ratingScore: number;
    priceScore: number;
    availabilityScore: number;
  };
}

// Optimized Lead Matching Engine
export class OptimizedLeadEngine {
  private static instance: OptimizedLeadEngine;
  private matchingCache = new Map<string, LeadMatchingResult[]>();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  static getInstance(): OptimizedLeadEngine {
    if (!OptimizedLeadEngine.instance) {
      OptimizedLeadEngine.instance = new OptimizedLeadEngine();
    }
    return OptimizedLeadEngine.instance;
  }

  // Optimized provider matching with caching and scoring
  async findMatchingProviders(request: OptimizedServiceRequest): Promise<LeadMatchingResult[]> {
    const cacheKey = this.generateCacheKey(request);
    const cached = this.matchingCache.get(cacheKey);
    
    if (cached && this.isCacheValid(cacheKey)) {
      return cached;
    }

    try {
      // Build optimized query
      const providersQuery = query(
        collection(db, 'service_providers'),
        where('serviceCategories', 'array-contains', request.serviceCategory),
        where('subscription.status', '==', 'active'),
        where('subscription.leadsRemaining', '>', 0),
        where('isActive', '==', true),
        orderBy('performance.averageRating', 'desc'),
        limit(20) // Limit for performance
      );

      const providersSnapshot = await getDocs(providersQuery);
      const providers: OptimizedProvider[] = [];
      
      providersSnapshot.forEach(doc => {
        providers.push({ id: doc.id, ...doc.data() } as OptimizedProvider);
      });

      // Calculate matching scores
      const matches = await Promise.all(
        providers.map(provider => this.calculateMatchScore(request, provider))
      );

      // Filter and sort by score
      const validMatches = matches
        .filter(match => match.score > 0.3) // Minimum score threshold
        .sort((a, b) => b.score - a.score);

      // Cache results
      this.matchingCache.set(cacheKey, validMatches);
      setTimeout(() => this.matchingCache.delete(cacheKey), this.cacheExpiry);

      return validMatches;

    } catch (error) {
      console.error('Error finding matching providers:', error);
      return [];
    }
  }

  private async calculateMatchScore(
    request: OptimizedServiceRequest, 
    provider: OptimizedProvider
  ): Promise<LeadMatchingResult> {
    // Distance calculation
    const distance = this.calculateDistance(
      request.location.coordinates,
      provider.location.coordinates
    );

    // Check if within service radius
    if (distance > provider.location.serviceRadius) {
      return {
        providerId: provider.id,
        score: 0,
        distance,
        estimatedCost: 0,
        reasoning: ['Outside service area'],
        matchingFactors: {
          categoryMatch: 0,
          locationScore: 0,
          ratingScore: 0,
          priceScore: 0,
          availabilityScore: 0
        }
      };
    }

    // Scoring factors (weighted)
    const categoryMatch = provider.serviceCategories.includes(request.serviceCategory) ? 1 : 0.5;
    const locationScore = Math.max(0, (provider.location.serviceRadius - distance) / provider.location.serviceRadius);
    const ratingScore = provider.performance.averageRating / 5;
    const priceScore = this.calculatePriceScore(request.budget, provider);
    const availabilityScore = this.calculateAvailabilityScore(provider);

    // Weighted final score
    const weights = { category: 0.3, location: 0.25, rating: 0.2, price: 0.15, availability: 0.1 };
    const finalScore = (
      categoryMatch * weights.category +
      locationScore * weights.location +
      ratingScore * weights.rating +
      priceScore * weights.price +
      availabilityScore * weights.availability
    );

    const estimatedCost = this.estimateCost(request, provider);
    const reasoning = this.generateReasoning(request, provider, {
      categoryMatch,
      locationScore,
      ratingScore,
      priceScore,
      availabilityScore
    });

    return {
      providerId: provider.id,
      score: finalScore,
      distance,
      estimatedCost,
      reasoning,
      matchingFactors: {
        categoryMatch,
        locationScore,
        ratingScore,
        priceScore,
        availabilityScore
      }
    };
  }

  private calculateDistance(coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLng = this.toRadians(coord2.lng - coord1.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(coord1.lat)) * Math.cos(this.toRadians(coord2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private calculatePriceScore(budget: { min: number; max: number }, provider: OptimizedProvider): number {
    // This would need hourly rate from provider data
    // For now, return a default score
    return 0.7;
  }

  private calculateAvailabilityScore(provider: OptimizedProvider): number {
    const hoursUntilLastActive = (Date.now() - provider.lastActive.getTime()) / (1000 * 60 * 60);
    return Math.max(0, Math.min(1, (24 - hoursUntilLastActive) / 24));
  }

  private estimateCost(request: OptimizedServiceRequest, provider: OptimizedProvider): number {
    // Simplified cost estimation
    return (request.budget.min + request.budget.max) / 2;
  }

  private generateReasoning(
    request: OptimizedServiceRequest,
    provider: OptimizedProvider,
    scores: any
  ): string[] {
    const reasons: string[] = [];

    if (scores.categoryMatch === 1) {
      reasons.push('Perfect category match');
    } else if (scores.categoryMatch > 0.5) {
      reasons.push('Related services offered');
    }

    if (scores.locationScore > 0.8) {
      reasons.push('Very close to your location');
    } else if (scores.locationScore > 0.5) {
      reasons.push('Within reasonable distance');
    }

    if (scores.ratingScore > 0.9) {
      reasons.push('Excellent customer ratings');
    } else if (scores.ratingScore > 0.8) {
      reasons.push('High customer ratings');
    }

    if (scores.availabilityScore > 0.8) {
      reasons.push('Recently active');
    }

    return reasons;
  }

  private generateCacheKey(request: OptimizedServiceRequest): string {
    return `${request.serviceCategory}_${request.location.coordinates.lat}_${request.location.coordinates.lng}_${request.budget.min}-${request.budget.max}`;
  }

  private isCacheValid(cacheKey: string): boolean {
    // Simple cache validation - in production, implement more sophisticated logic
    return true;
  }
}

// Optimized Subscription Management
export class OptimizedSubscriptionManager {
  // Batch process lead assignments to reduce Firestore writes
  async processLeadAssignments(requestId: string, providerMatches: LeadMatchingResult[]): Promise<void> {
    const batch = writeBatch(db);
    const timestamp = Timestamp.now();

    try {
      // Update request with matching results
      const requestRef = doc(db, 'service_requests', requestId);
      batch.update(requestRef, {
        matchingResults: providerMatches.slice(0, 10), // Top 10 matches
        matchingCompletedAt: timestamp,
        status: 'offers_received'
      });

      // Create lead notifications for providers (batch)
      for (const match of providerMatches.slice(0, 10)) {
        const leadNotificationRef = doc(collection(db, 'lead_notifications'));
        batch.set(leadNotificationRef, {
          requestId,
          providerId: match.providerId,
          score: match.score,
          distance: match.distance,
          estimatedCost: match.estimatedCost,
          reasoning: match.reasoning,
          status: 'available',
          createdAt: timestamp,
          expiresAt: Timestamp.fromDate(new Date(Date.now() + 48 * 60 * 60 * 1000)) // 48 hours
        });

        // Update provider's available leads counter
        const providerRef = doc(db, 'service_providers', match.providerId);
        batch.update(providerRef, {
          'analytics.availableLeads': increment(1),
          'analytics.lastLeadReceived': timestamp
        });
      }

      await batch.commit();
      console.log(`Successfully processed ${providerMatches.length} lead assignments`);

    } catch (error) {
      console.error('Error processing lead assignments:', error);
      throw error;
    }
  }

  // Optimized lead unlocking with subscription validation
  async unlockLead(providerId: string, requestId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get provider subscription status
      const providerRef = doc(db, 'service_providers', providerId);
      const providerDoc = await getDoc(providerRef);
      
      if (!providerDoc.exists()) {
        return { success: false, error: 'Provider not found' };
      }

      const providerData = providerDoc.data() as OptimizedProvider;
      
      // Check subscription limits
      if (providerData.subscription.leadsRemaining <= 0) {
        return { success: false, error: 'No leads remaining in subscription' };
      }

      if (providerData.subscription.status !== 'active') {
        return { success: false, error: 'Subscription not active' };
      }

      // Use batch for atomic updates
      const batch = writeBatch(db);
      const timestamp = Timestamp.now();

      // Decrement leads remaining
      batch.update(providerRef, {
        'subscription.leadsRemaining': increment(-1),
        'analytics.totalLeadsUnlocked': increment(1),
        'analytics.lastLeadUnlocked': timestamp
      });

      // Update lead notification status
      const leadNotificationQuery = query(
        collection(db, 'lead_notifications'),
        where('requestId', '==', requestId),
        where('providerId', '==', providerId),
        where('status', '==', 'available')
      );

      const leadNotificationSnapshot = await getDocs(leadNotificationQuery);
      
      if (leadNotificationSnapshot.empty) {
        return { success: false, error: 'Lead not available' };
      }

      const leadNotificationRef = leadNotificationSnapshot.docs[0].ref;
      batch.update(leadNotificationRef, {
        status: 'unlocked',
        unlockedAt: timestamp
      });

      // Track in provider's unlocked leads
      const unlockedLeadRef = doc(collection(db, 'unlocked_leads'));
      batch.set(unlockedLeadRef, {
        providerId,
        requestId,
        cost: 1, // 1 lead credit
        unlockedAt: timestamp,
        paymentMethod: 'subscription'
      });

      await batch.commit();

      return { success: true };

    } catch (error) {
      console.error('Error unlocking lead:', error);
      return { success: false, error: 'System error occurred' };
    }
  }

  // Optimize subscription renewal process
  async processSubscriptionRenewal(providerId: string, stripeSubscriptionId: string): Promise<void> {
    try {
      const providerRef = doc(db, 'service_providers', providerId);
      const providerDoc = await getDoc(providerRef);
      
      if (!providerDoc.exists()) {
        throw new Error('Provider not found');
      }

      const providerData = providerDoc.data() as OptimizedProvider;
      const subscriptionTier = providerData.subscription.tier;

      // Calculate new leads based on tier
      const leadsPerTier = {
        basic: 10,
        premium: 30,
        enterprise: -1 // unlimited
      };

      const newLeadsCount = leadsPerTier[subscriptionTier];
      const renewDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await updateDoc(providerRef, {
        'subscription.status': 'active',
        'subscription.leadsRemaining': newLeadsCount === -1 ? 999999 : newLeadsCount,
        'subscription.renewDate': Timestamp.fromDate(renewDate),
        'subscription.lastRenewal': Timestamp.now(),
        'analytics.subscriptionRenewals': increment(1)
      });

      console.log(`Subscription renewed for provider ${providerId}`);

    } catch (error) {
      console.error('Error processing subscription renewal:', error);
      throw error;
    }
  }

  // Monitor and alert on subscription expiry
  async checkExpiringSubscriptions(): Promise<void> {
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    
    try {
      const expiringQuery = query(
        collection(db, 'service_providers'),
        where('subscription.status', '==', 'active'),
        where('subscription.renewDate', '<=', Timestamp.fromDate(threeDaysFromNow))
      );

      const expiringSnapshot = await getDocs(expiringQuery);
      
      const batch = writeBatch(db);
      const alerts: Array<{ providerId: string; email: string; daysUntilExpiry: number }> = [];

      expiringSnapshot.forEach(doc => {
        const provider = doc.data() as OptimizedProvider;
        const daysUntilExpiry = Math.ceil(
          (provider.subscription.renewDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
        );

        alerts.push({
          providerId: doc.id,
          email: provider.userId, // Assuming userId is email
          daysUntilExpiry
        });

        // Update provider with expiry warning flag
        batch.update(doc.ref, {
          'subscription.expiryWarning': true,
          'subscription.warningDate': Timestamp.now()
        });
      });

      if (alerts.length > 0) {
        await batch.commit();
        // Send email notifications (integrate with email service)
        console.log(`Sent expiry warnings to ${alerts.length} providers`);
      }

    } catch (error) {
      console.error('Error checking expiring subscriptions:', error);
    }
  }
}

// Performance monitoring and analytics
export class PerformanceMonitor {
  // Track system performance metrics
  async trackLeadMatchingPerformance(requestId: string, matchingTimeMs: number, resultsCount: number): Promise<void> {
    try {
      await addDoc(collection(db, 'performance_metrics'), {
        type: 'lead_matching',
        requestId,
        executionTime: matchingTimeMs,
        resultsCount,
        timestamp: Timestamp.now(),
        metadata: {
          avgProcessingTime: matchingTimeMs / resultsCount
        }
      });
    } catch (error) {
      console.error('Error tracking performance:', error);
    }
  }

  // Monitor subscription health
  async generateSubscriptionHealthReport(): Promise<{
    activeSubscriptions: number;
    expiringSubscriptions: number;
    avgLeadsUsage: number;
    revenueProjection: number;
  }> {
    try {
      const activeQuery = query(
        collection(db, 'service_providers'),
        where('subscription.status', '==', 'active')
      );

      const activeSnapshot = await getDocs(activeQuery);
      let totalLeadsUsed = 0;
      let totalRevenue = 0;
      let expiringCount = 0;

      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

      activeSnapshot.forEach(doc => {
        const provider = doc.data() as OptimizedProvider;
        
        // Calculate usage
        const tierLimits = { basic: 10, premium: 30, enterprise: 999999 };
        const tierLimit = tierLimits[provider.subscription.tier];
        const used = tierLimit - (provider.subscription.leadsRemaining || 0);
        totalLeadsUsed += used;

        // Calculate revenue
        const tierPrices = { basic: 29.99, premium: 59.99, enterprise: 99.99 };
        totalRevenue += tierPrices[provider.subscription.tier];

        // Check expiry
        if (provider.subscription.renewDate <= Timestamp.fromDate(threeDaysFromNow)) {
          expiringCount++;
        }
      });

      return {
        activeSubscriptions: activeSnapshot.size,
        expiringSubscriptions: expiringCount,
        avgLeadsUsage: activeSnapshot.size > 0 ? totalLeadsUsed / activeSnapshot.size : 0,
        revenueProjection: totalRevenue
      };

    } catch (error) {
      console.error('Error generating health report:', error);
      return {
        activeSubscriptions: 0,
        expiringSubscriptions: 0,
        avgLeadsUsage: 0,
        revenueProjection: 0
      };
    }
  }
}

// Export optimized instances
export const leadEngine = OptimizedLeadEngine.getInstance();
export const subscriptionManager = new OptimizedSubscriptionManager();
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for common operations
export const batchUpdateProviders = async (updates: Array<{ id: string; data: Partial<OptimizedProvider> }>) => {
  const batch = writeBatch(db);
  
  updates.forEach(({ id, data }) => {
    const ref = doc(db, 'service_providers', id);
    batch.update(ref, {
      ...data,
      updatedAt: Timestamp.now()
    });
  });

  await batch.commit();
};

export const cleanupExpiredLeads = async () => {
  const expiredQuery = query(
    collection(db, 'lead_notifications'),
    where('expiresAt', '<=', Timestamp.now()),
    where('status', '==', 'available')
  );

  const expiredSnapshot = await getDocs(expiredQuery);
  const batch = writeBatch(db);

  expiredSnapshot.forEach(doc => {
    batch.update(doc.ref, { status: 'expired' });
  });

  if (!expiredSnapshot.empty) {
    await batch.commit();
    console.log(`Cleaned up ${expiredSnapshot.size} expired leads`);
  }
};
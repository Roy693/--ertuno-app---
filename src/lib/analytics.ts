// Marketing Analytics & Tracking System
// GDPR-compliant with user consent management

interface TrackingEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface UserBehavior {
  pageViews: Array<{
    path: string;
    timestamp: Date;
    duration?: number;
    referrer?: string;
  }>;
  interactions: Array<{
    type: 'click' | 'scroll' | 'form_submit' | 'search' | 'booking_attempt';
    element?: string;
    data?: any;
    timestamp: Date;
  }>;
  leadAttribution: {
    source?: string;
    medium?: string;
    campaign?: string;
    referrer?: string;
    landingPage?: string;
    firstVisit: Date;
  };
}

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

class ERTUNOAnalytics {
  private sessionId: string;
  private userId?: string;
  private cookiePreferences: CookiePreferences;
  private behaviorData: UserBehavior;
  private queue: TrackingEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.cookiePreferences = this.loadCookiePreferences();
    this.behaviorData = this.initializeBehaviorData();
    
    // Process queued events on initialization
    this.processQueue();
    
    // Set up automatic page view tracking
    if (typeof window !== 'undefined') {
      this.setupPageTracking();
      this.setupInteractionTracking();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadCookiePreferences(): CookiePreferences {
    if (typeof window === 'undefined') {
      return { necessary: true, analytics: false, marketing: false, personalization: false };
    }

    try {
      const saved = localStorage.getItem('ertuno_cookie_preferences');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading cookie preferences:', error);
    }

    return { necessary: true, analytics: false, marketing: false, personalization: false };
  }

  private initializeBehaviorData(): UserBehavior {
    const stored = this.getStoredBehaviorData();
    if (stored) return stored;

    return {
      pageViews: [],
      interactions: [],
      leadAttribution: {
        firstVisit: new Date()
      }
    };
  }

  private getStoredBehaviorData(): UserBehavior | null {
    if (!this.cookiePreferences.analytics) return null;

    try {
      const stored = localStorage.getItem('ertuno_behavior_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.pageViews = parsed.pageViews.map((pv: any) => ({
          ...pv,
          timestamp: new Date(pv.timestamp)
        }));
        parsed.interactions = parsed.interactions.map((int: any) => ({
          ...int,
          timestamp: new Date(int.timestamp)
        }));
        parsed.leadAttribution.firstVisit = new Date(parsed.leadAttribution.firstVisit);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading behavior data:', error);
    }

    return null;
  }

  private saveBehaviorData(): void {
    if (!this.cookiePreferences.analytics) return;

    try {
      localStorage.setItem('ertuno_behavior_data', JSON.stringify(this.behaviorData));
    } catch (error) {
      console.error('Error saving behavior data:', error);
    }
  }

  private setupPageTracking(): void {
    // Track initial page view
    this.trackPageView();

    // Track navigation changes (for SPAs)
    let currentPath = window.location.pathname;
    
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.trackPageView();
      }
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.flushQueue();
    });
  }

  private setupInteractionTracking(): void {
    if (!this.cookiePreferences.analytics) return;

    // Track clicks on important elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        this.trackInteraction('click', 'button', {
          text: button?.textContent?.trim(),
          className: button?.className
        });
      }

      // Track link clicks
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target : target.closest('a');
        this.trackInteraction('click', 'link', {
          href: (link as HTMLAnchorElement)?.href,
          text: link?.textContent?.trim()
        });
      }

      // Track CTA clicks
      if (target.closest('[data-analytics="cta"]')) {
        this.trackInteraction('click', 'cta', {
          cta: target.closest('[data-analytics="cta"]')?.getAttribute('data-cta-name')
        });
      }
    });

    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        this.trackInteraction('scroll', 'scroll_depth', { percent: scrollPercent });
      }
    });
  }

  // Public methods
  updateCookiePreferences(preferences: CookiePreferences): void {
    this.cookiePreferences = preferences;
    
    // Clear data if analytics disabled
    if (!preferences.analytics) {
      localStorage.removeItem('ertuno_behavior_data');
      this.behaviorData = this.initializeBehaviorData();
    }
    
    // Clear marketing data if disabled
    if (!preferences.marketing) {
      localStorage.removeItem('ertuno_marketing_data');
    }
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  trackEvent(category: string, action: string, label?: string, value?: number, metadata?: Record<string, any>): void {
    if (!this.cookiePreferences.analytics) return;

    const event: TrackingEvent = {
      category,
      action,
      label,
      value,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date(),
      metadata
    };

    this.queue.push(event);
    this.processQueue();
  }

  trackPageView(path?: string): void {
    if (!this.cookiePreferences.analytics) return;

    const currentPath = path || window.location.pathname;
    const referrer = document.referrer;

    // Update lead attribution on first visit
    if (this.behaviorData.leadAttribution && !this.behaviorData.leadAttribution.landingPage) {
      const urlParams = new URLSearchParams(window.location.search);
      this.behaviorData.leadAttribution = {
        ...this.behaviorData.leadAttribution,
        source: urlParams.get('utm_source') || undefined,
        medium: urlParams.get('utm_medium') || undefined,
        campaign: urlParams.get('utm_campaign') || undefined,
        referrer: referrer || undefined,
        landingPage: currentPath
      };
    }

    this.behaviorData.pageViews.push({
      path: currentPath,
      timestamp: new Date(),
      referrer
    });

    this.saveBehaviorData();
    this.trackEvent('navigation', 'page_view', currentPath);
  }

  trackInteraction(type: UserBehavior['interactions'][0]['type'], element?: string, data?: any): void {
    if (!this.cookiePreferences.analytics) return;

    this.behaviorData.interactions.push({
      type,
      element,
      data,
      timestamp: new Date()
    });

    this.saveBehaviorData();
    this.trackEvent('engagement', type, element, undefined, data);
  }

  // Lead attribution and conversion tracking
  trackLeadGeneration(leadType: string, metadata?: Record<string, any>): void {
    if (!this.cookiePreferences.marketing) return;

    this.trackEvent('conversion', 'lead_generated', leadType, undefined, {
      ...metadata,
      attribution: this.behaviorData.leadAttribution
    });
  }

  trackBookingAttempt(serviceCategory: string, providerId?: string): void {
    this.trackInteraction('booking_attempt', 'booking_form', {
      serviceCategory,
      providerId
    });

    if (this.cookiePreferences.marketing) {
      this.trackEvent('conversion', 'booking_attempt', serviceCategory, undefined, {
        providerId,
        attribution: this.behaviorData.leadAttribution
      });
    }
  }

  trackBookingComplete(bookingId: string, amount: number, serviceCategory: string): void {
    if (!this.cookiePreferences.marketing) return;

    this.trackEvent('conversion', 'booking_complete', serviceCategory, amount, {
      bookingId,
      attribution: this.behaviorData.leadAttribution
    });
  }

  trackProviderSignup(providerId: string): void {
    if (!this.cookiePreferences.marketing) return;

    this.trackEvent('conversion', 'provider_signup', 'provider_registration', undefined, {
      providerId,
      attribution: this.behaviorData.leadAttribution
    });
  }

  // Search and discovery
  trackSearch(query: string, category?: string, resultsCount?: number): void {
    this.trackInteraction('search', 'search_form', {
      query: query.substring(0, 50), // Limit query length for privacy
      category,
      resultsCount
    });
  }

  // Marketing attribution
  getLeadAttribution(): UserBehavior['leadAttribution'] {
    return this.behaviorData.leadAttribution;
  }

  getBehaviorSummary(): {
    pageViews: number;
    interactions: number;
    sessionDuration: number;
    topPages: Array<{ path: string; views: number }>;
  } {
    const pageViews = this.behaviorData.pageViews;
    const interactions = this.behaviorData.interactions;
    
    const sessionStart = pageViews[0]?.timestamp || new Date();
    const sessionDuration = Date.now() - sessionStart.getTime();
    
    const pageCounts = pageViews.reduce((acc, pv) => {
      acc[pv.path] = (acc[pv.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topPages = Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([path, views]) => ({ path, views }));

    return {
      pageViews: pageViews.length,
      interactions: interactions.length,
      sessionDuration,
      topPages
    };
  }

  private processQueue(): void {
    if (this.queue.length === 0) return;

    // In production, send to analytics service
    // For now, just log to console in development
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.log('Analytics Events:', this.queue);
    }

    // Send to analytics services based on preferences
    if (this.cookiePreferences.analytics) {
      this.sendToAnalyticsService(this.queue);
    }

    if (this.cookiePreferences.marketing) {
      this.sendToMarketingService(this.queue);
    }

    this.queue = [];
  }

  private sendToAnalyticsService(events: TrackingEvent[]): void {
    // Integrate with Google Analytics, Mixpanel, etc.
    // Example: gtag('event', event.action, { ... })
  }

  private sendToMarketingService(events: TrackingEvent[]): void {
    // Integrate with Facebook Pixel, Google Ads, etc.
    // Example: fbq('track', 'Lead', { ... })
  }

  private flushQueue(): void {
    if (this.queue.length > 0) {
      this.processQueue();
    }
  }

  // Clean up old data (GDPR compliance)
  cleanupOldData(daysToKeep: number = 365): void {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    this.behaviorData.pageViews = this.behaviorData.pageViews.filter(
      pv => pv.timestamp > cutoffDate
    );
    
    this.behaviorData.interactions = this.behaviorData.interactions.filter(
      int => int.timestamp > cutoffDate
    );
    
    this.saveBehaviorData();
  }

  // GDPR data export
  exportUserData(): UserBehavior & { sessionId: string; userId?: string } {
    return {
      ...this.behaviorData,
      sessionId: this.sessionId,
      userId: this.userId
    };
  }

  // GDPR data deletion
  deleteUserData(): void {
    localStorage.removeItem('ertuno_behavior_data');
    localStorage.removeItem('ertuno_marketing_data');
    localStorage.removeItem('ertuno_cookie_preferences');
    this.behaviorData = this.initializeBehaviorData();
    this.queue = [];
  }
}

// Global instance
export const analytics = new ERTUNOAnalytics();

// Convenience functions
export const trackEvent = (category: string, action: string, label?: string, value?: number, metadata?: Record<string, any>) => {
  analytics.trackEvent(category, action, label, value, metadata);
};

export const trackPageView = (path?: string) => {
  analytics.trackPageView(path);
};

export const trackBookingAttempt = (serviceCategory: string, providerId?: string) => {
  analytics.trackBookingAttempt(serviceCategory, providerId);
};

export const trackBookingComplete = (bookingId: string, amount: number, serviceCategory: string) => {
  analytics.trackBookingComplete(bookingId, amount, serviceCategory);
};

export const trackSearch = (query: string, category?: string, resultsCount?: number) => {
  analytics.trackSearch(query, category, resultsCount);
};

export const setUserId = (userId: string) => {
  analytics.setUserId(userId);
};

export const updateCookiePreferences = (preferences: CookiePreferences) => {
  analytics.updateCookiePreferences(preferences);
};

export default analytics;
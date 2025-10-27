// Authentication Configuration
export const AUTH_CONFIG = {
  // Enable mock mode ONLY when explicitly set to true (production Firebase by default)
  USE_MOCK_AUTH: import.meta.env.VITE_USE_MOCK_AUTH === 'true',
  
  // Firebase configuration check
  HAS_FIREBASE_CONFIG: !!(import.meta.env.VITE_FIREBASE_API_KEY && 
                          import.meta.env.VITE_FIREBASE_PROJECT_ID &&
                          !import.meta.env.VITE_FIREBASE_API_KEY.includes('demo')),
  
  // Mock mode settings (for development/testing only)
  MOCK_SETTINGS: {
    SIMULATE_NETWORK_DELAY: true,
    DEFAULT_ROLE: 'job_poster' as const,
    ENABLE_SOCIAL_LOGIN: true,
  }
} as const;

// Export auth mode detection
export const isMockMode = () => AUTH_CONFIG.USE_MOCK_AUTH;
export const hasFirebaseConfig = () => AUTH_CONFIG.HAS_FIREBASE_CONFIG;
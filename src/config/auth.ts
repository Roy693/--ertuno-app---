// Authentication Configuration
export const AUTH_CONFIG = {
  // Enable mock mode when Firebase credentials are not properly configured
  USE_MOCK_AUTH: import.meta.env.VITE_FIREBASE_API_KEY === 'demo-key-replace-with-real-firebase-key' || 
                 import.meta.env.VITE_USE_MOCK_AUTH === 'true',
  
  // Mock mode settings
  MOCK_SETTINGS: {
    SIMULATE_NETWORK_DELAY: true,
    DEFAULT_ROLE: 'citizen' as const,
    ENABLE_SOCIAL_LOGIN: true,
  }
} as const;

// Export mock detection
export const isMockMode = () => AUTH_CONFIG.USE_MOCK_AUTH;
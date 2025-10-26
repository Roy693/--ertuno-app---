// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// App Configuration
export const APP_CONFIG = {
  name: 'ERTUNO',
  tagline: 'The Holy Site of Holding Treasure',
  description: 'Where the future of connections, traders, and deals finds its sacred home - the ultimate platform that holds the dreams of endless possibilities',
  version: '1.0.0',
  domain: 'ertuno.com',
} as const;

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Social Media Links
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/ertuno',
  linkedin: 'https://linkedin.com/company/ertuno',
  twitter: 'https://twitter.com/ertuno',
  youtube: 'https://youtube.com/@ertuno',
} as const;

// Navigation Items
export const NAV_ITEMS = [
  { name: 'Home', href: '/', key: 'nav.home' },
  { name: 'Services', href: '/services', key: 'nav.services' },
  { name: 'Università & Ricerca', href: '/research', key: 'nav.research' },
  { name: 'About', href: '/about', key: 'nav.about' },
  { name: 'Contact', href: '/contact', key: 'nav.contact' },
] as const;
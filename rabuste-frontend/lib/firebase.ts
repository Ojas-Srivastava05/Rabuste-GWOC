// Firebase Analytics Configuration
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Firebase configuration - Uses environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let analytics: Analytics | null = null;

// Function to get analytics instance (ensures it's initialized)
function getAnalyticsInstance(): Analytics | null {
  if (typeof window === 'undefined') return null;
  
  if (analytics) return analytics;
  
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    if (app) {
      analytics = getAnalytics(app);
      return analytics;
    }
  } catch (error) {
    console.warn('Firebase Analytics initialization error:', error);
  }
  
  return null;
}

// Initialize on client side
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      getAnalyticsInstance();
    }
  }).catch(() => {
    // Fallback: try to initialize anyway
    getAnalyticsInstance();
  });
}

export { app, analytics, getAnalyticsInstance };
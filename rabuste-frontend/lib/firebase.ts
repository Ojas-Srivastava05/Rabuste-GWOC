// Firebase Analytics Configuration
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

// Firebase configuration
// NOTE: Replace these with your actual Firebase config values
// You can get these from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "your-app-id",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  // Only initialize on client side
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize Analytics only if supported (browser environment)
  isSupported().then((supported) => {
    if (supported && app) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };

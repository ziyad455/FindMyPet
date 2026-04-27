// Firebase initialization and configuration
// This file initializes Firebase app with environment variables

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: "AIzaSyAqjdRanYWwTZYxNkw1KTncWuYCrvsguM8",
  authDomain: "findmypet-e47cf.firebaseapp.com",
  projectId: "findmypet-e47cf",
  storageBucket: "findmypet-e47cf.firebasestorage.app",
  messagingSenderId: "963136921263",
  appId: "1:963136921263:web:ae18a761cb50a90143be5a",
  measurementId: "G-3M1YLENFCD"
};


// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (Storage now handled by Cloudinary)
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

// Firebase initialization and configuration
// This file initializes Firebase app with environment variables

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDd8Xkd8QPHGmtSv2HC9NQMM_Qq33pzVCQ",
  authDomain: "findmypet-ab71b.firebaseapp.com",
  projectId: "findmypet-ab71b",
  storageBucket: "findmypet-ab71b.firebasestorage.app",
  messagingSenderId: "670805876606",
  appId: "1:670805876606:web:dd4e6403bb41e53b279d2f",
  measurementId: "G-HV9FJ2ZL1E"
};


// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (Storage now handled by Cloudinary)
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

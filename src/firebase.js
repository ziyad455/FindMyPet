// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";       // For authentication
import { getFirestore } from "firebase/firestore"; // For Firestore
import { getAnalytics } from "firebase/analytics"; // Optional, for analytics

// Firebase config from .env
const firebaseConfig = {
  apiKey: "AIzaSyAqjdRanYWwTZYxNkw1KTncWuYCrvsguM8",
  authDomain: "findmypet-e47cf.firebaseapp.com",
  projectId: "findmypet-e47cf",
  storageBucket: "findmypet-e47cf.firebasestorage.app",
  messagingSenderId: "963136921263",
  appId: "1:963136921263:web:ae18a761cb50a90143be5a",
  measurementId: "G-3M1YLENFCD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db, analytics };

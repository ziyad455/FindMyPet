// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";       // For authentication
import { getFirestore } from "firebase/firestore"; // For Firestore
import { getAnalytics } from "firebase/analytics"; // Optional, for analytics

// Firebase config from .env
const firebaseConfig = {
  apiKey: "AIzaSyDd8Xkd8QPHGmtSv2HC9NQMM_Qq33pzVCQ",
  authDomain: "findmypet-ab71b.firebaseapp.com",
  projectId: "findmypet-ab71b",
  storageBucket: "findmypet-ab71b.firebasestorage.app",
  messagingSenderId: "670805876606",
  appId: "1:670805876606:web:dd4e6403bb41e53b279d2f",
  measurementId: "G-HV9FJ2ZL1E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db, analytics };

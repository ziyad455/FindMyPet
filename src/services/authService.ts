// Authentication service for Firebase
// Handles user login, registration, and logout operations

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
import { auth, db } from '../firebase';
import type { User, UserRole } from '../types';

/**
 * Sign in user with email and password
 * @param email - User email
 * @param password - User password
 * @returns Firebase user credential
 */
export const loginWithEmailPassword = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Register new user with email and password
 * Creates user document in Firestore with default 'user' role
 * @param email - User email
 * @param password - User password
 * @param displayName - User display name
 * @returns Firebase user credential
 */
export const registerWithEmailPassword = async (
  email: string,
  password: string,
  displayName: string
) => {
  // Create authentication user
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create user document in Firestore with default role
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    email,
    displayName,
    role: 'user' as UserRole,
    createdAt: serverTimestamp()
  });
  
  return userCredential;
};

/**
 * Sign in with Google
 * Creates user document in Firestore if first time sign in
 * @returns Firebase user credential
 */
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  
  try {
    // Check if user exists in Firestore
    console.log('Checking if user exists in Firestore:', result.user.uid);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    
    // If new user, create Firestore document
    if (!userDoc.exists()) {
      console.log('Creating new user document in Firestore...');
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName || 'User',
        role: 'user' as UserRole,
        createdAt: serverTimestamp()
      });
      console.log('User document created successfully');
    } else {
      console.log('User already exists in Firestore');
    }
  } catch (firestoreError) {
    console.error('Firestore error (user signed in but profile not saved):', firestoreError);
    // Continue anyway - user is authenticated, just profile might not be saved
  }
  
  return result;
};

/**
 * Sign out current user
 */
export const logout = async () => {
  return signOut(auth);
};

/**
 * Subscribe to authentication state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get user data from Firestore including role
 * @param uid - User ID
 * @returns User data or null if not found
 */
export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      // User exists in Auth but not in Firestore - create a default profile
      console.warn('User not found in Firestore, creating default profile');
      return {
        uid,
        email: auth.currentUser?.email || '',
        role: 'user',
        displayName: auth.currentUser?.displayName || 'User',
        createdAt: new Date()
      };
    }
    
    const data = userDoc.data();
    return {
      uid,
      email: data.email,
      role: data.role,
      displayName: data.displayName,
      createdAt: data.createdAt?.toDate() || new Date()
    };
  } catch (error) {
    console.error('Error fetching user data from Firestore:', error);
    // Return a default user object based on auth data
    if (auth.currentUser) {
      return {
        uid,
        email: auth.currentUser.email || '',
        role: 'user',
        displayName: auth.currentUser.displayName || 'User',
        createdAt: new Date()
      };
    }
    return null;
  }
};

/**
 * Check if user has admin role
 * @param uid - User ID
 * @returns True if user is admin
 */
export const checkIsAdmin = async (uid: string): Promise<boolean> => {
  const userData = await getUserData(uid);
  return userData?.role === 'admin';
};

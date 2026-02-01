// Pet service for Firebase Firestore operations
// Handles CRUD operations for pet submissions

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Pet, PetFormData, PetStatus, PetDocument } from '../types';
import { uploadPetPhoto, deletePetPhoto } from './storageService';

const PETS_COLLECTION = 'pets';

/**
 * Convert Firestore document to Pet object
 * @param id - Document ID
 * @param data - Document data
 * @returns Pet object
 */
const convertToPet = (id: string, data: PetDocument): Pet => {
  return {
    id,
    userId: data.userId,
    ownerName: data.ownerName,
    petName: data.petName,
    phone: data.phone,
    photoUrl: data.photoUrl,
    message: data.message,
    status: data.status,
    qrCodeUrl: data.qrCodeUrl,
    createdAt: data.createdAt instanceof Timestamp 
      ? data.createdAt.toDate() 
      : new Date(),
    updatedAt: data.updatedAt instanceof Timestamp 
      ? data.updatedAt.toDate() 
      : new Date()
  };
};

/**
 * Create a new pet submission
 * Uploads photo to Storage and saves data to Firestore
 * @param userId - ID of the user creating the submission
 * @param formData - Pet form data including photo file
 * @returns Created pet ID
 */
export const createPetSubmission = async (
  userId: string,
  formData: PetFormData
): Promise<string> => {
  // Upload photo to Firebase Storage
  let photoUrl = '';
  if (formData.photo) {
    photoUrl = await uploadPetPhoto(userId, formData.photo);
  }
  
  // Create pet document in Firestore with pending status
  const petData = {
    userId,
    ownerName: formData.ownerName,
    petName: formData.petName,
    phone: formData.phone,
    photoUrl,
    message: formData.message,
    status: 'pending' as PetStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  const docRef = await addDoc(collection(db, PETS_COLLECTION), petData);
  return docRef.id;
};

/**
 * Get a single pet by ID
 * @param petId - Pet document ID
 * @returns Pet object or null if not found
 */
export const getPetById = async (petId: string): Promise<Pet | null> => {
  const docRef = doc(db, PETS_COLLECTION, petId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return convertToPet(docSnap.id, docSnap.data() as PetDocument);
};

/**
 * Get all pets for a specific user
 * @param userId - User ID
 * @returns Array of pet objects
 */
export const getUserPets = async (userId: string): Promise<Pet[]> => {
  const q = query(
    collection(db, PETS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => 
    convertToPet(doc.id, doc.data() as PetDocument)
  );
};

/**
 * Get all pets (admin only)
 * @param status - Optional status filter
 * @returns Array of pet objects
 */
export const getAllPets = async (status?: PetStatus): Promise<Pet[]> => {
  let q;
  
  if (status) {
    q = query(
      collection(db, PETS_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
  } else {
    q = query(
      collection(db, PETS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => 
    convertToPet(doc.id, doc.data() as PetDocument)
  );
};

/**
 * Subscribe to real-time updates for user's pets
 * @param userId - User ID
 * @param callback - Function to call with updated pets
 * @returns Unsubscribe function
 */
export const subscribeToUserPets = (
  userId: string,
  callback: (pets: Pet[]) => void
) => {
  const q = query(
    collection(db, PETS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const pets = querySnapshot.docs.map(doc => 
      convertToPet(doc.id, doc.data() as PetDocument)
    );
    callback(pets);
  });
};

/**
 * Subscribe to real-time updates for all pets (admin)
 * @param callback - Function to call with updated pets
 * @param status - Optional status filter
 * @returns Unsubscribe function
 */
export const subscribeToAllPets = (
  callback: (pets: Pet[]) => void,
  status?: PetStatus
) => {
  let q;
  
  if (status) {
    q = query(
      collection(db, PETS_COLLECTION),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
  } else {
    q = query(
      collection(db, PETS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
  }
  
  return onSnapshot(q, (querySnapshot) => {
    const pets = querySnapshot.docs.map(doc => 
      convertToPet(doc.id, doc.data() as PetDocument)
    );
    callback(pets);
  });
};

/**
 * Subscribe to real-time updates for a single pet
 * @param petId - Pet document ID
 * @param callback - Function to call with updated pet
 * @returns Unsubscribe function
 */
export const subscribeToPet = (
  petId: string,
  callback: (pet: Pet | null) => void
) => {
  const docRef = doc(db, PETS_COLLECTION, petId);
  
  return onSnapshot(docRef, (docSnap) => {
    if (!docSnap.exists()) {
      callback(null);
      return;
    }
    callback(convertToPet(docSnap.id, docSnap.data() as PetDocument));
  });
};

/**
 * Update pet submission
 * If photo is changed, uploads new photo and deletes old one
 * @param petId - Pet document ID
 * @param updates - Partial pet data to update
 * @param newPhoto - Optional new photo file
 * @param oldPhotoUrl - URL of old photo to delete
 */
export const updatePetSubmission = async (
  petId: string,
  updates: Partial<PetFormData>,
  newPhoto?: File | null,
  oldPhotoUrl?: string
): Promise<void> => {
  const updateData: Record<string, unknown> = {
    ...updates,
    updatedAt: serverTimestamp()
  };
  
  // Handle photo update
  if (newPhoto) {
    // Delete old photo if exists
    if (oldPhotoUrl) {
      await deletePetPhoto(oldPhotoUrl);
    }
    
    // Get pet to get userId for upload path
    const pet = await getPetById(petId);
    if (pet) {
      updateData.photoUrl = await uploadPetPhoto(pet.userId, newPhoto);
    }
  }
  
  // Remove photo field from updates (we handle it separately)
  delete updateData.photo;
  
  await updateDoc(doc(db, PETS_COLLECTION, petId), updateData);
};

/**
 * Update pet status (admin action)
 * @param petId - Pet document ID
 * @param status - New status
 * @param qrCodeUrl - Optional QR code URL (for approved status)
 */
export const updatePetStatus = async (
  petId: string,
  status: PetStatus,
  qrCodeUrl?: string
): Promise<void> => {
  const updateData: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp()
  };
  
  if (qrCodeUrl) {
    updateData.qrCodeUrl = qrCodeUrl;
  }
  
  await updateDoc(doc(db, PETS_COLLECTION, petId), updateData);
};

/**
 * Delete pet submission
 * Also deletes associated photo from Storage
 * @param petId - Pet document ID
 */
export const deletePetSubmission = async (petId: string): Promise<void> => {
  // Get pet to get photo URL
  const pet = await getPetById(petId);
  
  // Delete photo from Storage if exists
  if (pet?.photoUrl) {
    await deletePetPhoto(pet.photoUrl);
  }
  
  // Delete document from Firestore
  await deleteDoc(doc(db, PETS_COLLECTION, petId));
};

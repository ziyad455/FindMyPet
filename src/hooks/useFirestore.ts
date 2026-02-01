// Custom hook for Firestore operations with pets
// Provides real-time subscription and CRUD operations with localStorage caching

import { useState, useEffect, useCallback } from 'react';
import type { Pet, PetFormData, PetStatus } from '../types';
import {
  createPetSubmission,
  updatePetSubmission,
  updatePetStatus,
  deletePetSubmission,
  subscribeToUserPets,
  subscribeToAllPets,
  subscribeToPet
} from '../services/petService';
import {
  getCachedUserPets,
  setCachedUserPets,
  getCachedAllPets,
  setCachedAllPets,
  getCachedPet,
  setCachedPet,
  invalidateUserPetsCache,
  removePetFromCache,
  invalidateAllPetsCache
} from '../services/cacheService';
import { useAuth } from '../context/AuthContext';

/**
 * Hook for user's pets with real-time updates and caching
 */
export const useUserPets = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      queueMicrotask(() => {
        setPets([]);
        setLoading(false);
      });
      return;
    }

    // Check cache first
    const cachedPets = getCachedUserPets(user.uid);
    if (cachedPets) {
      queueMicrotask(() => {
        setPets(cachedPets);
        setLoading(false);
      });
    } else {
      queueMicrotask(() => {
        setLoading(true);
        setError(null);
      });
    }

    // Subscribe to real-time updates (will update cache)
    const unsubscribe = subscribeToUserPets(user.uid, (updatedPets) => {
      setPets(updatedPets);
      setCachedUserPets(user.uid, updatedPets);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Create new pet submission
  const createPet = useCallback(async (formData: PetFormData): Promise<string> => {
    if (!user?.uid) throw new Error('User not authenticated');
    const petId = await createPetSubmission(user.uid, formData);
    // Invalidate cache to force refresh
    invalidateUserPetsCache(user.uid);
    return petId;
  }, [user]);

  // Update existing pet
  const updatePet = useCallback(async (
    petId: string,
    updates: Partial<PetFormData>,
    newPhoto?: File | null,
    oldPhotoUrl?: string
  ) => {
    const result = await updatePetSubmission(petId, updates, newPhoto, oldPhotoUrl);
    // Invalidate cache to force refresh
    if (user?.uid) {
      invalidateUserPetsCache(user.uid);
    }
    return result;
  }, [user]);

  // Delete pet
  const deletePet = useCallback(async (petId: string) => {
    const result = await deletePetSubmission(petId);
    // Remove from cache
    if (user?.uid) {
      removePetFromCache(petId, user.uid);
    }
    return result;
  }, [user]);

  return {
    pets,
    loading,
    error,
    createPet,
    updatePet,
    deletePet
  };
};

/**
 * Hook for all pets (admin) with real-time updates and caching
 */
export const useAllPets = (statusFilter?: PetStatus) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check cache first
    const cachedPets = getCachedAllPets(statusFilter);
    if (cachedPets) {
      queueMicrotask(() => {
        setPets(cachedPets);
        setLoading(false);
      });
    } else {
      queueMicrotask(() => {
        setLoading(true);
        setError(null);
      });
    }

    // Subscribe to real-time updates (will update cache)
    const unsubscribe = subscribeToAllPets((updatedPets) => {
      setPets(updatedPets);
      setCachedAllPets(updatedPets, statusFilter);
      setLoading(false);
    }, statusFilter);

    return () => unsubscribe();
  }, [statusFilter]);

  // Approve pet submission
  const approvePet = useCallback(async (petId: string, qrCodeUrl?: string) => {
    const result = await updatePetStatus(petId, 'approved', qrCodeUrl);
    invalidateAllPetsCache();
    return result;
  }, []);

  // Reject pet submission
  const rejectPet = useCallback(async (petId: string) => {
    const result = await updatePetStatus(petId, 'rejected');
    invalidateAllPetsCache();
    return result;
  }, []);

  // Delete pet submission
  const deletePet = useCallback(async (petId: string) => {
    const result = await deletePetSubmission(petId);
    invalidateAllPetsCache();
    return result;
  }, []);

  return {
    pets,
    loading,
    error,
    approvePet,
    rejectPet,
    deletePet
  };
};

/**
 * Hook for single pet with real-time updates and caching
 */
export const usePet = (petId: string | undefined) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!petId) {
      queueMicrotask(() => {
        setPet(null);
        setLoading(false);
      });
      return;
    }

    // Check cache first
    const cachedPet = getCachedPet(petId);
    if (cachedPet) {
      queueMicrotask(() => {
        setPet(cachedPet);
        setLoading(false);
      });
    } else {
      queueMicrotask(() => {
        setLoading(true);
        setError(null);
      });
    }

    // Subscribe to real-time updates (will update cache)
    const unsubscribe = subscribeToPet(petId, (updatedPet) => {
      setPet(updatedPet);
      if (updatedPet) {
        setCachedPet(updatedPet);
      }
      setLoading(false);
      if (!updatedPet) {
        setError('Pet not found');
      }
    });

    return () => unsubscribe();
  }, [petId]);

  return {
    pet,
    loading,
    error
  };
};

// Custom hook for Firestore operations with pets
// Provides real-time subscription and CRUD operations

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
import { useAuth } from '../context/AuthContext';

/**
 * Hook for user's pets with real-time updates
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

    queueMicrotask(() => {
      setLoading(true);
      setError(null);
    });

    // Subscribe to real-time updates
    const unsubscribe = subscribeToUserPets(user.uid, (updatedPets) => {
      setPets(updatedPets);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Create new pet submission
  const createPet = useCallback(async (formData: PetFormData): Promise<string> => {
    if (!user?.uid) throw new Error('User not authenticated');
    return createPetSubmission(user.uid, formData);
  }, [user]);

  // Update existing pet
  const updatePet = useCallback(async (
    petId: string,
    updates: Partial<PetFormData>,
    newPhoto?: File | null,
    oldPhotoUrl?: string
  ) => {
    return updatePetSubmission(petId, updates, newPhoto, oldPhotoUrl);
  }, []);

  // Delete pet
  const deletePet = useCallback(async (petId: string) => {
    return deletePetSubmission(petId);
  }, []);

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
 * Hook for all pets (admin) with real-time updates
 */
export const useAllPets = (statusFilter?: PetStatus) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setLoading(true);
      setError(null);
    });

    // Subscribe to real-time updates
    const unsubscribe = subscribeToAllPets((updatedPets) => {
      setPets(updatedPets);
      setLoading(false);
    }, statusFilter);

    return () => unsubscribe();
  }, [statusFilter]);

  // Approve pet submission
  const approvePet = useCallback(async (petId: string, qrCodeUrl?: string) => {
    return updatePetStatus(petId, 'approved', qrCodeUrl);
  }, []);

  // Reject pet submission
  const rejectPet = useCallback(async (petId: string) => {
    return updatePetStatus(petId, 'rejected');
  }, []);

  // Delete pet submission
  const deletePet = useCallback(async (petId: string) => {
    return deletePetSubmission(petId);
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
 * Hook for single pet with real-time updates
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

    queueMicrotask(() => {
      setLoading(true);
      setError(null);
    });

    // Subscribe to real-time updates
    const unsubscribe = subscribeToPet(petId, (updatedPet) => {
      setPet(updatedPet);
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

// Firebase Cache Utility
// Manages localStorage caching to reduce Firebase requests

import type { Pet } from '../types';

// Cache keys
const CACHE_KEYS = {
  USER_PETS: 'fmp_user_pets',
  ALL_PETS: 'fmp_all_pets',
  SINGLE_PET: 'fmp_pet_',
  CACHE_TIMESTAMP: '_timestamp'
} as const;

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

interface CachedData<T> {
  data: T;
  timestamp: number;
  userId?: string;
}

/**
 * Check if cached data is still valid
 */
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

/**
 * Serialize pets for storage (convert Date objects to ISO strings)
 */
const serializePets = (pets: Pet[]): string => {
  const serialized = pets.map(pet => ({
    ...pet,
    createdAt: pet.createdAt instanceof Date ? pet.createdAt.toISOString() : pet.createdAt,
    updatedAt: pet.updatedAt instanceof Date ? pet.updatedAt.toISOString() : pet.updatedAt
  }));
  return JSON.stringify({ data: serialized, timestamp: Date.now() });
};

/**
 * Serialize single pet for storage
 */
const serializePet = (pet: Pet): string => {
  const serialized = {
    ...pet,
    createdAt: pet.createdAt instanceof Date ? pet.createdAt.toISOString() : pet.createdAt,
    updatedAt: pet.updatedAt instanceof Date ? pet.updatedAt.toISOString() : pet.updatedAt
  };
  return JSON.stringify({ data: serialized, timestamp: Date.now() });
};

/**
 * Deserialize pets from storage (convert ISO strings back to Date objects)
 */
const deserializePets = (data: CachedData<Pet[]>): Pet[] => {
  return data.data.map(pet => ({
    ...pet,
    createdAt: new Date(pet.createdAt),
    updatedAt: new Date(pet.updatedAt)
  }));
};

/**
 * Deserialize single pet from storage
 */
const deserializePet = (data: CachedData<Pet>): Pet => {
  return {
    ...data.data,
    createdAt: new Date(data.data.createdAt),
    updatedAt: new Date(data.data.updatedAt)
  };
};

/**
 * Get cached user pets
 */
export const getCachedUserPets = (userId: string): Pet[] | null => {
  try {
    const cached = localStorage.getItem(`${CACHE_KEYS.USER_PETS}_${userId}`);
    if (!cached) return null;
    
    const parsed: CachedData<Pet[]> = JSON.parse(cached);
    if (!isCacheValid(parsed.timestamp)) {
      localStorage.removeItem(`${CACHE_KEYS.USER_PETS}_${userId}`);
      return null;
    }
    
    return deserializePets(parsed);
  } catch {
    return null;
  }
};

/**
 * Set cached user pets
 */
export const setCachedUserPets = (userId: string, pets: Pet[]): void => {
  try {
    localStorage.setItem(`${CACHE_KEYS.USER_PETS}_${userId}`, serializePets(pets));
  } catch (e) {
    // localStorage might be full or disabled
    console.warn('Failed to cache user pets:', e);
  }
};

/**
 * Get cached all pets (admin)
 */
export const getCachedAllPets = (statusFilter?: string): Pet[] | null => {
  try {
    const key = statusFilter 
      ? `${CACHE_KEYS.ALL_PETS}_${statusFilter}` 
      : CACHE_KEYS.ALL_PETS;
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const parsed: CachedData<Pet[]> = JSON.parse(cached);
    if (!isCacheValid(parsed.timestamp)) {
      localStorage.removeItem(key);
      return null;
    }
    
    return deserializePets(parsed);
  } catch {
    return null;
  }
};

/**
 * Set cached all pets (admin)
 */
export const setCachedAllPets = (pets: Pet[], statusFilter?: string): void => {
  try {
    const key = statusFilter 
      ? `${CACHE_KEYS.ALL_PETS}_${statusFilter}` 
      : CACHE_KEYS.ALL_PETS;
    localStorage.setItem(key, serializePets(pets));
  } catch (e) {
    console.warn('Failed to cache all pets:', e);
  }
};

/**
 * Get cached single pet
 */
export const getCachedPet = (petId: string): Pet | null => {
  try {
    const cached = localStorage.getItem(`${CACHE_KEYS.SINGLE_PET}${petId}`);
    if (!cached) return null;
    
    const parsed: CachedData<Pet> = JSON.parse(cached);
    if (!isCacheValid(parsed.timestamp)) {
      localStorage.removeItem(`${CACHE_KEYS.SINGLE_PET}${petId}`);
      return null;
    }
    
    return deserializePet(parsed);
  } catch {
    return null;
  }
};

/**
 * Set cached single pet
 */
export const setCachedPet = (pet: Pet): void => {
  try {
    localStorage.setItem(`${CACHE_KEYS.SINGLE_PET}${pet.id}`, serializePet(pet));
  } catch (e) {
    console.warn('Failed to cache pet:', e);
  }
};

/**
 * Invalidate user pets cache
 */
export const invalidateUserPetsCache = (userId: string): void => {
  localStorage.removeItem(`${CACHE_KEYS.USER_PETS}_${userId}`);
};

/**
 * Invalidate all pets cache
 */
export const invalidateAllPetsCache = (): void => {
  // Remove all cached all pets entries
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_KEYS.ALL_PETS)) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Invalidate single pet cache
 */
export const invalidatePetCache = (petId: string): void => {
  localStorage.removeItem(`${CACHE_KEYS.SINGLE_PET}${petId}`);
};

/**
 * Clear all FindMyPet cache
 */
export const clearAllCache = (): void => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('fmp_')) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Update a single pet in all relevant caches
 */
export const updatePetInCache = (pet: Pet): void => {
  // Update single pet cache
  setCachedPet(pet);
  
  // Update in user pets cache if exists
  const userPetsKey = `${CACHE_KEYS.USER_PETS}_${pet.userId}`;
  const userPetsCached = localStorage.getItem(userPetsKey);
  if (userPetsCached) {
    try {
      const parsed: CachedData<Pet[]> = JSON.parse(userPetsCached);
      const updatedPets = parsed.data.map(p => p.id === pet.id ? {
        ...pet,
        createdAt: pet.createdAt instanceof Date ? pet.createdAt.toISOString() : pet.createdAt,
        updatedAt: pet.updatedAt instanceof Date ? pet.updatedAt.toISOString() : pet.updatedAt
      } : p);
      localStorage.setItem(userPetsKey, JSON.stringify({ data: updatedPets, timestamp: parsed.timestamp }));
    } catch {
      // Ignore cache update errors
    }
  }
  
  // Invalidate all pets cache since it might contain this pet
  invalidateAllPetsCache();
};

/**
 * Remove a pet from all caches
 */
export const removePetFromCache = (petId: string, userId: string): void => {
  // Remove single pet cache
  invalidatePetCache(petId);
  
  // Remove from user pets cache
  const userPetsKey = `${CACHE_KEYS.USER_PETS}_${userId}`;
  const userPetsCached = localStorage.getItem(userPetsKey);
  if (userPetsCached) {
    try {
      const parsed: CachedData<Pet[]> = JSON.parse(userPetsCached);
      const filteredPets = parsed.data.filter(p => p.id !== petId);
      localStorage.setItem(userPetsKey, JSON.stringify({ data: filteredPets, timestamp: parsed.timestamp }));
    } catch {
      // Ignore cache update errors
    }
  }
  
  // Invalidate all pets cache
  invalidateAllPetsCache();
};

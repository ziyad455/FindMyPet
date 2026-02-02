// TypeScript types and interfaces for FindMyPet application

// Pet submission status
export type PetStatus = "pending" | "approved" | "rejected";

// User role
export type UserRole = "user" | "admin";

// Pet submission interface
export interface Pet {
  id: string;
  userId: string;
  ownerName: string;
  petName: string;
  phone: string;
  photoUrl: string;
  message: string;
  status: PetStatus;
  qrCodeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User interface
export interface User {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  createdAt: Date;
}

// Form data for pet submission
export interface PetFormData {
  ownerName: string;
  petName: string;
  phone: string;
  photo: File | null;
  message: string;
}

// Form validation errors
export interface FormErrors {
  ownerName?: string;
  petName?: string;
  phone?: string;
  photo?: string;
  message?: string;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

// Language context type
export type Language = "ar" | "fr" | "en";

// Translation parameters for interpolation
export type TranslationParams = Record<string, string | number>;

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string, params?: TranslationParams) => string;
}

// Firebase Firestore pet document (for conversion)
export interface PetDocument {
  userId: string;
  ownerName: string;
  petName: string;
  phone: string;
  photoUrl: string;
  message: string;
  status: PetStatus;
  qrCodeUrl?: string;
  createdAt: unknown; // Firestore Timestamp
  updatedAt: unknown; // Firestore Timestamp
}

// Language Context Provider
// Manages internationalization (i18n) with Arabic and French support

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import type { Language, LanguageContextType } from '../types';

// Import translations
import arTranslations from '../i18n/ar.json';
import frTranslations from '../i18n/fr.json';

// Translation type
type Translations = typeof arTranslations;

// Translations map
const translations: Record<Language, Translations> = {
  ar: arTranslations,
  fr: frTranslations
};

// Cookie key for language preference
const LANGUAGE_COOKIE_KEY = 'findmypet_language';

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  isRTL: false,
  t: () => ''
});

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

/**
 * Get nested value from object using dot notation
 * @param obj - Object to get value from
 * @param path - Dot-separated path (e.g., 'landing.title')
 * @returns Value at path or path if not found
 */
const getNestedValue = (obj: Record<string, unknown>, path: string): string => {
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return path if key not found
    }
  }
  
  return typeof current === 'string' ? current : path;
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize language from cookie or default to French
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = Cookies.get(LANGUAGE_COOKIE_KEY);
    return (saved === 'ar' || saved === 'fr') ? saved : 'fr';
  });

  // Check if current language is RTL (Arabic)
  const isRTL = language === 'ar';

  // Update document direction and language attribute when language changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Add RTL class for Tailwind if needed
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [language, isRTL]);

  // Set language and save to cookie
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    Cookies.set(LANGUAGE_COOKIE_KEY, lang, { expires: 365 }); // Save for 1 year
  }, []);

  // Translation function
  const t = useCallback((key: string): string => {
    const currentTranslations = translations[language];
    return getNestedValue(currentTranslations as unknown as Record<string, unknown>, key);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    isRTL,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;

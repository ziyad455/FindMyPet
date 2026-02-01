// useLanguage hook
// Separate file for Fast Refresh compatibility

import { useContext } from 'react';
import { LanguageContext } from '../context/languageContextDef';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

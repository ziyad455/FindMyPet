// Language Context Definition
// Separate file for Fast Refresh compatibility

import { createContext } from 'react';
import type { LanguageContextType } from '../types';

export const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  isRTL: false,
  t: () => ''
});

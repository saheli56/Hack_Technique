import { useContext } from 'react';
import { LanguageContext } from '../i18n/LanguageContext';

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
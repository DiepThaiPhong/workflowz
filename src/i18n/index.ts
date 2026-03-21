import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import vi from './locales/vi.json';
import en from './locales/en.json';

// i18next configuration for SkillBridge AI
// Supports Vietnamese (vi) and English (en)
// Default language: Vietnamese (vi)
// Persists selection to localStorage via LanguageDetector

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: { translation: vi },
      en: { translation: en },
    },
    fallbackLng: 'vi',
    lng: localStorage.getItem('skillbridge-lang') || 'vi',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'skillbridge-lang',
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;

import React, { createContext, useContext, useState } from 'react';
import en from '../locales/en.json';
import am from '../locales/am.json';
import om from '../locales/om.json';
import ti from '../locales/ti.json';

const LanguageContext = createContext();

const translations = { en, am, om, ti };

const languages = [
  { code: 'en', name: 'English' },
  { code: 'am', name: 'አማርኛ' },
  { code: 'om', name: 'Afaan Oromo' },
  { code: 'ti', name: 'ትግርኛ' }
];

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('novus_lang') || 'en';
  });

  const changeLanguage = (code) => {
    if (translations[code]) {
      setCurrentLanguage(code);
      localStorage.setItem('novus_lang', code);
    }
  };

  const t = (keyPath) => {
    if (!keyPath) return '';
    const keys = keyPath.split('.');
    let result = translations[currentLanguage];
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        // Fallback to English
        let engFallback = translations['en'];
        for (const fKey of keys) {
          if (engFallback && engFallback[fKey] !== undefined) {
            engFallback = engFallback[fKey];
          } else {
            return keyPath;
          }
        }
        return engFallback;
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

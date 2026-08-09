import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

// Supported languages (removed English)
const languages = {
  fr: {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    direction: 'ltr'
  },
  ar: {
    code: 'ar',
    name: 'العربية',
    flag: '🇲🇦',
    direction: 'rtl'
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'fr' // Default to French instead of English
  );

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export { languages };
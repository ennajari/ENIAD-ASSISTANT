import { translations } from '../constants/config';

export const useTranslation = (currentLanguage) => {
  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key];
  };

  return { t };
};

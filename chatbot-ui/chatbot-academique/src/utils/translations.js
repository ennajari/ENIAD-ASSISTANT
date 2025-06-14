import { translations } from '../constants/config';

export const useTranslation = (currentLanguage) => {
  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.fr[key];
  };

  return { t };
};

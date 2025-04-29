import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import EN from './locales/en.json';
import IT from './locales/it.json';
import DE from './locales/de.json';
import RO from './locales/ro.json';

i18n.use(initReactI18next).init({
  resources: { en: { translation: EN }, it: { translation: IT }, de: { translation: DE }, ro: { translation: RO } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});
export default i18n;
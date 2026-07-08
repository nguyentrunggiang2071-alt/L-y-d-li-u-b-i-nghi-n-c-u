import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../public/locales/en/translation.json";
import vi from "../public/locales/vi/translation.json";

const storedLanguage =
  typeof window !== "undefined"
    ? window.localStorage.getItem("app-language")
    : null;

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

i18n.use(initReactI18next).init({
  resources,
  lng: storedLanguage || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

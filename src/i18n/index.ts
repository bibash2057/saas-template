import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import {
  DEFAULT_NS,
  FALLBACK_LANGUAGE,
  LANGUAGE_META,
  LANGUAGE_STORAGE_KEY,
  SHELL_NAMESPACES,
  SUPPORTED_LANGUAGES,
  toAppLanguage,
} from "./config";

const applyDocumentLanguage = (lng: string) => {
  const code = toAppLanguage(lng);
  const root = document.documentElement;
  root.lang = code;
  root.dir = LANGUAGE_META[code].dir;
};

void i18n
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (lng: string, ns: string) => import(`./locales/${lng}/${ns}.json`),
    ),
  )
  .use(initReactI18next)
  .init({
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: FALLBACK_LANGUAGE,
    load: "languageOnly",
    ns: SHELL_NAMESPACES,
    defaultNS: DEFAULT_NS,

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },

    interpolation: { escapeValue: false },
    react: { useSuspense: true },

    saveMissing: import.meta.env.DEV,
    missingKeyHandler: (lngs, ns, key) => {
      if (import.meta.env.DEV) {
        console.warn(
          `[i18n] missing key "${ns}:${key}" for ${lngs.join(", ")}`,
        );
      }
    },
  });

i18n.on("languageChanged", applyDocumentLanguage);
if (i18n.resolvedLanguage) applyDocumentLanguage(i18n.resolvedLanguage);

export default i18n;

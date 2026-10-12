import type { CalendarLanguage } from "nepali-calendar";

export const SUPPORTED_LANGUAGES = ["en", "ne"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const FALLBACK_LANGUAGE: AppLanguage = "en";
export const LANGUAGE_STORAGE_KEY = "app-language";

export const DEFAULT_NS = "common";
export const NAMESPACES = [
  "common",
  "nav",
  "auth",
  "settings",
  "table",
  "validation",
  "invoices",
] as const;
export type AppNamespace = (typeof NAMESPACES)[number];
export const SHELL_NAMESPACES: AppNamespace[] = ["common", "nav"];

type LanguageMeta = {
  label: string;
  nativeLabel: string;
  dir: "ltr" | "rtl";
  intlLocale: string;
  numberingSystem: "latn" | "deva";
  calendarLanguage: CalendarLanguage;
};

export const LANGUAGE_META: Record<AppLanguage, LanguageMeta> = {
  en: {
    label: "English",
    nativeLabel: "English",
    dir: "ltr",
    intlLocale: "en",
    numberingSystem: "latn",
    calendarLanguage: "en",
  },
  ne: {
    label: "Nepali",
    nativeLabel: "नेपाली",
    dir: "ltr",
    intlLocale: "ne-NP",
    numberingSystem: "deva",
    calendarLanguage: "np",
  },
};

export const isAppLanguage = (value: unknown): value is AppLanguage =>
  typeof value === "string" &&
  (SUPPORTED_LANGUAGES as readonly string[]).includes(value);

export const toAppLanguage = (value: string | undefined): AppLanguage => {
  const base = value?.split("-")[0];
  return isAppLanguage(base) ? base : FALLBACK_LANGUAGE;
};

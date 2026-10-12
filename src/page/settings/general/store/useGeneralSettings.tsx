import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CalendarLanguage } from "nepali-calendar";

export type CurrencyPosition = "start" | "end";
export type CalendarType = "AD" | "BS";
export type NumberFormat = "lakh" | "million";
export type DateFormat =
  | "YYYY-MM-DD"
  | "DD/MM/YYYY"
  | "MM/DD/YYYY"
  | "DD MMM YYYY"
  | "MMMM DD, YYYY";

export const DATE_FORMATS: DateFormat[] = [
  "YYYY-MM-DD",
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "DD MMM YYYY",
  "MMMM DD, YYYY",
];

export type GeneralSettings = {
  currency: string;
  currencyPosition: CurrencyPosition;
  numberFormat: NumberFormat;
  calendar: CalendarType;
  dateFormat: DateFormat;
  calendarLanguage: CalendarLanguage;
};

type GeneralSettingsStore = GeneralSettings & {
  update: <K extends keyof GeneralSettings>(
    key: K,
    value: GeneralSettings[K],
  ) => void;
  reset: () => void;
};

export const DEFAULT_SETTINGS: GeneralSettings = {
  currency: "NPR",
  currencyPosition: "start",
  numberFormat: "lakh",
  calendar: "BS",
  dateFormat: "YYYY-MM-DD",
  calendarLanguage: "en",
};

export const useGeneralSettings = create<GeneralSettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      update: (key, value) => set({ [key]: value } as Partial<GeneralSettings>),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: "general-settings-store",
      version: 2,
      migrate: (persisted) => ({
        ...DEFAULT_SETTINGS,
        ...(persisted as Partial<GeneralSettings>),
      }),
      partialize: (s) => ({
        currency: s.currency,
        currencyPosition: s.currencyPosition,
        numberFormat: s.numberFormat,
        calendar: s.calendar,
        dateFormat: s.dateFormat,
        calendarLanguage: s.calendarLanguage,
      }),
    },
  ),
);

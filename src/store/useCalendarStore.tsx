import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CalendarLanguage } from "nepali-calendar";

export type CalendarType = "bs" | "ad";

interface CalendarStore {
  calendarType: CalendarType;
  language: CalendarLanguage;
  setCalendarType: (calendarType: CalendarType) => void;
  setLanguage: (language: CalendarLanguage) => void;
  toggleLanguage: () => void;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      calendarType: "bs",
      language: "np",
      setCalendarType: (calendarType) => set({ calendarType }),
      setLanguage: (language) => set({ language }),
      toggleLanguage: () =>
        set((state) => ({ language: state.language === "np" ? "en" : "np" })),
    }),
    { name: "calendar" },
  ),
);

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  LANGUAGE_META,
  SUPPORTED_LANGUAGES,
  toAppLanguage,
  type AppLanguage,
} from "@/i18n/config";
import { useGeneralSettings } from "@/page/settings/general/store/useGeneralSettings";
import { useCalendarStore } from "@/store/useCalendarStore";

export const LANGUAGE_OPTIONS = SUPPORTED_LANGUAGES.map((code) => ({
  code,
  ...LANGUAGE_META[code],
}));

export function useLanguage() {
  const { i18n } = useTranslation();
  const language = toAppLanguage(i18n.resolvedLanguage);

  const setLanguage = useCallback(
    async (next: AppLanguage) => {
      if (next === language) return;
      await i18n.changeLanguage(next);

      const { calendarLanguage } = LANGUAGE_META[next];
      useGeneralSettings
        .getState()
        .update("calendarLanguage", calendarLanguage);
      useCalendarStore.getState().setLanguage(calendarLanguage);
    },
    [i18n, language],
  );

  return { language, meta: LANGUAGE_META[language], setLanguage };
}

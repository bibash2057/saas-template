import {
  isoToAd,
  isoToBs,
  toNepaliDigits,
  NEPALI_MONTHS,
  GREGORIAN_MONTHS,
  type CalendarLanguage,
} from "nepali-calendar";
import {
  useGeneralSettings,
  type CalendarType,
  type DateFormat,
} from "@/page/settings/general/store/useGeneralSettings";

export type DateSettings = {
  calendar: CalendarType;
  dateFormat: DateFormat;
  calendarLanguage: CalendarLanguage;
};

export const formatDate = (
  iso: string | null | undefined,
  s: DateSettings,
): string => {
  if (!iso) return "";
  const isBs = s.calendar === "BS";
  const d = isBs ? isoToBs(iso) : isoToAd(iso);
  if (!d) return "";

  const np = isBs && s.calendarLanguage === "np";
  const num = (n: number, width = 0) => {
    const str = String(n).padStart(width, "0");
    return np ? toNepaliDigits(str) : str;
  };
  const full = isBs
    ? NEPALI_MONTHS[np ? "np" : "en"][d.month - 1]
    : GREGORIAN_MONTHS[d.month - 1];
  const short = isBs ? full : full.slice(0, 3);

  return s.dateFormat.replace(/YYYY|MMMM|MMM|MM|DD/g, (t) => {
    switch (t) {
      case "YYYY":
        return num(d.year);
      case "MMMM":
        return full;
      case "MMM":
        return short;
      case "MM":
        return num(d.month, 2);
      default:
        return num(d.day, 2); // DD
    }
  });
};

export const todayIso = (): string => {
  const n = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
};

export const useFormatDate = () => {
  const calendar = useGeneralSettings((s) => s.calendar);
  const dateFormat = useGeneralSettings((s) => s.dateFormat);
  const calendarLanguage = useGeneralSettings((s) => s.calendarLanguage);
  return (iso: string | null | undefined, override?: Partial<DateSettings>) =>
    formatDate(iso, { calendar, dateFormat, calendarLanguage, ...override });
};

export const formatDateNow = (iso: string | null | undefined) => {
  const { calendar, dateFormat, calendarLanguage } =
    useGeneralSettings.getState();
  return formatDate(iso, { calendar, dateFormat, calendarLanguage });
};

/**
 * Static label tables for months and weekdays in both English and Nepali
 * (Devanagari) scripts. UI layers pick the appropriate array based on the
 * active {@link CalendarLanguage}.
 */
import type { CalendarLanguage } from '../types';

/** Bikram Sambat month names, indexed 0 (Baisakh) - 11 (Chaitra). */
export const NEPALI_MONTHS: Readonly<Record<CalendarLanguage, readonly string[]>> = {
  en: [
    'Baisakh',
    'Jestha',
    'Ashadh',
    'Shrawan',
    'Bhadra',
    'Ashwin',
    'Kartik',
    'Mangsir',
    'Poush',
    'Magh',
    'Falgun',
    'Chaitra',
  ],
  np: [
    'बैशाख',
    'जेठ',
    'असार',
    'साउन',
    'भदौ',
    'असोज',
    'कार्तिक',
    'मंसिर',
    'पुष',
    'माघ',
    'फागुन',
    'चैत',
  ],
};

/** Gregorian month names, indexed 0 (January) - 11 (December). */
export const GREGORIAN_MONTHS: readonly string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Full weekday names, indexed 0 (Sunday) - 6 (Saturday). */
export const WEEKDAYS: Readonly<Record<CalendarLanguage, readonly string[]>> = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  np: ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'],
};

/** Short weekday labels for the calendar header row. */
export const WEEKDAYS_SHORT: Readonly<Record<CalendarLanguage, readonly string[]>> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  np: ['आ', 'सो', 'मं', 'बु', 'बि', 'शु', 'श'],
};

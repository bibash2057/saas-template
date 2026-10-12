/**
 * Devanagari digit helpers. Conversions are purely string-based so they remain
 * framework-agnostic and lossless for any non-negative integer input.
 */
import type { CalendarLanguage } from '../types';

const NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'] as const;

/** Convert an Arabic-numeral value to Devanagari digits. */
export const toNepaliDigits = (value: number | string): string =>
  String(value).replace(/[0-9]/g, (d) => NEPALI_DIGITS[Number(d)]);

/** Convert Devanagari digits back to Arabic numerals. */
export const toEnglishDigits = (value: string): string =>
  value.replace(/[०-९]/g, (d) => String(NEPALI_DIGITS.indexOf(d as (typeof NEPALI_DIGITS)[number])));

/** Format a number using the script appropriate for the given language. */
export const formatNumber = (value: number, language: CalendarLanguage): string =>
  language === 'np' ? toNepaliDigits(value) : String(value);

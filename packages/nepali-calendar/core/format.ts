/**
 * Pure formatting and serialisation helpers for Bikram Sambat / Gregorian
 * dates. No React, no UI — just string <-> date conversion so both the logic
 * and UI layers can share one source of truth for how dates are displayed and
 * persisted.
 *
 * The persisted representation is always a Gregorian ISO day string
 * (`YYYY-MM-DD`) so the backend contract is unchanged regardless of which
 * calendar the user views dates in.
 */
import { adToBs, bsToAd } from './converter';
import { formatNumber, GREGORIAN_MONTHS, NEPALI_MONTHS } from './data';
import type { AdDate, BsDate, CalendarLanguage } from './types';

/** Zero-pad a number to two digits. */
const pad = (n: number): string => String(n).padStart(2, '0');

/** Format a BS date as "<day> <Month> <year>" in the requested language. */
export const formatBsDate = (
  date: BsDate | null,
  language: CalendarLanguage = 'en'
): string => {
  if (!date) return '';
  const day = formatNumber(date.day, language);
  const year = formatNumber(date.year, language);
  const month = NEPALI_MONTHS[language][date.month - 1];
  return `${day} ${month} ${year}`;
};

/** Format an AD date as a short readable label, e.g. "13 Apr 2024". */
export const formatAdDate = (date: AdDate | null): string => {
  if (!date) return '';
  return `${date.day} ${GREGORIAN_MONTHS[date.month - 1].slice(0, 3)} ${date.year}`;
};

/** Parse a `YYYY-MM-DD` Gregorian string into an AD date. */
export const isoToAd = (iso?: string | null): AdDate | null => {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso.trim());
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
};

/** Parse a `YYYY-MM-DD` Gregorian string into a Bikram Sambat date. */
export const isoToBs = (iso?: string | null): BsDate | null => {
  const ad = isoToAd(iso);
  if (!ad) return null;
  try {
    return adToBs(ad);
  } catch {
    return null;
  }
};

/** Serialise an AD date to a `YYYY-MM-DD` Gregorian string. */
export const adToIso = (ad: AdDate): string => `${ad.year}-${pad(ad.month)}-${pad(ad.day)}`;

/** Serialise a Bikram Sambat date to a `YYYY-MM-DD` Gregorian string. */
export const bsToIso = (bs: BsDate): string => adToIso(bsToAd(bs));

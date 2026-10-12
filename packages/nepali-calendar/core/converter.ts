/**
 * Bikram Sambat <-> Gregorian conversion.
 *
 * The algorithm counts whole days forward/backward from a single anchor
 * (1 Baisakh 2000 BS = 14 April 1943 AD). All arithmetic is done in UTC to keep
 * it immune to the host device's timezone and daylight-saving transitions.
 */
import {
  BS_MONTH_DATA,
  MAX_BS_YEAR,
  MIN_BS_YEAR,
  REFERENCE_AD,
} from './data/calendarData';
import type { AdDate, BsDate } from './types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** UTC milliseconds for the reference Gregorian date. */
const REFERENCE_AD_MS = Date.UTC(REFERENCE_AD.year, REFERENCE_AD.month - 1, REFERENCE_AD.day);

/** Number of days in a given BS month (month is 1-indexed). */
export const getBsMonthDays = (year: number, month: number): number => {
  const months = BS_MONTH_DATA[year];
  if (!months) {
    throw new RangeError(
      `Bikram Sambat year ${year} is outside the supported range ${MIN_BS_YEAR}-${MAX_BS_YEAR}.`
    );
  }
  if (month < 1 || month > 12) {
    throw new RangeError(`BS month must be between 1 and 12, received ${month}.`);
  }
  return months[month - 1];
};

/** Total number of days in a given BS year. */
export const getBsYearDays = (year: number): number => {
  const months = BS_MONTH_DATA[year];
  if (!months) {
    throw new RangeError(
      `Bikram Sambat year ${year} is outside the supported range ${MIN_BS_YEAR}-${MAX_BS_YEAR}.`
    );
  }
  return months.reduce((sum, days) => sum + days, 0);
};

/** Whole-day offset of a BS date from the reference (1 Baisakh 2000). */
const bsToDayOffset = (date: BsDate): number => {
  const { year, month, day } = date;
  if (year < MIN_BS_YEAR || year > MAX_BS_YEAR) {
    throw new RangeError(
      `Bikram Sambat year ${year} is outside the supported range ${MIN_BS_YEAR}-${MAX_BS_YEAR}.`
    );
  }

  let offset = 0;
  for (let y = MIN_BS_YEAR; y < year; y += 1) {
    offset += getBsYearDays(y);
  }
  for (let m = 1; m < month; m += 1) {
    offset += getBsMonthDays(year, m);
  }
  offset += day - 1;
  return offset;
};

/** Convert a Bikram Sambat date to its Gregorian (AD) equivalent. */
export const bsToAd = (date: BsDate): AdDate => {
  const offset = bsToDayOffset(date);
  const result = new Date(REFERENCE_AD_MS + offset * MS_PER_DAY);
  return {
    year: result.getUTCFullYear(),
    month: result.getUTCMonth() + 1,
    day: result.getUTCDate(),
  };
};

/** Convert a Gregorian (AD) date to its Bikram Sambat equivalent. */
export const adToBs = (date: AdDate): BsDate => {
  const targetMs = Date.UTC(date.year, date.month - 1, date.day);
  let remaining = Math.round((targetMs - REFERENCE_AD_MS) / MS_PER_DAY);

  if (remaining < 0) {
    throw new RangeError(
      `Gregorian date ${date.year}-${date.month}-${date.day} is before the supported range.`
    );
  }

  let year = MIN_BS_YEAR;
  while (year <= MAX_BS_YEAR) {
    const yearDays = getBsYearDays(year);
    if (remaining < yearDays) break;
    remaining -= yearDays;
    year += 1;
  }
  if (year > MAX_BS_YEAR) {
    throw new RangeError(
      `Gregorian date ${date.year}-${date.month}-${date.day} is after the supported range.`
    );
  }

  let month = 1;
  while (month <= 12) {
    const monthDays = getBsMonthDays(year, month);
    if (remaining < monthDays) break;
    remaining -= monthDays;
    month += 1;
  }

  return { year, month, day: remaining + 1 };
};

/** Weekday (0 = Sunday ... 6 = Saturday) for a Bikram Sambat date. */
export const getBsWeekday = (date: BsDate): number => {
  const ad = bsToAd(date);
  return new Date(Date.UTC(ad.year, ad.month - 1, ad.day)).getUTCDay();
};

/** Convert a JS Date (interpreted in local time) to a Bikram Sambat date. */
export const jsDateToBs = (input: Date): BsDate =>
  adToBs({ year: input.getFullYear(), month: input.getMonth() + 1, day: input.getDate() });

/** Convert a Bikram Sambat date to a JS Date at local midnight. */
export const bsToJsDate = (date: BsDate): Date => {
  const ad = bsToAd(date);
  return new Date(ad.year, ad.month - 1, ad.day);
};

/** Today's date expressed in Bikram Sambat. */
export const getTodayBs = (): BsDate => jsDateToBs(new Date());

/**
 * Small, side-effect-free helpers for working with Bikram Sambat dates:
 * equality checks, clamping, and month navigation. None of these touch the UI.
 */
import { getBsMonthDays } from './converter';
import { MAX_BS_YEAR, MIN_BS_YEAR } from './data/calendarData';
import type { BsDate } from './types';

/** True when two BS dates refer to the same calendar day. */
export const isSameBsDate = (a: BsDate | null | undefined, b: BsDate | null | undefined): boolean =>
  !!a && !!b && a.year === b.year && a.month === b.month && a.day === b.day;

/** True when two BS dates fall in the same month of the same year. */
export const isSameBsMonth = (a: BsDate, b: BsDate): boolean =>
  a.year === b.year && a.month === b.month;

/** Clamp a BS date's day so it never exceeds the length of its month. */
export const clampBsDay = (date: BsDate): BsDate => {
  const maxDay = getBsMonthDays(date.year, date.month);
  return { ...date, day: Math.min(Math.max(date.day, 1), maxDay) };
};

/**
 * Move a BS year/month pair by a number of months (positive or negative),
 * rolling over year boundaries. Results are clamped to the supported range.
 */
export const addBsMonths = (
  year: number,
  month: number,
  delta: number
): { year: number; month: number } => {
  // Work in a zero-indexed absolute month count, then convert back.
  const absolute = year * 12 + (month - 1) + delta;
  let nextYear = Math.floor(absolute / 12);
  let nextMonth = (absolute % 12) + 1;

  if (nextYear < MIN_BS_YEAR) {
    nextYear = MIN_BS_YEAR;
    nextMonth = 1;
  } else if (nextYear > MAX_BS_YEAR) {
    nextYear = MAX_BS_YEAR;
    nextMonth = 12;
  }
  return { year: nextYear, month: nextMonth };
};

/** True when navigating one month back stays within the supported range. */
export const canGoPrevMonth = (year: number, month: number): boolean =>
  !(year <= MIN_BS_YEAR && month <= 1);

/** True when navigating one month forward stays within the supported range. */
export const canGoNextMonth = (year: number, month: number): boolean =>
  !(year >= MAX_BS_YEAR && month >= 12);

/** Inclusive list of supported BS years, useful for year-picker dropdowns. */
export const getSupportedYears = (): number[] => {
  const years: number[] = [];
  for (let y = MIN_BS_YEAR; y <= MAX_BS_YEAR; y += 1) years.push(y);
  return years;
};

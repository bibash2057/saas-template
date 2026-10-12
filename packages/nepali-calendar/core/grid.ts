/**
 * Month-grid generation. Produces the 6x7 matrix of {@link CalendarDay} cells
 * that any UI layer can render directly — no React, no styling, just data.
 */
import { adToBs, bsToAd, getBsMonthDays, getBsWeekday, getTodayBs } from './converter';
import { addBsMonths } from './utils';
import type { AdDate, BsDate, CalendarDay, GenerateMonthGridOptions, MonthGrid } from './types';

const DAYS_IN_WEEK = 7;
const TOTAL_CELLS = 42; // 6 weeks * 7 days — a stable grid height.

const isSame = (a: BsDate, b: BsDate | null | undefined): boolean =>
  !!b && a.year === b.year && a.month === b.month && a.day === b.day;

/** Build a single calendar cell from a fully-resolved BS date. */
const buildDay = (
  bs: BsDate,
  isCurrentMonth: boolean,
  today: BsDate | null,
  selected: BsDate | null
): CalendarDay => {
  const ad = bsToAd(bs);
  const weekday = new Date(Date.UTC(ad.year, ad.month - 1, ad.day)).getUTCDay();
  return {
    bs,
    ad,
    weekday,
    isCurrentMonth,
    isToday: isSame(bs, today),
    isSelected: isSame(bs, selected),
    isWeekend: weekday === 6, // Saturday is the public holiday in Nepal.
  };
};

/**
 * Generate the displayable grid for a given BS year/month.
 *
 * When `fillAdjacent` is true (the default) the grid is padded to a full 42
 * cells using days from the previous and next months so every week row is
 * complete; those cells carry `isCurrentMonth: false`.
 */
export const generateMonthGrid = (
  year: number,
  month: number,
  options: GenerateMonthGridOptions = {}
): MonthGrid => {
  const { fillAdjacent = true, selected = null, today = getTodayBs() } = options;

  const daysInMonth = getBsMonthDays(year, month);
  const startWeekday = getBsWeekday({ year, month, day: 1 });

  const days: CalendarDay[] = [];

  // Leading cells from the previous month.
  if (fillAdjacent && startWeekday > 0) {
    const prev = addBsMonths(year, month, -1);
    const prevDays = getBsMonthDays(prev.year, prev.month);
    for (let i = startWeekday - 1; i >= 0; i -= 1) {
      const day = prevDays - i;
      days.push(buildDay({ year: prev.year, month: prev.month, day }, false, today, selected));
    }
  }

  // Current month cells.
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(buildDay({ year, month, day }, true, today, selected));
  }

  // Trailing cells from the next month, padding to a full 6-week grid.
  if (fillAdjacent) {
    const next = addBsMonths(year, month, 1);
    let nextDay = 1;
    while (days.length < TOTAL_CELLS) {
      days.push(buildDay({ year: next.year, month: next.month, day: nextDay }, false, today, selected));
      nextDay += 1;
    }
  }

  // Chunk the flat list into week rows for convenient row rendering.
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += DAYS_IN_WEEK) {
    weeks.push(days.slice(i, i + DAYS_IN_WEEK));
  }

  return { year, month, daysInMonth, startWeekday, days, weeks };
};

/** Resolve the BS month that contains a given Gregorian date. */
export const monthGridForAd = (
  adYear: number,
  adMonth: number,
  adDay: number,
  options?: GenerateMonthGridOptions
): MonthGrid => {
  const bs = adToBs({ year: adYear, month: adMonth, day: adDay });
  return generateMonthGrid(bs.year, bs.month, options);
};

const ZERO_BS: BsDate = { year: 0, month: 0, day: 0 };

const sameAd = (a: AdDate, b: AdDate | null | undefined): boolean =>
  !!b && a.year === b.year && a.month === b.month && a.day === b.day;

/** BS equivalent of an AD date, or a zero placeholder when out of range. */
const safeAdToBs = (ad: AdDate): BsDate => {
  try {
    return adToBs(ad);
  } catch {
    return ZERO_BS;
  }
};

/** Options accepted by {@link generateGregorianGrid}. */
export interface GenerateGregorianGridOptions {
  fillAdjacent?: boolean;
  selectedAd?: AdDate | null;
  todayAd?: AdDate | null;
}

/** Build a single Gregorian calendar cell from a resolved AD date. */
const buildAdDay = (
  ad: AdDate,
  isCurrentMonth: boolean,
  today: AdDate | null,
  selected: AdDate | null
): CalendarDay => {
  const weekday = new Date(Date.UTC(ad.year, ad.month - 1, ad.day)).getUTCDay();
  return {
    bs: safeAdToBs(ad),
    ad,
    weekday,
    isCurrentMonth,
    isToday: sameAd(ad, today),
    isSelected: sameAd(ad, selected),
    isWeekend: weekday === 6,
  };
};

/** Shift an AD `{ year, month }` (1-indexed month) by whole months. */
const shiftAdMonth = (year: number, month: number, delta: number): { year: number; month: number } => {
  const absolute = year * 12 + (month - 1) + delta;
  return { year: Math.floor(absolute / 12), month: (absolute % 12) + 1 };
};

const daysInAdMonth = (year: number, month: number): number =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

/**
 * Generate a standard Gregorian (English) month grid. Mirrors
 * {@link generateMonthGrid} but is driven by AD year/month so the calendar can
 * be viewed in the English system. Each cell still carries its BS equivalent.
 */
export const generateGregorianGrid = (
  year: number,
  month: number,
  options: GenerateGregorianGridOptions = {}
): MonthGrid => {
  const today =
    options.todayAd === undefined
      ? (() => {
          const now = new Date();
          return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        })()
      : options.todayAd;
  const selected = options.selectedAd ?? null;
  const fillAdjacent = options.fillAdjacent ?? true;

  const daysInMonth = daysInAdMonth(year, month);
  const startWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();

  const days: CalendarDay[] = [];

  if (fillAdjacent && startWeekday > 0) {
    const prev = shiftAdMonth(year, month, -1);
    const prevDays = daysInAdMonth(prev.year, prev.month);
    for (let i = startWeekday - 1; i >= 0; i -= 1) {
      days.push(buildAdDay({ year: prev.year, month: prev.month, day: prevDays - i }, false, today, selected));
    }
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(buildAdDay({ year, month, day }, true, today, selected));
  }

  if (fillAdjacent) {
    const next = shiftAdMonth(year, month, 1);
    let nextDay = 1;
    while (days.length < TOTAL_CELLS) {
      days.push(buildAdDay({ year: next.year, month: next.month, day: nextDay }, false, today, selected));
      nextDay += 1;
    }
  }

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += DAYS_IN_WEEK) {
    weeks.push(days.slice(i, i + DAYS_IN_WEEK));
  }

  return { year, month, daysInMonth, startWeekday, days, weeks };
};

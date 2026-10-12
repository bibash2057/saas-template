/**
 * Shared types for the headless Nepali Calendar (Bikram Sambat) core.
 *
 * This file is framework-agnostic — it contains only plain TypeScript types
 * and is safe to import from both the logic layer and the UI layer.
 */

/** A Bikram Sambat (BS) calendar date. Months are 1-indexed (1 = Baisakh). */
export interface BsDate {
  year: number;
  /** 1 = Baisakh ... 12 = Chaitra */
  month: number;
  /** Day of month, 1-indexed */
  day: number;
}

/** A Gregorian (AD) calendar date. Months are 1-indexed (1 = January). */
export interface AdDate {
  year: number;
  /** 1 = January ... 12 = December */
  month: number;
  /** Day of month, 1-indexed */
  day: number;
}

/** Language used when rendering labels and digits. */
export type CalendarLanguage = 'en' | 'np';

/** A single cell in the month grid produced by {@link generateMonthGrid}. */
export interface CalendarDay {
  /** The Bikram Sambat date this cell represents. */
  bs: BsDate;
  /** The equivalent Gregorian date. */
  ad: AdDate;
  /** Day-of-week index, 0 = Sunday ... 6 = Saturday. */
  weekday: number;
  /** True when the cell belongs to the month currently being displayed. */
  isCurrentMonth: boolean;
  /** True when the cell matches today's date. */
  isToday: boolean;
  /** True when the cell matches the externally selected date. */
  isSelected: boolean;
  /** True for Saturday — the public weekend in Nepal. */
  isWeekend: boolean;
}

/** A fully generated month, ready to be rendered by any UI layer. */
export interface MonthGrid {
  /** BS year of the displayed month. */
  year: number;
  /** BS month (1-indexed) of the displayed month. */
  month: number;
  /** Number of days in this BS month. */
  daysInMonth: number;
  /** Weekday index (0-6) on which the 1st of the month falls. */
  startWeekday: number;
  /**
   * Flat list of 42 cells (6 weeks * 7 days). Leading/trailing cells belong to
   * the adjacent months and carry `isCurrentMonth: false`.
   */
  days: CalendarDay[];
  /** The same cells chunked into weeks for convenient row rendering. */
  weeks: CalendarDay[][];
}

/** Options accepted by {@link generateMonthGrid}. */
export interface GenerateMonthGridOptions {
  /** Whether to pad the grid with leading/trailing days from sibling months. */
  fillAdjacent?: boolean;
  /** The currently selected BS date used to flag `isSelected`. */
  selected?: BsDate | null;
  /** The BS date treated as "today" used to flag `isToday`. Defaults to now. */
  today?: BsDate | null;
}

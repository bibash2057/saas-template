'use client';

/**
 * Headless calendar state hook.
 *
 * Owns the "currently displayed month" plus the selected date and exposes a
 * ready-to-render {@link MonthGrid} together with navigation callbacks and
 * localized labels. It renders nothing itself — a UI layer consumes this and
 * draws the cells however it likes.
 */
import { useCallback, useMemo, useState } from 'react';
import {
  generateMonthGrid,
  getTodayBs,
  GREGORIAN_MONTHS,
  NEPALI_MONTHS,
  formatNumber,
  bsToAd,
} from '../core';
import {
  addBsMonths,
  canGoNextMonth,
  canGoPrevMonth,
  clampBsDay,
} from '../core/utils';
import type { BsDate, CalendarLanguage, MonthGrid } from '../core/types';

/** Configuration for {@link useNepaliCalendar}. */
export interface UseNepaliCalendarOptions {
  /** Initially displayed/selected BS date. Defaults to today. */
  initialDate?: BsDate;
  /** Currently selected date (controlled mode). */
  value?: BsDate | null;
  /** Fires whenever the user picks a day. */
  onChange?: (date: BsDate) => void;
  /** Label language. Defaults to `'en'`. */
  language?: CalendarLanguage;
}

/** Everything a UI layer needs to render and drive a month view. */
export interface UseNepaliCalendarResult {
  /** The displayable grid for the visible month. */
  grid: MonthGrid;
  /** BS year currently shown. */
  year: number;
  /** BS month (1-indexed) currently shown. */
  month: number;
  /** The selected BS date, or null when nothing is selected. */
  selected: BsDate | null;
  /** Localized name of the visible BS month. */
  monthLabel: string;
  /** Localized year, using Devanagari digits when language is `'np'`. */
  yearLabel: string;
  /** Gregorian span covering the visible BS month, e.g. "Apr/May 2024". */
  gregorianLabel: string;
  /** Go to the previous month (no-op at the lower bound). */
  goPrevMonth: () => void;
  /** Go to the next month (no-op at the upper bound). */
  goNextMonth: () => void;
  /** Jump to an arbitrary BS year/month. */
  goToMonth: (year: number, month: number) => void;
  /** Jump the view back to today's month. */
  goToday: () => void;
  /** Select a specific BS date (also moves the view to its month). */
  selectDate: (date: BsDate) => void;
  /** Whether navigating back is possible. */
  canGoPrev: boolean;
  /** Whether navigating forward is possible. */
  canGoNext: boolean;
}

/** Build the "Apr/May 2024" style Gregorian hint for a BS month. */
const buildGregorianLabel = (year: number, month: number): string => {
  const start = bsToAd({ year, month, day: 1 });
  const next = addBsMonths(year, month, 1);
  const startName = GREGORIAN_MONTHS[start.month - 1].slice(0, 3);
  // The last day of the BS month maps to the AD month just before the next BS month's first day.
  const nextStart = bsToAd({ year: next.year, month: next.month, day: 1 });
  const endMs = new Date(Date.UTC(nextStart.year, nextStart.month - 1, nextStart.day - 1));
  const endName = GREGORIAN_MONTHS[endMs.getUTCMonth()].slice(0, 3);
  const endYear = endMs.getUTCFullYear();

  if (startName === endName) return `${startName} ${start.year}`;
  if (start.year === endYear) return `${startName}/${endName} ${start.year}`;
  return `${startName} ${start.year}/${endName} ${endYear}`;
};

export const useNepaliCalendar = (
  options: UseNepaliCalendarOptions = {}
): UseNepaliCalendarResult => {
  const { initialDate, value, onChange, language = 'en' } = options;

  const today = useMemo(() => getTodayBs(), []);
  const start = initialDate ?? value ?? today;

  const [view, setView] = useState<{ year: number; month: number }>({
    year: start.year,
    month: start.month,
  });

  // Internal selection used only in uncontrolled mode.
  const [internalSelected, setInternalSelected] = useState<BsDate | null>(
    initialDate ?? null
  );

  const isControlled = value !== undefined;
  const selected = isControlled ? value ?? null : internalSelected;

  const goToMonth = useCallback((y: number, m: number) => {
    const next = addBsMonths(y, m, 0);
    setView({ year: next.year, month: next.month });
  }, []);

  const goPrevMonth = useCallback(() => {
    setView((prev) => addBsMonths(prev.year, prev.month, -1));
  }, []);

  const goNextMonth = useCallback(() => {
    setView((prev) => addBsMonths(prev.year, prev.month, 1));
  }, []);

  const goToday = useCallback(() => {
    setView({ year: today.year, month: today.month });
  }, [today]);

  const selectDate = useCallback(
    (date: BsDate) => {
      const safe = clampBsDay(date);
      setView({ year: safe.year, month: safe.month });
      if (!isControlled) setInternalSelected(safe);
      onChange?.(safe);
    },
    [isControlled, onChange]
  );

  const grid = useMemo(
    () =>
      generateMonthGrid(view.year, view.month, {
        selected,
        today,
        fillAdjacent: true,
      }),
    [view.year, view.month, selected, today]
  );

  const monthLabel = NEPALI_MONTHS[language][view.month - 1];
  const yearLabel = formatNumber(view.year, language);
  const gregorianLabel = useMemo(
    () => buildGregorianLabel(view.year, view.month),
    [view.year, view.month]
  );

  return {
    grid,
    year: view.year,
    month: view.month,
    selected,
    monthLabel,
    yearLabel,
    gregorianLabel,
    goPrevMonth,
    goNextMonth,
    goToMonth,
    goToday,
    selectDate,
    canGoPrev: canGoPrevMonth(view.year, view.month),
    canGoNext: canGoNextMonth(view.year, view.month),
  };
};

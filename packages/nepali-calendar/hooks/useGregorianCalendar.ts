'use client';

/**
 * Headless Gregorian (English) calendar state hook — the AD counterpart to
 * {@link useNepaliCalendar}. Owns the displayed AD month plus the selected AD
 * date and exposes a ready-to-render {@link MonthGrid} with navigation and
 * labels. Renders nothing itself.
 *
 * Navigation is bounded to the AD range that maps inside the BS dataset so that
 * every cell's BS equivalent stays resolvable.
 */
import { useCallback, useMemo, useState } from 'react';
import { generateGregorianGrid, GREGORIAN_MONTHS } from '../core';
import type { AdDate, MonthGrid } from '../core/types';

/** Inclusive AD navigation bounds (kept within the BS dataset's coverage). */
export const AD_MIN_YEAR = 1944;
export const AD_MAX_YEAR = 2030;

export interface UseGregorianCalendarOptions {
  /** Currently selected AD date (controlled). */
  value?: AdDate | null;
  /** Fires whenever the user picks a day. */
  onChange?: (date: AdDate) => void;
}

export interface UseGregorianCalendarResult {
  grid: MonthGrid;
  year: number;
  month: number;
  selected: AdDate | null;
  monthLabel: string;
  yearLabel: string;
  goPrevMonth: () => void;
  goNextMonth: () => void;
  goToMonth: (year: number, month: number) => void;
  selectDate: (date: AdDate) => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

const todayAd = (): AdDate => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
};

/** Shift/clamp an AD year/month pair by a number of months. */
const shift = (year: number, month: number, delta: number): { year: number; month: number } => {
  const absolute = year * 12 + (month - 1) + delta;
  let y = Math.floor(absolute / 12);
  let m = (absolute % 12) + 1;
  if (y < AD_MIN_YEAR) {
    y = AD_MIN_YEAR;
    m = 1;
  } else if (y > AD_MAX_YEAR) {
    y = AD_MAX_YEAR;
    m = 12;
  }
  return { year: y, month: m };
};

export const useGregorianCalendar = (
  options: UseGregorianCalendarOptions = {}
): UseGregorianCalendarResult => {
  const { value, onChange } = options;

  const start = value ?? todayAd();
  const [view, setView] = useState<{ year: number; month: number }>({
    year: start.year,
    month: start.month,
  });

  const selected = value ?? null;

  const goToMonth = useCallback((y: number, m: number) => {
    setView(shift(y, m, 0));
  }, []);

  const goPrevMonth = useCallback(() => {
    setView((prev) => shift(prev.year, prev.month, -1));
  }, []);

  const goNextMonth = useCallback(() => {
    setView((prev) => shift(prev.year, prev.month, 1));
  }, []);

  const selectDate = useCallback(
    (date: AdDate) => {
      setView({ year: date.year, month: date.month });
      onChange?.(date);
    },
    [onChange]
  );

  const grid = useMemo(
    () => generateGregorianGrid(view.year, view.month, { selectedAd: selected }),
    [view.year, view.month, selected]
  );

  return {
    grid,
    year: view.year,
    month: view.month,
    selected,
    monthLabel: GREGORIAN_MONTHS[view.month - 1],
    yearLabel: String(view.year),
    goPrevMonth,
    goNextMonth,
    goToMonth,
    selectDate,
    canGoPrev: !(view.year <= AD_MIN_YEAR && view.month <= 1),
    canGoNext: !(view.year >= AD_MAX_YEAR && view.month >= 12),
  };
};

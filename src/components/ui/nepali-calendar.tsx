import { cn } from "cn";
import {
  adToBs,
  adToIso,
  isoToAd,
  isoToBs,
  AD_MIN_YEAR,
  AD_MAX_YEAR,
  formatNumber,
  NEPALI_MONTHS,
  WEEKDAYS_SHORT,
  GREGORIAN_MONTHS,
  type CalendarDay,
  useNepaliCalendar,
  getSupportedYears,
  useGregorianCalendar,
} from "nepali-calendar";
import * as React from "react";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { useGeneralSettings } from "@/page/settings/general/store/useGeneralSettings";
import { todayIso } from "@/lib/formatDate";

export interface NepaliCalendarProps {
  value?: string | null;
  onSelect: (iso: string) => void;
  autoFocus?: boolean;
  calendar?: "bs" | "ad";
  className?: string;
}

const AD_YEARS: number[] = Array.from(
  { length: AD_MAX_YEAR - AD_MIN_YEAR + 1 },
  (_, i) => AD_MIN_YEAR + i,
);

export function NepaliCalendar({
  value,
  onSelect,
  autoFocus,
  calendar,
  className,
}: NepaliCalendarProps) {
  const mainCalendar = useGeneralSettings((s) => s.calendar);
  const mainLanguage = useGeneralSettings((s) => s.calendarLanguage);

  const [tempIsBs, setTempIsBs] = React.useState(mainCalendar === "BS");
  const [language, setLanguage] = React.useState(mainLanguage);
  React.useEffect(() => setTempIsBs(mainCalendar === "BS"), [mainCalendar]);
  React.useEffect(() => setLanguage(mainLanguage), [mainLanguage]);
  const toggleLanguage = () => setLanguage((l) => (l === "np" ? "en" : "np"));

  const selectedBs = React.useMemo(() => isoToBs(value), [value]);
  const selectedAd = React.useMemo(() => isoToAd(value), [value]);

  const bs = useNepaliCalendar({ value: selectedBs, language });
  const ad = useGregorianCalendar({ value: selectedAd });
  const locked = calendar !== undefined;
  const isBs = locked ? calendar === "bs" : tempIsBs;
  const active = isBs ? bs : ad;

  const gridRef = React.useRef<HTMLDivElement>(null);
  const [focusIso, setFocusIso] = React.useState<string>(
    () => value || todayIso(),
  );

  React.useEffect(() => {
    if (value) setFocusIso(value);
  }, [value]);

  React.useEffect(() => {
    if (!autoFocus && !gridRef.current?.contains(document.activeElement))
      return;
    const el = gridRef.current?.querySelector<HTMLButtonElement>(
      `[data-iso="${focusIso}"]`,
    );
    el?.focus();
  }, [focusIso, active.year, active.month]);

  const moveViewTo = React.useCallback(
    (iso: string) => {
      const nextAd = isoToAd(iso);
      if (!nextAd) return;
      if (isBs) {
        const b = adToBs(nextAd);
        bs.goToMonth(b.year, b.month);
      } else {
        ad.goToMonth(nextAd.year, nextAd.month);
      }
    },
    [isBs, bs, ad],
  );

  const pick = React.useCallback(
    (cell: CalendarDay) => {
      const iso = adToIso(cell.ad);
      setFocusIso(iso);
      onSelect(iso);
      moveViewTo(iso);
    },
    [onSelect, moveViewTo],
  );

  const shiftFocus = React.useCallback(
    (deltaDays: number, deltaMonths = 0) => {
      const base = isoToAd(focusIso) ?? isoToAd(todayIso())!;
      const d = new Date(
        Date.UTC(base.year, base.month - 1 + deltaMonths, base.day + deltaDays),
      );
      const nextAd = {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
      };
      if (isBs) {
        try {
          adToBs(nextAd);
        } catch {
          return;
        }
      } else if (nextAd.year < AD_MIN_YEAR || nextAd.year > AD_MAX_YEAR) {
        return;
      }
      const iso = adToIso(nextAd);
      setFocusIso(iso);
      moveViewTo(iso);
    },
    [focusIso, isBs, moveViewTo],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        shiftFocus(-1);
        break;
      case "ArrowRight":
        e.preventDefault();
        shiftFocus(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        shiftFocus(-7);
        break;
      case "ArrowDown":
        e.preventDefault();
        shiftFocus(7);
        break;
      case "PageUp":
        e.preventDefault();
        shiftFocus(0, -1);
        break;
      case "PageDown":
        e.preventDefault();
        shiftFocus(0, 1);
        break;
      case "Enter":
      case " ": {
        e.preventDefault();
        const cell = active.grid.days.find((c) => adToIso(c.ad) === focusIso);
        if (cell) pick(cell);
        break;
      }
      default:
        break;
    }
  };

  const monthNames = isBs ? NEPALI_MONTHS[language] : GREGORIAN_MONTHS;
  const years = isBs ? getSupportedYears() : AD_YEARS;
  const weekdayLabels = WEEKDAYS_SHORT[isBs ? language : "en"];

  const yearLabel = (y: number): string =>
    isBs ? formatNumber(y, language) : String(y);

  const monthItems = monthNames.map((name, i) => ({
    value: String(i + 1),
    label: name,
  }));
  const yearItems = years.map((y) => ({
    value: String(y),
    label: yearLabel(y),
  }));

  return (
    <div className={cn("w-full select-none p-3", className)}>
      {(!locked || isBs) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {locked ? (
            <span />
          ) : (
            <div className="inline-flex rounded-sm border border-input p-0.5">
              <button
                type="button"
                onClick={() => setTempIsBs(true)}
                className={cn(
                  "rounded px-2 py-0.5 text-xs font-medium transition-colors",
                  isBs
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                BS
              </button>
              <button
                type="button"
                onClick={() => setTempIsBs(false)}
                className={cn(
                  "rounded px-2 py-0.5 text-xs font-medium transition-colors",
                  !isBs
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                AD
              </button>
            </div>
          )}
          {isBs && (
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              title="Toggle language"
            >
              <Globe className="size-3.5" />
              {language === "np" ? "नेपाली" : "EN"}
            </button>
          )}
        </div>
      )}

      <div className="mb-2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={active.goPrevMonth}
          disabled={!active.canGoPrev}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </button>

        <Select
          items={monthItems}
          value={String(active.month)}
          onValueChange={(v) => v && active.goToMonth(active.year, Number(v))}
        >
          <SelectTrigger className="h-8 flex-1 px-2 text-xs" aria-label="Month">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} className="max-h-64">
            {monthItems.map((m) => (
              <SelectItem key={m.value} value={m.value} className="text-xs">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={yearItems}
          value={String(active.year)}
          onValueChange={(v) => v && active.goToMonth(Number(v), active.month)}
        >
          <SelectTrigger
            className="h-8 w-[4.75rem] shrink-0 px-2 text-xs"
            aria-label="Year"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            alignItemWithTrigger={false}
            className="max-h-64 min-w-20"
          >
            {yearItems.map((y) => (
              <SelectItem key={y.value} value={y.value} className="text-xs">
                {y.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="button"
          onClick={active.goNextMonth}
          disabled={!active.canGoNext}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40"
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {isBs && (
        <p className="mb-2 text-center text-[11px] text-muted-foreground">
          {bs.gregorianLabel}
        </p>
      )}

      <div className="mb-1 grid grid-cols-7">
        {weekdayLabels.map((wd, i) => (
          <div
            key={i}
            className={cn(
              "py-1 text-center text-[11px] font-medium",
              i === 6 ? "text-destructive/70" : "text-muted-foreground",
            )}
          >
            {wd}
          </div>
        ))}
      </div>

      <div
        ref={gridRef}
        role="grid"
        onKeyDown={handleKeyDown}
        className="grid grid-cols-7 gap-0.5"
      >
        {active.grid.days.map((cell) => {
          const iso = adToIso(cell.ad);
          const dayNum = isBs ? cell.bs.day : cell.ad.day;
          const isFocusTarget = iso === focusIso;
          return (
            <button
              key={iso}
              type="button"
              role="gridcell"
              data-iso={iso}
              tabIndex={isFocusTarget ? 0 : -1}
              aria-selected={cell.isSelected}
              aria-current={cell.isToday ? "date" : undefined}
              onClick={() => pick(cell)}
              className={cn(
                "flex h-9 items-center justify-center rounded-sm text-sm tabular-nums transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !cell.isCurrentMonth && "text-muted-foreground/40",
                cell.isCurrentMonth && cell.isWeekend && "text-destructive/80",
                cell.isCurrentMonth && !cell.isWeekend && "text-foreground",
                !cell.isSelected &&
                  "hover:bg-accent hover:text-accent-foreground",
                cell.isToday &&
                  !cell.isSelected &&
                  "font-semibold ring-1 ring-inset ring-primary/40",
                cell.isSelected &&
                  "bg-primary font-semibold text-primary-foreground hover:bg-primary/90",
              )}
            >
              {isBs ? formatNumber(dayNum, language) : dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}

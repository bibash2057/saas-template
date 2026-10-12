import * as React from "react";
import { CalendarDays } from "lucide-react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NepaliCalendar } from "@/components/ui/nepali-calendar";
import { useFormatDate } from "@/lib/formatDate";
import { cn } from "cn";

interface BaseProps {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  align?: "start" | "center" | "end";
  calendar?: "bs" | "ad";
}

interface ControlledProps extends BaseProps {
  value: string | null | undefined;
  onChange: (value: string) => void;
  control?: undefined;
  name?: undefined;
}

interface RhfProps extends BaseProps {
  control: Control<any>;
  name: string;
  value?: undefined;
  onChange?: undefined;
}

type NepaliDatePickerProps = ControlledProps | RhfProps;

function useDisplayText(
  value: string | null | undefined,
  calendar?: "bs" | "ad",
): string {
  const fmt = useFormatDate();
  if (!value) return "";
  return fmt(
    value,
    calendar ? { calendar: calendar === "bs" ? "BS" : "AD" } : undefined,
  );
}

function DateTrigger({
  value,
  onChange,
  placeholder = "Select date",
  disabled,
  className,
  align = "start",
  calendar,
}: {
  value: string | null | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  align?: "start" | "center" | "end";
  calendar?: "bs" | "ad";
}) {
  const [open, setOpen] = React.useState(false);
  const displayText = useDisplayText(value, calendar);

  const handleSelect = React.useCallback(
    (iso: string) => {
      onChange(iso);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-sm border border-input bg-card px-3 py-2 text-sm shadow-xs transition-[border-color,box-shadow] duration-150",
          "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25",
          "disabled:cursor-not-allowed disabled:opacity-50 data-popup-open:border-ring data-popup-open:ring-2 data-popup-open:ring-ring/25",
          className,
        )}
      >
        <span
          className={cn(
            "truncate",
            displayText ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {displayText || placeholder}
        </span>
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align={align}
        sideOffset={6}
        className={cn(
          "p-0 overflow-y-auto outline-none",
          "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        )}
      >
        <NepaliCalendar
          value={value}
          onSelect={handleSelect}
          calendar={calendar}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function NepaliDatePicker(props: NepaliDatePickerProps) {
  const { placeholder, disabled, className, align, calendar } = props;

  if (props.control === undefined) {
    return (
      <DateTrigger
        value={props.value}
        onChange={props.onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        align={align}
        calendar={calendar}
      />
    );
  }

  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field }) => (
        <DateTrigger
          value={field.value ?? ""}
          onChange={field.onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
          align={align}
          calendar={calendar}
        />
      )}
    />
  );
}

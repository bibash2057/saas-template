import React from "react";
import { Search } from "lucide-react";
import DebouncedInput from "#components/common/DebouncedInput";
import { Kbd } from "#components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#components/ui/tooltip";
import { DataTableHelp } from "./DataTableHelp";

interface DataTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}

export const DataTableToolbar = ({
  search,
  onSearchChange,
  placeholder = "Search...",
  children,
}: DataTableToolbarProps) => {
  const searchWrapRef = React.useRef<HTMLDivElement>(null);
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);

  React.useEffect(() => {
    const isEditableTarget = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        el.isContentEditable
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditableTarget(event.target)) return;

      const input = searchWrapRef.current?.querySelector("input");
      if (!input) return;

      event.preventDefault();
      input.focus();
      input.select?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const shortcutHidden = isSearchFocused || search.length > 0;

  return (
    <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div ref={searchWrapRef} className="relative w-full sm:w-64">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <DebouncedInput
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(value: string | number) => onSearchChange(String(value))}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="h-9 pr-10 pl-9"
        />
        <Tooltip>
          <TooltipTrigger
            render={
              <span
                aria-hidden="true"
                className={[
                  "absolute top-1/2 right-2 -translate-y-1/2 transition-opacity",
                  shortcutHidden ? "opacity-0" : "opacity-100",
                ].join(" ")}
              >
                <Kbd>/</Kbd>
              </span>
            }
          />
          <TooltipContent side="top">
            <span className="flex items-center gap-1.5">
              Press <Kbd>/</Kbd> to focus search
            </span>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {children}
        <DataTableHelp />
      </div>
    </div>
  );
};

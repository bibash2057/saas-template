import { CircleHelp } from "lucide-react";
import { Button } from "#components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "#components/ui/tooltip";

const HELP_ITEMS: [string, string][] = [
  [
    "Reorder columns",
    "Drag a column header left or right. Pinned columns can't be moved.",
  ],
  [
    "Resize columns",
    "Drag the line on a header's right edge. The table scrolls sideways when it gets wider than the screen.",
  ],
  [
    "Pin columns",
    "Right-click a header → Pin to start / end. Pinned columns stay visible while you scroll sideways.",
  ],
  [
    "Pin rows",
    "Right-click a row → Pin to top / bottom. Pinned rows stay visible while you scroll the page.",
  ],
  ["Show / hide columns", "Right-click a header or row → Columns."],
  [
    "Reset layout",
    "Right-click → Reset layout (order, visibility, pins and widths).",
  ],
];

export const DataTableHelp = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground"
            aria-label="How to use this table"
          />
        }
      >
        <CircleHelp className="size-4" />
      </TooltipTrigger>

      <TooltipContent
        side="bottom"
        align="end"
        className="block max-w-sm space-y-2 border bg-popover px-3 py-2.5 text-left text-popover-foreground shadow-md [&>div:last-child]:hidden"
      >
        <p className="text-sm font-medium">Advanced tips</p>
        <ul className="space-y-1.5">
          {HELP_ITEMS.map(([title, text]) => (
            <li key={title} className="text-xs leading-snug">
              <span className="font-semibold">{title}: </span>
              {text}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          On touch screens, press and hold a row or header to open its menu.
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

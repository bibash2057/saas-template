import React from "react";
import type { RowData, Table as TanTable } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUp,
  PinOff,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "../ui/button";
import type { features } from "../../lib/table/tableFeatures";

interface ColumnSettingsProps<TData extends RowData> {
  table: TanTable<typeof features, TData>;
}

const ColumnSettings = <TData extends RowData>({
  table,
}: ColumnSettingsProps<TData>) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const columns = table.getAllLeafColumns();

  const move = (index: number, direction: -1 | 1) => {
    const ids = columns.map((c) => c.id);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    table.setColumnOrder(ids);
  };

  const reset = () => {
    table.resetColumnOrder();
    table.resetColumnVisibility();
    table.resetColumnPinning();
    table.resetColumnSizing();
  };

  const labelOf = (column: (typeof columns)[number]) => {
    const header = column.columnDef.header;
    return typeof header === "string" && header ? header : column.id;
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Column settings"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <SlidersHorizontal className="size-4" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-md border bg-popover p-2 text-popover-foreground shadow-md">
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="text-sm font-medium">Columns</span>
            <Button variant="ghost" size="sm" onClick={reset}>
              Reset
            </Button>
          </div>
          <ul className="max-h-80 space-y-0.5 overflow-auto">
            {columns.map((column, index) => {
              const pinned = column.getIsPinned();
              return (
                <li
                  key={column.id}
                  className="flex items-center gap-1 rounded px-2 py-1 hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={column.getIsVisible()}
                    disabled={!column.getCanHide()}
                    onChange={column.getToggleVisibilityHandler()}
                    aria-label={`Toggle ${labelOf(column)}`}
                  />
                  <span className="flex-1 truncate pl-1 text-sm">
                    {labelOf(column)}
                  </span>

                  {column.getCanPin() &&
                    (pinned ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Unpin"
                        onClick={() => column.pin(false)}
                      >
                        <PinOff className="size-3.5" />
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          title="Pin to start"
                          onClick={() => column.pin("start")}
                        >
                          <ArrowLeftToLine className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          title="Pin to end"
                          onClick={() => column.pin("end")}
                        >
                          <ArrowRightToLine className="size-3.5" />
                        </Button>
                      </>
                    ))}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    title="Move up"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUp className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    title="Move down"
                    disabled={index === columns.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown className="size-3.5" />
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ColumnSettings;

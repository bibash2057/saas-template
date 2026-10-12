import React from "react";
import { flexRender, type Header, type RowData } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/react/sortable";
import { RestrictToHorizontalAxis } from "@dnd-kit/abstract/modifiers";
import { ArrowDown, ArrowUp, Pin } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "#components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "#components/ui/context-menu";
import { HeaderMenuItems } from "./DataTableMenu";
import type { DataTableInstance } from "../../lib/table/types";
import type { features } from "../../lib/table/tableFeatures";
import { useColumnLayout } from "../../lib/table/columnScale";
import {
  HEADER_HEIGHT,
  MIN_COLUMN_WIDTH,
  columnCssKey,
  columnLabel,
  getColumnStyle,
  getColumnWidth,
  selectCellStyle,
} from "../../lib/table/utils";

const SORT_TRANSITION = {
  duration: 250,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
};

interface DraggableHeaderCellProps<TData extends RowData> {
  table: DataTableInstance<TData>;
  header: Header<typeof features, TData, unknown>;
  index: number;
  tableRef: React.RefObject<HTMLElement | null>;
  alignRight: boolean;
}

const DraggableHeaderCell = <TData extends RowData>({
  table,
  header,
  index,
  tableRef,
  alignRight,
}: DraggableHeaderCellProps<TData>) => {
  const column = header.column;
  const pinned = column.getIsPinned();
  const sorted = column.getIsSorted();
  const layout = useColumnLayout();
  const [isResizing, setIsResizing] = React.useState(false);

  const isPinnedStart = pinned === "start";
  const isPinnedEnd = pinned === "end";
  const isLastPinnedStart = isPinnedStart && column.getIsLastColumn("start");
  const isFirstPinnedEnd = isPinnedEnd && column.getIsFirstColumn("end");

  const { ref, handleRef, isDragSource } = useSortable({
    id: column.id,
    index,
    disabled: !!pinned,
    modifiers: [RestrictToHorizontalAxis],
    transition: SORT_TRANSITION,
  });

  React.useLayoutEffect(() => {
    const el = tableRef.current;
    if (!el) return;

    const key = `--do-${columnCssKey(column.id)}`;
    if (isDragSource) {
      el.style.setProperty(key, "0.45");
    } else {
      el.style.removeProperty(key);
    }

    return () => {
      el.style.removeProperty(key);
    };
  }, [isDragSource, column.id, tableRef]);

  const canResize = column.getCanResize();

  const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startWidth = getColumnWidth(column, layout);

    table.setColumnSizing((prev) => {
      const next = { ...prev };
      for (const c of table.getVisibleLeafColumns()) {
        next[c.id] = Math.round(getColumnWidth(c, layout));
      }
      return next;
    });

    const onMove = (event: PointerEvent) => {
      const width = Math.max(
        MIN_COLUMN_WIDTH,
        startWidth + (event.clientX - startX),
      );
      table.setColumnSizing((prev) => ({ ...prev, [column.id]: width }));
    };

    const onEnd = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
      setIsResizing(false);
    };

    setIsResizing(true);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
  };

  const pinnedSurface = pinned
    ? "bg-sidebar-primary-foreground group-hover:bg-primary/10 data-[popup-open]:bg-primary/10"
    : "bg-muted";

  const pinnedEdge = isLastPinnedStart
    ? "shadow-[inset_-1px_0_0_0_var(--color-border),4px_0_8px_-4px_rgba(0,0,0,0.08)]"
    : isFirstPinnedEnd
      ? "shadow-[inset_1px_0_0_0_var(--color-border),-4px_0_8px_-4px_rgba(0,0,0,0.08)]"
      : "";

  return (
    <TableHead
      ref={ref}
      colSpan={header.colSpan}
      style={getColumnStyle(column, true, layout)}
      data-pinned={pinned ?? undefined}
      className={`group relative h-11 select-none p-0 text-sm font-medium text-foreground ${pinnedSurface} ${pinnedEdge} ${
        isDragSource ? "shadow-lg" : ""
      }`}
    >
      <ContextMenu>
        <ContextMenuTrigger
          render={
            <div className="flex h-11 w-full items-center px-4 data-[popup-open]:bg-accent" />
          }
        >
          <div
            ref={handleRef}
            onClick={(e) => {
              if (column.getCanSort()) column.getToggleSortingHandler()?.(e);
            }}
            className={`flex min-w-0 flex-1 items-center gap-1 overflow-hidden ${
              alignRight ? "justify-end" : ""
            } ${pinned ? "" : "cursor-grab active:cursor-grabbing"}`}
          >
            {pinned && (
              <Pin
                aria-hidden="true"
                className={`size-3 shrink-0 text-primary/70`}
              />
            )}
            <span className="truncate">
              {flexRender(header.column.columnDef.header, header.getContext())}
            </span>
            {sorted === "asc" ? (
              <ArrowUp className="size-3 shrink-0" />
            ) : sorted === "desc" ? (
              <ArrowDown className="size-3 shrink-0" />
            ) : null}
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-56">
          <HeaderMenuItems table={table} column={column} />
        </ContextMenuContent>
      </ContextMenu>

      {canResize && (
        <div
          onPointerDown={startResize}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          title="Drag to resize column"
          aria-label={`Resize ${columnLabel(column)} column`}
          className={`absolute right-0 top-0 z-20 flex h-full w-3 cursor-col-resize touch-none select-none items-center justify-center ${
            isResizing ? "bg-primary/10" : ""
          }`}
        >
          <span
            className={`h-5 w-px rounded-full transition-colors ${
              isResizing ? "bg-primary" : "bg-border"
            }`}
          />
        </div>
      )}
    </TableHead>
  );
};

interface DataTableHeaderProps<TData extends RowData> {
  table: DataTableInstance<TData>;
  tableRef: React.RefObject<HTMLElement | null>;
  rightAlignedColumns: string[];
}

export const DataTableHeader = <TData extends RowData>({
  table,
  tableRef,
  rightAlignedColumns,
}: DataTableHeaderProps<TData>) => {
  const layout = useColumnLayout();
  const allPageSelected = table.getIsAllPageRowsSelected();
  const somePageSelected =
    table.getIsSomePageRowsSelected() && !allPageSelected;

  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          style={{ height: HEADER_HEIGHT }}
          className="hover:bg-transparent"
        >
          <TableHead
            style={selectCellStyle(true)}
            className="h-11 bg-muted px-4"
          >
            <Checkbox
              aria-label="Select all rows on this page"
              checked={allPageSelected}
              indeterminate={somePageSelected}
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          </TableHead>

          {headerGroup.headers.map((header, index) =>
            header.isPlaceholder ? (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                style={getColumnStyle(header.column, true, layout)}
                className="h-11 bg-muted px-4"
              />
            ) : (
              <DraggableHeaderCell
                key={header.id}
                table={table}
                header={header}
                index={index}
                tableRef={tableRef}
                alignRight={rightAlignedColumns.includes(header.column.id)}
              />
            ),
          )}
        </TableRow>
      ))}
    </TableHeader>
  );
};

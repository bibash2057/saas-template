import React from "react";
import { flexRender, type RowData } from "@tanstack/react-table";
import { Pin } from "lucide-react";
import { TableBody, TableCell, TableRow } from "../ui/table";
import { Checkbox } from "#components/ui/checkbox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "#components/ui/context-menu";
import { Skeleton } from "#components/ui/skeleton";
import { RowMenuItems } from "./DataTableMenu";
import type {
  DataTableInstance,
  DataTableRowInstance,
} from "../../lib/table/types";
import { useColumnLayout } from "../../lib/table/columnScale";
import {
  ROW_HEIGHT,
  getColumnStyle,
  getDisplayColumns,
  selectCellStyle,
} from "../../lib/table/utils";

interface DataTableRowProps<TData extends RowData> {
  table: DataTableInstance<TData>;
  row: DataTableRowInstance<TData>;
  rightAlignedColumns: string[];
}

const DataTableRow = <TData extends RowData>({
  table,
  row,
  rightAlignedColumns,
}: DataTableRowProps<TData>) => {
  const layout = useColumnLayout();
  const pinned = row.getIsPinned();

  const [menuCellId, setMenuCellId] = React.useState<string | null>(null);

  const displayIds = getDisplayColumns(table).map((c) => c.id);
  const cells = [...row.getVisibleCells()].sort(
    (a, b) => displayIds.indexOf(a.column.id) - displayIds.indexOf(b.column.id),
  );

  const rowPinnedShadow =
    pinned === "top"
      ? "shadow-[inset_0_-1px_0_0_var(--color-border),0_4px_8px_-4px_rgba(0,0,0,0.08)]"
      : pinned === "bottom"
        ? "shadow-[inset_0_1px_0_0_var(--color-border),0_-4px_8px_-4px_rgba(0,0,0,0.08)]"
        : "";

  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={
          <TableRow
            style={{ height: ROW_HEIGHT }}
            className={
              pinned
                ? `hover:bg-sidebar-primary-foreground/80 ${rowPinnedShadow}`
                : "bg-background hover:bg-muted data-[popup-open]:bg-muted"
            }
          />
        }
      >
        <TableCell
          style={selectCellStyle(false)}
          onContextMenu={() => setMenuCellId(null)}
          className={
            pinned
              ? "bg-sidebar-primary-foreground px-4 py-0"
              : "bg-inherit px-4 py-0"
          }
        >
          <Checkbox
            aria-label="Select row"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        </TableCell>

        {cells.map((cell, cellIndex) => {
          const isPinnedStart = cell.column.getIsPinned() === "start";
          const isPinnedEnd = cell.column.getIsPinned() === "end";
          const isLastPinnedStart =
            isPinnedStart && cell.column.getIsLastColumn("start");
          const isFirstPinnedEnd =
            isPinnedEnd && cell.column.getIsFirstColumn("end");

          const pinnedEdge = isLastPinnedStart
            ? "shadow-[inset_-1px_0_0_0_var(--color-border),4px_0_8px_-4px_rgba(0,0,0,0.08)]"
            : isFirstPinnedEnd
              ? "shadow-[inset_1px_0_0_0_var(--color-border),-4px_0_8px_-4px_rgba(0,0,0,0.08)]"
              : "";

          return (
            <TableCell
              key={cell.id}
              style={getColumnStyle(cell.column, false, layout)}
              onContextMenu={() => setMenuCellId(cell.id)}
              className={`overflow-hidden px-4 py-0 text-sm ${
                pinned ? "bg-sidebar-primary-foreground" : "bg-inherit"
              } ${
                rightAlignedColumns.includes(cell.column.id) ? "text-right" : ""
              } ${pinnedEdge}`}
            >
              <div className="flex min-w-0 items-center gap-2">
                {cellIndex === 0 && pinned && (
                  <span
                    className="flex shrink-0 items-center text-primary"
                    title={
                      pinned === "top" ? "Pinned to top" : "Pinned to bottom"
                    }
                    aria-label={
                      pinned === "top" ? "Pinned to top" : "Pinned to bottom"
                    }
                  >
                    <Pin
                      className={`size-3.5 ${
                        pinned === "bottom" ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                )}

                <div className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              </div>
            </TableCell>
          );
        })}
      </ContextMenuTrigger>

      <ContextMenuContent className="w-56">
        <RowMenuItems
          table={table}
          row={row}
          cell={cells.find((c) => c.id === menuCellId)}
        />
      </ContextMenuContent>
    </ContextMenu>
  );
};

const SkeletonRows = <TData extends RowData>({
  table,
  count,
}: {
  table: DataTableInstance<TData>;
  count: number;
}) => {
  const layout = useColumnLayout();
  const visibleColumns = getDisplayColumns(table);

  return (
    <>
      {Array.from({ length: count }, (_, r) => (
        <TableRow
          key={r}
          style={{ height: ROW_HEIGHT }}
          className="bg-background hover:bg-background"
        >
          <TableCell
            style={selectCellStyle(false)}
            className="bg-inherit px-4 py-0"
          >
            <Skeleton className="size-4 rounded-[4px]" />
          </TableCell>
          {visibleColumns.map((column, c) => {
            const isPinnedStart = column.getIsPinned() === "start";
            const isPinnedEnd = column.getIsPinned() === "end";
            const isLastPinnedStart =
              isPinnedStart && column.getIsLastColumn("start");
            const isFirstPinnedEnd =
              isPinnedEnd && column.getIsFirstColumn("end");

            const pinnedEdge = isLastPinnedStart
              ? "shadow-[inset_-1px_0_0_0_var(--color-border),4px_0_8px_-4px_rgba(0,0,0,0.08)]"
              : isFirstPinnedEnd
                ? "shadow-[inset_1px_0_0_0_var(--color-border),-4px_0_8px_-4px_rgba(0,0,0,0.08)]"
                : "";

            return (
              <TableCell
                key={column.id}
                style={getColumnStyle(column, false, layout)}
                className={`px-4 py-0 ${
                  isPinnedStart || isPinnedEnd
                    ? "bg-sidebar-primary-foreground/40"
                    : "bg-inherit"
                } ${pinnedEdge}`}
              >
                <Skeleton
                  className="h-4"
                  style={{ width: `${55 + ((r * 7 + c * 13) % 35)}%` }}
                />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
};

export type DataTableSection = "top" | "center" | "bottom";

interface DataTableBodyProps<TData extends RowData> {
  table: DataTableInstance<TData>;
  section: DataTableSection;
  isLoading: boolean;
  pageSize: number;
  rightAlignedColumns: string[];
}

export const DataTableBody = <TData extends RowData>({
  table,
  section,
  isLoading,
  pageSize,
  rightAlignedColumns,
}: DataTableBodyProps<TData>) => {
  const renderRow = (row: DataTableRowInstance<TData>) => (
    <DataTableRow
      key={row.id}
      table={table}
      row={row}
      rightAlignedColumns={rightAlignedColumns}
    />
  );

  if (section === "top") {
    return <TableBody>{table.getTopRows().map(renderRow)}</TableBody>;
  }
  if (section === "bottom") {
    return <TableBody>{table.getBottomRows().map(renderRow)}</TableBody>;
  }

  const centerRows = table.getCenterRows();
  const totalRows =
    table.getTopRows().length +
    centerRows.length +
    table.getBottomRows().length;

  return (
    <TableBody>
      {isLoading ? (
        <SkeletonRows table={table} count={Math.min(pageSize, 10)} />
      ) : centerRows.length ? (
        centerRows.map(renderRow)
      ) : totalRows === 0 ? (
        <TableRow>
          <TableCell
            colSpan={table.getVisibleLeafColumns().length + 1}
            className="h-24 text-center text-muted-foreground"
          >
            No Data Found.
          </TableCell>
        </TableRow>
      ) : null}
    </TableBody>
  );
};

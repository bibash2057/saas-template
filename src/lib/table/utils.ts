import type React from "react";
import type { RowData } from "@tanstack/react-table";
import type { DataTableColumnInstance, DataTableInstance } from "./types";
import { DEFAULT_COLUMN_LAYOUT } from "./columnScale";
import type { ColumnLayout } from "./columnScale";

export const HEADER_HEIGHT = 43;
export const ROW_HEIGHT = 48;
export const SELECT_WIDTH = 48;
export const MIN_COLUMN_WIDTH = 60;
export const PAGE_SIZES = [5, 10, 20, 50, 100];
export const DEFAULT_COLUMN_SIZE = 150;

export const columnLabel = <TData extends RowData>(
  column: DataTableColumnInstance<TData>,
) => {
  const header = column.columnDef.header;
  return typeof header === "string" && header ? header : column.id;
};

export const cellText = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

export const copyText = (text: string) => {
  void navigator.clipboard?.writeText(text);
};

export const columnCssKey = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, "_");

export const getColumnWidth = <TData extends RowData>(
  column: DataTableColumnInstance<TData>,
  layout: ColumnLayout,
) =>
  column.getSize() * layout.scale +
  (column.id === layout.lastColumnId ? layout.extraWidth : 0);

export const getColumnStyle = <TData extends RowData>(
  column: DataTableColumnInstance<TData>,
  isHeader: boolean,
  layout: ColumnLayout = DEFAULT_COLUMN_LAYOUT,
): React.CSSProperties => {
  const pinned = column.getIsPinned();
  const style: React.CSSProperties = {
    width: getColumnWidth(column, layout),
  };

  if (pinned === "start") {
    style.position = "sticky";
    style.insetInlineStart =
      column.getStart("start") * layout.scale + SELECT_WIDTH;
  } else if (pinned === "end") {
    style.position = "sticky";
    style.insetInlineEnd = column.getAfter("end") * layout.scale;
  }

  if (isHeader) {
    style.position = "sticky";
    style.top = 0;
    style.zIndex = pinned ? 30 : 20;
  } else {
    style.opacity = `var(--do-${columnCssKey(column.id)}, 1)`;
    style.transition = "opacity 150ms ease";
    if (pinned) style.zIndex = 10;
  }
  return style;
};

export const selectCellStyle = (isHeader: boolean): React.CSSProperties => ({
  width: SELECT_WIDTH,
  position: "sticky",
  insetInlineStart: 0,
  ...(isHeader ? { top: 0, zIndex: 35 } : { zIndex: 12 }),
});

export const getDisplayColumns = <TData extends RowData>(
  table: DataTableInstance<TData>,
) => {
  const groups = table.getHeaderGroups();
  const lastGroup = groups[groups.length - 1];
  return (lastGroup?.headers ?? [])
    .filter((header) => !header.isPlaceholder)
    .map((header) => header.column);
};

import React from "react";
import { useTable } from "@tanstack/react-table";
import type { PaginationState, RowData } from "@tanstack/react-table";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import {
  KeyboardSensor,
  PointerActivationConstraints,
  PointerSensor,
} from "@dnd-kit/dom";
import { DataTableBody } from "./DataTableBody";
import { DataTableHeader } from "./DataTableHeader";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";
import { features } from "../../lib/table/tableFeatures";
import type { DataTableColumn, DataTableInstance } from "../../lib/table/types";
import {
  DEFAULT_COLUMN_SIZE,
  SELECT_WIDTH,
  getColumnWidth,
  getDisplayColumns,
} from "../../lib/table/utils";
import {
  ColumnLayoutContext,
  useColumnLayout,
} from "../../lib/table/columnScale";
import type { ColumnLayout } from "../../lib/table/columnScale";

export { features };
export type { DataTableColumn };

const SENSORS = [
  PointerSensor.configure({
    activationConstraints(event) {
      if (event.pointerType === "touch") {
        return [
          new PointerActivationConstraints.Delay({ value: 250, tolerance: 5 }),
        ];
      }
      return [new PointerActivationConstraints.Distance({ value: 5 })];
    },
  }),
  KeyboardSensor,
];

const HIDDEN_SCROLLBAR =
  "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const ColGroup = <TData extends RowData>({
  table,
}: {
  table: DataTableInstance<TData>;
}) => {
  const layout = useColumnLayout();
  return (
    <colgroup>
      <col style={{ width: SELECT_WIDTH }} />
      {getDisplayColumns(table).map((column) => (
        <col
          key={column.id}
          style={{ width: getColumnWidth(column, layout) }}
        />
      ))}
    </colgroup>
  );
};

interface DataTableProps<TData extends RowData> {
  data: TData[];
  columns: DataTableColumn<TData>[];
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  isLoading?: boolean;
  getRowId?: (row: TData) => string;
  searchPlaceholder?: string;
  rightAlignedColumns?: string[];
  toolbarRight?: React.ReactNode;
}

const DataTable = <TData extends RowData>({
  data,
  columns,
  rowCount,
  pagination,
  onPaginationChange,
  globalFilter,
  onGlobalFilterChange,
  isLoading = false,
  getRowId,
  searchPlaceholder = "Search...",
  rightAlignedColumns = [],
  toolbarRight,
}: DataTableProps<TData>) => {
  const table = useTable({
    features,
    columns,
    data,
    getRowId,

    manualPagination: true,
    manualFiltering: true,
    rowCount,
    state: { pagination, globalFilter },
    onPaginationChange,
    onGlobalFilterChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(globalFilter) : updater;
      onGlobalFilterChange(String(next ?? ""));
      onPaginationChange((prev) => ({ ...prev, pageIndex: 0 }));
    },
  });

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    setContainerWidth(el.clientWidth);
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(Math.floor(entry.contentRect.width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const visibleColumns = getDisplayColumns(table);
  const totalSize = visibleColumns.reduce(
    (sum, column) => sum + column.getSize(),
    0,
  );
  const naturalWidth = totalSize + SELECT_WIDTH;
  const isCustomSized = visibleColumns.some(
    (column) =>
      column.getSize() !== (column.columnDef.size ?? DEFAULT_COLUMN_SIZE),
  );
  const hasFreeSpace = containerWidth > 0 && containerWidth > naturalWidth;

  const columnLayout: ColumnLayout = {
    scale:
      hasFreeSpace && !isCustomSized && totalSize > 0
        ? (containerWidth - SELECT_WIDTH) / totalSize
        : 1,
    extraWidth:
      hasFreeSpace && isCustomSized ? containerWidth - naturalWidth : 0,
    lastColumnId: visibleColumns[visibleColumns.length - 1]?.id ?? null,
  };

  const tableStyle: React.CSSProperties = {
    width: hasFreeSpace ? "100%" : naturalWidth,
    tableLayout: "fixed",
  };

  const headRef = React.useRef<HTMLDivElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const syncScroll = (source: HTMLElement) => {
    const x = source.scrollLeft;
    for (const ref of [headRef, bodyRef, bottomRef]) {
      const el = ref.current;
      if (el && el !== source && Math.abs(el.scrollLeft - x) > 0.5) {
        el.scrollLeft = x;
      }
    }
  };

  React.useLayoutEffect(() => {
    if (bodyRef.current) syncScroll(bodyRef.current);
  });

  const reorderColumns = (initialIndex: number, index: number) => {
    if (initialIndex === index) return;

    const fullOrder = table.getAllLeafColumns().map((column) => column.id);
    const displayIds = getDisplayColumns(table).map((column) => column.id);

    const moved = [...displayIds];
    const [item] = moved.splice(initialIndex, 1);
    if (item === undefined) return;
    moved.splice(index, 0, item);

    const visibleSet = new Set(displayIds);
    let next = 0;
    table.setColumnOrder(
      fullOrder.map((id) => (visibleSet.has(id) ? moved[next++] : id)),
    );
  };

  const hasTopRows = table.getTopRows().length > 0;
  const hasBottomRows = table.getBottomRows().length > 0;

  return (
    <div className="my-3 rounded-sm border bg-card text-card-foreground">
      <DataTableToolbar
        search={globalFilter}
        onSearchChange={(value) => table.setGlobalFilter(value)}
        placeholder={searchPlaceholder}
      >
        {toolbarRight}
      </DataTableToolbar>

      <div ref={containerRef} className="relative w-full min-w-0">
        <ColumnLayoutContext.Provider value={columnLayout}>
          <DragDropProvider
            sensors={SENSORS}
            onDragEnd={(event) => {
              if (event.canceled) return;

              const { source } = event.operation;

              if (isSortable(source)) {
                reorderColumns(source.initialIndex, source.index);
              }
            }}
          >
            <div
              ref={headRef}
              onScroll={(e) => syncScroll(e.currentTarget)}
              className={`sticky top-0 z-30 bg-background ${HIDDEN_SCROLLBAR}`}
            >
              <table className="caption-bottom text-sm" style={tableStyle}>
                <ColGroup table={table} />
                <DataTableHeader
                  table={table}
                  tableRef={containerRef}
                  rightAlignedColumns={rightAlignedColumns}
                />
                {hasTopRows && (
                  <DataTableBody
                    table={table}
                    section="top"
                    isLoading={isLoading}
                    pageSize={pagination.pageSize}
                    rightAlignedColumns={rightAlignedColumns}
                  />
                )}
              </table>
            </div>

            <div
              ref={bodyRef}
              onScroll={(e) => syncScroll(e.currentTarget)}
              className="overflow-x-auto"
            >
              <table className="caption-bottom text-sm" style={tableStyle}>
                <ColGroup table={table} />
                <DataTableBody
                  table={table}
                  section="center"
                  isLoading={isLoading}
                  pageSize={pagination.pageSize}
                  rightAlignedColumns={rightAlignedColumns}
                />
              </table>
            </div>

            {hasBottomRows && (
              <div
                ref={bottomRef}
                onScroll={(e) => syncScroll(e.currentTarget)}
                className={`sticky bottom-0 z-30 bg-background ${HIDDEN_SCROLLBAR}`}
              >
                <table className="caption-bottom text-sm" style={tableStyle}>
                  <ColGroup table={table} />
                  <DataTableBody
                    table={table}
                    section="bottom"
                    isLoading={isLoading}
                    pageSize={pagination.pageSize}
                    rightAlignedColumns={rightAlignedColumns}
                  />
                </table>
              </div>
            )}
          </DragDropProvider>
        </ColumnLayoutContext.Provider>
      </div>

      <DataTablePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        pageCount={table.getPageCount()}
        rowCount={rowCount}
        onPageChange={(pageIndex) => table.setPageIndex(pageIndex)}
        onPageSizeChange={(pageSize) => table.setPageSize(pageSize)}
      />
    </div>
  );
};

export default DataTable;

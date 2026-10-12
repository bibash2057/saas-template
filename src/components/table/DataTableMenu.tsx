import React from "react";
import type { RowData } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightToLine,
  ArrowUp,
  ArrowUpToLine,
  Braces,
  Check,
  Columns3,
  Copy,
  EyeOff,
  MoveHorizontal,
  PinOff,
  RotateCcw,
  X,
} from "lucide-react";
import {
  ContextMenuCheckboxItem,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "#components/ui/context-menu";
import type {
  DataTableCellInstance,
  DataTableColumnInstance,
  DataTableInstance,
  DataTableRowInstance,
} from "../../lib/table/types";
import { cellText, columnLabel, copyText } from "../../lib/table/utils";

const MenuAction = ({
  icon: Icon,
  label,
  onClick,
  disabled,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) => (
  <ContextMenuItem className="gap-2" disabled={disabled} onClick={onClick}>
    <Icon className="size-4" />
    <span className="flex-1 truncate">{label}</span>
    {active && <Check className="size-4 text-primary" />}
  </ContextMenuItem>
);

export const TableMenuItems = <TData extends RowData>({
  table,
}: {
  table: DataTableInstance<TData>;
}) => {
  const leafColumns = table.getAllLeafColumns();

  return (
    <>
      <ContextMenuSub>
        <ContextMenuSubTrigger className="gap-2">
          <Columns3 className="size-4" />
          Columns
        </ContextMenuSubTrigger>
        <ContextMenuSubContent className="max-h-80 w-56 overflow-auto">
          <ContextMenuItem
            closeOnClick={false}
            onClick={() => leafColumns.forEach((c) => c.toggleVisibility(true))}
          >
            Show all columns
          </ContextMenuItem>
          <ContextMenuSeparator />
          {leafColumns.map((column) => (
            <ContextMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              disabled={!column.getCanHide()}
              closeOnClick={false}
              onCheckedChange={() => column.toggleVisibility()}
            >
              {columnLabel(column)}
            </ContextMenuCheckboxItem>
          ))}
        </ContextMenuSubContent>
      </ContextMenuSub>

      <MenuAction
        icon={RotateCcw}
        label="Reset layout"
        onClick={() => {
          table.resetColumnOrder();
          table.resetColumnVisibility();
          table.resetColumnPinning();
          table.resetColumnSizing();
        }}
      />
    </>
  );
};

export const HeaderMenuItems = <TData extends RowData>({
  table,
  column,
}: {
  table: DataTableInstance<TData>;
  column: DataTableColumnInstance<TData>;
}) => {
  const ids = table.getAllLeafColumns().map((c) => c.id);
  const index = ids.indexOf(column.id);
  const sorted = column.getIsSorted();
  const pinned = column.getIsPinned();

  const move = (direction: -1 | 1) => {
    const next = [...ids];
    const target = index + direction;
    [next[index], next[target]] = [next[target], next[index]];
    table.setColumnOrder(next);
  };

  // Every value of this column on the current page, one per line, in the order shown
  const copyColumn = () => {
    const rows = [
      ...table.getTopRows(),
      ...table.getCenterRows(),
      ...table.getBottomRows(),
    ];
    copyText(rows.map((row) => cellText(row.getValue(column.id))).join("\n"));
  };

  return (
    <>
      <ContextMenuGroup>
        <ContextMenuLabel className="truncate">
          {columnLabel(column)}
        </ContextMenuLabel>
      </ContextMenuGroup>

      {column.getCanSort() && (
        <>
          <MenuAction
            icon={ArrowUp}
            label="Sort ascending"
            active={sorted === "asc"}
            onClick={() => column.toggleSorting(false)}
          />
          <MenuAction
            icon={ArrowDown}
            label="Sort descending"
            active={sorted === "desc"}
            onClick={() => column.toggleSorting(true)}
          />
          <MenuAction
            icon={X}
            label="Clear sort"
            disabled={!sorted}
            onClick={() => column.clearSorting()}
          />
          <ContextMenuSeparator />
        </>
      )}

      {column.getCanPin() && (
        <>
          {pinned !== "start" && (
            <MenuAction
              icon={ArrowLeftToLine}
              label="Pin to start"
              onClick={() => column.pin("start")}
            />
          )}
          {pinned !== "end" && (
            <MenuAction
              icon={ArrowRightToLine}
              label="Pin to end"
              onClick={() => column.pin("end")}
            />
          )}
          {pinned && (
            <MenuAction
              icon={PinOff}
              label="Unpin column"
              onClick={() => column.pin(false)}
            />
          )}
          <ContextMenuSeparator />
        </>
      )}

      <MenuAction
        icon={ArrowLeft}
        label="Move left"
        disabled={index <= 0}
        onClick={() => move(-1)}
      />
      <MenuAction
        icon={ArrowRight}
        label="Move right"
        disabled={index === -1 || index >= ids.length - 1}
        onClick={() => move(1)}
      />
      {column.getCanResize() && (
        <MenuAction
          icon={MoveHorizontal}
          label="Reset width"
          onClick={() => column.resetSize()}
        />
      )}
      {column.getCanHide() && (
        <MenuAction
          icon={EyeOff}
          label="Hide column"
          onClick={() => column.toggleVisibility(false)}
        />
      )}

      <ContextMenuSeparator />
      <MenuAction icon={Copy} label="Copy column" onClick={copyColumn} />

      <ContextMenuSeparator />
      <TableMenuItems table={table} />
    </>
  );
};

export const RowMenuItems = <TData extends RowData>({
  table,
  row,
  cell,
}: {
  table: DataTableInstance<TData>;
  row: DataTableRowInstance<TData>;
  /** the cell that was right-clicked (undefined when the checkbox cell was clicked) */
  cell?: DataTableCellInstance<TData>;
}) => {
  const pinned = row.getIsPinned();

  return (
    <>
      <ContextMenuGroup>
        <ContextMenuLabel>Row</ContextMenuLabel>
      </ContextMenuGroup>

      {pinned !== "top" && (
        <MenuAction
          icon={ArrowUpToLine}
          label="Pin to top"
          onClick={() => row.pin("top")}
        />
      )}
      {pinned !== "bottom" && (
        <MenuAction
          icon={ArrowDownToLine}
          label="Pin to bottom"
          onClick={() => row.pin("bottom")}
        />
      )}
      {pinned && (
        <MenuAction
          icon={PinOff}
          label="Unpin row"
          onClick={() => row.pin(false)}
        />
      )}

      <ContextMenuSeparator />
      {cell && (
        <MenuAction
          icon={Copy}
          label={`Copy cell (${columnLabel(cell.column)})`}
          onClick={() => copyText(cellText(cell.getValue()))}
        />
      )}
      {/* tab-separated, so it pastes into one row of a spreadsheet */}
      <MenuAction
        icon={Copy}
        label="Copy row"
        onClick={() =>
          copyText(
            row
              .getVisibleCells()
              .map((c) => cellText(c.getValue()))
              .join("\t"),
          )
        }
      />
      <MenuAction
        icon={Braces}
        label="Copy row as JSON"
        onClick={() => copyText(JSON.stringify(row.original, null, 2))}
      />

      <ContextMenuSeparator />
      <TableMenuItems table={table} />
    </>
  );
};

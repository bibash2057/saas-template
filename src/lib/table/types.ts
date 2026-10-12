import type {
  Cell,
  Column,
  ColumnDef,
  Row,
  RowData,
  Table,
} from "@tanstack/react-table";
import type { features } from "./tableFeatures";

export type DataTableColumn<TData extends RowData> = ColumnDef<
  typeof features,
  TData
>;

export type DataTableInstance<TData extends RowData> = Table<
  typeof features,
  TData
>;
export type DataTableColumnInstance<TData extends RowData> = Column<
  typeof features,
  TData,
  unknown
>;
export type DataTableRowInstance<TData extends RowData> = Row<
  typeof features,
  TData
>;
export type DataTableCellInstance<TData extends RowData> = Cell<
  typeof features,
  TData,
  unknown
>;

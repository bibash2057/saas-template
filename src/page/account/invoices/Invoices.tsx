import React from "react";
import { useTranslation } from "react-i18next";
import type { PaginationState } from "@tanstack/react-table";

import { PageHeader } from "#components/common/PageHeader";
import DataTable from "#components/table/DataTable";
import type { DataTableColumn } from "#components/table/DataTable";
import { Button } from "#components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";

import { FileText, MoreHorizontal, Plus } from "lucide-react";
import { useIntlFormat } from "@/lib/intl";
import { formatDate } from "@/lib/formatDate";
import { useGeneralSettings } from "@/page/settings/general/store/useGeneralSettings";
import useFetch from "#hooks/useFetch";

type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Draft";

type Invoice = {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: InvoiceStatus;
  dueAt: string;
};

/* -------------------------------------------------------------------------- */
/* Fake backend (simulated loading + server-side pagination/search/filter)    */
/* -------------------------------------------------------------------------- */

const CUSTOMERS = [
  "Acme Corp",
  "Globex Ltd",
  "Initech",
  "Umbrella Inc",
  "Stark Industries",
  "Wayne Enterprises",
  "Hooli",
  "Pied Piper",
  "Wonka Industries",
  "Cyberdyne",
];

const STATUSES: InvoiceStatus[] = ["Paid", "Pending", "Overdue", "Draft"];

const DB: Invoice[] = Array.from({ length: 53 }, (_, index) => {
  const customer = CUSTOMERS[index % CUSTOMERS.length];
  return {
    id: `INV-${1001 + index}`,
    customer,
    email: `billing@${customer.toLowerCase().replace(/[^a-z]/g, "")}.com`,
    amount:
      Math.round((300 + ((index * 7919) % 9000) + (index % 100) / 100) * 100) /
      100,
    status: STATUSES[index % STATUSES.length],
    dueAt: `2026-10-${String((index % 28) + 1).padStart(2, "0")}`,
  };
});

type InvoicesResponse = { rows: Invoice[]; rowCount: number };

const fetchInvoices = ({
  pageIndex,
  pageSize,
  search,
  status,
}: {
  pageIndex: number;
  pageSize: number;
  search: string;
  status: string;
}): Promise<InvoicesResponse> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const query = search.trim().toLowerCase();

      const filtered = DB.filter(
        (invoice) =>
          (status === "all" || invoice.status === status) &&
          (!query ||
            [invoice.id, invoice.customer, invoice.email, invoice.status].some(
              (value) => value.toLowerCase().includes(query),
            )),
      );

      const start = pageIndex * pageSize;
      resolve({
        rows: filtered.slice(start, start + pageSize),
        rowCount: filtered.length,
      });
    }, 600);
  });

/* -------------------------------------------------------------------------- */
/* Columns                                                                    */
/* -------------------------------------------------------------------------- */

const statusStyles: Record<InvoiceStatus, string> = {
  Paid: "bg-emerald-500",
  Pending: "bg-amber-500",
  Overdue: "bg-red-500",
  Draft: "bg-gray-500",
};

/** Columns live in a hook: headers/cells need `t` and the active locale. */
const useInvoiceColumns = (): DataTableColumn<Invoice>[] => {
  const { t } = useTranslation("invoices");
  const { currency } = useIntlFormat();
  const calendar = useGeneralSettings((s) => s.calendar);
  const dateFormat = useGeneralSettings((s) => s.dateFormat);
  const calendarLanguage = useGeneralSettings((s) => s.calendarLanguage);

  return React.useMemo<DataTableColumn<Invoice>[]>(
    () => [
      {
        accessorKey: "customer",
        header: t("columns.customer"),
        size: 240,
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md border bg-muted/40">
              <FileText className="size-3.5 text-muted-foreground" />
            </div>
            <span className="truncate font-medium">
              {row.original.customer}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "id",
        header: t("columns.invoice"),
        size: 130,
        cell: (info) => (
          <span className="font-mono text-xs text-muted-foreground">
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: t("columns.email"),
        size: 240,
        cell: (info) => (
          <span className="text-muted-foreground">
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "amount",
        header: t("columns.amount"),
        size: 130,
        cell: (info) => currency(info.getValue<number>(), "USD"),
      },
      {
        accessorKey: "status",
        header: t("columns.status"),
        size: 130,
        cell: (info) => {
          const status = info.getValue<InvoiceStatus>();
          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium text-white ${statusStyles[status]}`}
            >
              <span className="size-1.5 rounded-full bg-white" />
              {t(`status.${status}`)}
            </span>
          );
        },
      },
      {
        accessorKey: "dueAt",
        header: t("columns.due"),
        size: 140,
        cell: (info) => (
          <span className="text-muted-foreground">
            {formatDate(info.getValue<string>(), {
              calendar,
              dateFormat,
              calendarLanguage,
            })}
          </span>
        ),
      },
      {
        id: "actions",
        header: t("columns.actions"),
        size: 120,
        enableHiding: false,
        enableResizing: false,
        cell: () => (
          <div className="flex items-center gap-2">
            <MoreHorizontal size={16} />
          </div>
        ),
      },
    ],
    [t, currency, calendar, dateFormat, calendarLanguage],
  );
};

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

const Invoices = () => {
  const { t } = useTranslation("invoices");
  const columns = useInvoiceColumns();

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");

  const [rows, setRows] = React.useState<Invoice[]>([]);
  const [rowCount, setRowCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetchInvoices({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search,
      status,
    }).then((response) => {
      if (cancelled) return;
      setRows(response.rows);
      setRowCount(response.rowCount);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [pagination.pageIndex, pagination.pageSize, search, status]);

  // value -> label, so the Select trigger shows "All statuses" instead of "all"
  const statusItems = React.useMemo<Record<string, string>>(
    () => ({
      all: t("filters.allStatuses"),
      ...Object.fromEntries(STATUSES.map((s) => [s, t(`status.${s}`)])),
    }),
    [t],
  );

  const handleStatusChange = (value: string | null) => {
    if (!value) return;
    setStatus(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const { data } = useFetch<any>("/users", ["users"]);
  const { data: datas } = useFetch<any[]>(
    "/plans",
    ["plans"],
    {},
    { scope: "main" },
  );

  return (
    <>
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Button className="gap-2">
            <Plus className="size-4" />
            {t("create")}
          </Button>
        }
      />

      <DataTable
        data={rows}
        columns={columns}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        globalFilter={search}
        onGlobalFilterChange={handleSearchChange}
        isLoading={isLoading}
        getRowId={(row) => row.id}
        searchPlaceholder={t("searchPlaceholder")}
        toolbarRight={
          <Select
            value={status}
            onValueChange={handleStatusChange}
            items={statusItems}
          >
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder={t("filters.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
              {STATUSES.map((value) => (
                <SelectItem key={value} value={value}>
                  {t(`status.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
    </>
  );
};

export default Invoices;

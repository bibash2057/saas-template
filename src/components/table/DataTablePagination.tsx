import { useTranslation } from "react-i18next";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "#components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";
import { PAGE_SIZES } from "../../lib/table/utils";

type PageItem = number | "ellipsis-start" | "ellipsis-end";

const getPageItems = (current: number, total: number): PageItem[] => {
  const visible = new Set<number>([
    1,
    total,
    current - 1,
    current,
    current + 1,
  ]);
  const pages = [...visible]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];
  pages.forEach((page, i) => {
    const previous = pages[i - 1];
    if (previous !== undefined) {
      const gap = page - previous;
      if (gap === 2) items.push(previous + 1);
      else if (gap > 2) {
        items.push(previous < current ? "ellipsis-start" : "ellipsis-end");
      }
    }
    items.push(page);
  });
  return items;
};

interface DataTablePaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  rowCount: number;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const DataTablePagination = ({
  pageIndex,
  pageSize,
  pageCount,
  rowCount,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) => {
  const { t } = useTranslation("table");
  const totalPages = Math.max(1, pageCount);
  const currentPage = pageIndex + 1;
  const canPrevious = pageIndex > 0;
  const canNext = currentPage < totalPages;

  const from = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, rowCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-sm">
      <div className="flex items-center gap-4 text-muted-foreground">
        <span>{t("pagination.summary", { from, to, count: rowCount })}</span>
        <div className="flex items-center gap-2">
          <span>{t("pagination.rowsPerPage")}</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              if (value) onPageSizeChange(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[72px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(pageIndex - 1)}
              aria-disabled={!canPrevious}
              className={
                canPrevious
                  ? "cursor-pointer"
                  : "pointer-events-none opacity-50"
              }
            />
          </PaginationItem>

          {getPageItems(currentPage, totalPages).map((item) =>
            typeof item === "number" ? (
              <PaginationItem key={item}>
                <PaginationLink
                  isActive={item === currentPage}
                  onClick={() => onPageChange(item - 1)}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationEllipsis />
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(pageIndex + 1)}
              aria-disabled={!canNext}
              className={
                canNext ? "cursor-pointer" : "pointer-events-none opacity-50"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

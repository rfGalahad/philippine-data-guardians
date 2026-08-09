import { useMemo } from "react";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

export interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

//-----------------------------------------------------------
// HELPERS
//-----------------------------------------------------------

function buildPageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const keep = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...keep].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("ellipsis");
    result.push(p);
    prev = p;
  }
  return result;
}

//-----------------------------------------------------------
// TABLE PAGINATION
//-----------------------------------------------------------

export default function TablePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className = "",
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const clampedPage = Math.min(Math.max(page, 1), totalPages);

  const rangeStart = totalItems === 0 ? 0 : (clampedPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(clampedPage * pageSize, totalItems);

  const pageList = useMemo(() => buildPageList(clampedPage, totalPages), [clampedPage, totalPages]);

  const goTo = (p: number) => {
    if (p < 1 || p > totalPages || p === clampedPage) return;
    onPageChange(p);
  };

  return (
    <div
      className={[
        "flex flex-wrap items-center justify-between gap-4 border-t border-field-border bg-surface-light px-5 py-4",
        className,
      ].join(" ")}
    >
      <p className="text-sm text-text-secondary">
        {totalItems === 0 ? (
          "No records"
        ) : (
          <>
            Showing <span className="text-text-primary">{rangeStart}–{rangeEnd}</span> of{" "}
            <span className="text-text-primary">{totalItems}</span>
          </>
        )}
      </p>

      <div className="flex items-center gap-4">
        {onPageSizeChange && (
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            Rows per page
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-md border border-field-border bg-surface-light px-2 py-1.5 text-sm text-text-primary transition-colors duration-200 focus:border-accent focus:outline-none"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        )}

        <nav className="flex items-center gap-1" aria-label="Pagination">
          <button
            type="button"
            onClick={() => goTo(clampedPage - 1)}
            disabled={clampedPage === 1}
            aria-label="Previous page"
            className="rounded-md px-2.5 py-1.5 text-sm text-text-secondary transition-colors duration-200 hover:text-accent-2 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ‹
          </button>

          {pageList.map((p, i) =>
            p === "ellipsis" ? (
              <span key={`e-${i}`} className="px-1.5 text-sm text-text-muted">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => goTo(p)}
                aria-current={p === clampedPage ? "page" : undefined}
                className={[
                  "cursor-pointer min-w-8 rounded-md px-2.5 py-1.5 text-sm transition-colors duration-200",
                  "hover:text-text-primary hover:bg-surface-light-2",
                  p === clampedPage
                    ? "bg-surface-light-2 font-bold text-text-primary"
                    : "text-text-secondary hover:text-primary",
                ].join(" ")}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => goTo(clampedPage + 1)}
            disabled={clampedPage === totalPages}
            aria-label="Next page"
            className="rounded-md px-2.5 py-1.5 text-sm text-text-secondary transition-colors duration-200 hover:text-accent-2 disabled:cursor-not-allowed disabled:opacity-30"
          >
            ›
          </button>
        </nav>
      </div>
    </div>
  );
}
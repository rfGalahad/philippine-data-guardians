import { useMemo, useState, type ReactNode } from "react";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

type SortDirection = "asc" | "desc" | null;

export type Align = "left" | "center" | "right";

export interface Column<T> {
  /** Unique id for the column; also used to read the cell value if no render/sortAccessor is given. */
  key: string;
  /** Column header label. */
  header: string;
  /** Custom cell renderer. Falls back to row[key]. */
  render?: (row: T, rowIndex: number) => ReactNode;
  /** Value used for sorting. Falls back to row[key]. */
  sortAccessor?: (row: T) => string | number;
  /** Whether this column can be sorted by clicking its header. */
  sortable?: boolean;
  /** Text alignment for header + cells. Defaults to "left". */
  align?: Align;
  /** Optional fixed width, e.g. "12rem". */
  width?: string;
  /** Hide on small screens (useful for dense tables on mobile). */
  hideOnMobile?: boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string | number;
  caption?: string;
  emptyMessage?: string;
  dense?: boolean;
  striped?: boolean;
  onRowClick?: (row: T, index: number) => void;
  footer?: ReactNode;
  defaultSort?: { key: string; direction: "asc" | "desc" };
  selectable?: boolean;
  selectedKeys?: Set<string | number>;
  onSelectionChange?: (keys: Set<string | number>) => void;
  loading?: boolean;
  error?: string | null;
  sort?: { key: string; direction: SortDirection };
  onSortChange?: (key: string) => void;
}

//-----------------------------------------------------------
// HELPERS
//-----------------------------------------------------------

function cellValue<T>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

const alignClass: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function SortIcon({ direction }: { direction: SortDirection }) {
  return (
    <span className="ml-1.5 inline-flex flex-col align-middle leading-none">
      <svg
        width="8"
        height="6"
        viewBox="0 0 8 6"
        className={`mb-0.5 transition-colors duration-200 ${
          direction === "asc" ? "fill-accent" : "fill-current opacity-30"
        }`}
      >
        <path d="M4 0L8 6H0L4 0Z" />
      </svg>
      <svg
        width="8"
        height="6"
        viewBox="0 0 8 6"
        className={`transition-colors duration-200 ${
          direction === "desc" ? "fill-accent" : "fill-current opacity-30"
        }`}
      >
        <path d="M4 6L0 0H8L4 6Z" />
      </svg>
    </span>
  );
}

function RowCheckbox({
  checked,
  indeterminate = false,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      ref={(el) => {
        if (el) el.indeterminate = indeterminate;
      }}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      aria-label={label}
      className="h-3.5 w-3.5 accent-accent"
    />
  );
}

//-----------------------------------------------------------
// CUSTOM TABLE
//-----------------------------------------------------------

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  caption,
  emptyMessage = "No records to show.",
  dense = false,
  onRowClick,
  footer,
  defaultSort,
  sort: controlledSort,
  onSortChange,
  selectable = false,
  selectedKeys,
  onSelectionChange,
  loading = false,
  error = null
}: TableProps<T>) {

  const [internalSort, setInternalSort] = useState<{ key: string; direction: SortDirection }>({
    key: defaultSort?.key ?? "",
    direction: defaultSort?.direction ?? null,
  });

  const isControlled = controlledSort !== undefined;
  const sort = isControlled ? controlledSort! : internalSort;

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    if (isControlled) {
      onSortChange?.(col.key);
      return;
    }
    setInternalSort((prev) => {
      if (prev.key !== col.key) return { key: col.key, direction: "asc" };
      if (prev.direction === "asc") return { key: col.key, direction: "desc" };
      if (prev.direction === "desc") return { key: col.key, direction: null };
      return { key: col.key, direction: "asc" };
    });
  };

  const sortedData = useMemo(() => {
    if (isControlled) return data;
    if (!sort.key || !sort.direction) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return data;
    const accessor = col.sortAccessor ?? ((row: T) => cellValue(row, col.key) as string | number);
    const copy = [...data];
    copy.sort((a, b) => {
      const result = compareValues(accessor(a), accessor(b));
      return sort.direction === "asc" ? result : -result;
    });
    return copy;
  }, [data, sort, columns, isControlled]);

  const pageKeys = useMemo(() => sortedData.map((row, i) => rowKey(row, i)), [sortedData, rowKey]);

  const allSelected =
    selectable && !!selectedKeys && pageKeys.length > 0 && pageKeys.every((k) => selectedKeys.has(k));
  const someSelected =
    selectable && !!selectedKeys && !allSelected && pageKeys.some((k) => selectedKeys.has(k));

  const toggleAll = () => {
    if (!onSelectionChange || !selectedKeys) return;
    const next = new Set(selectedKeys);
    if (allSelected) {
      pageKeys.forEach((k) => next.delete(k));
    } else {
      pageKeys.forEach((k) => next.add(k));
    }
    onSelectionChange(next);
  };

  const toggleRow = (key: string | number) => {
    if (!onSelectionChange || !selectedKeys) return;
    const next = new Set(selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onSelectionChange(next);
  };

  const cellPad = dense ? "px-4 py-2.5" : "px-5 py-4";
  const colSpan = columns.length + (selectable ? 1 : 0);

  return (
    <div className="w-full overflow-hidden rounded-md border border-field-border">
      {caption && (
        <div className="bg-bg px-5 py-4">
          <p className="text-lg text-surface-light">
            {caption}
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-full border-collapse bg-surface-1 font-body">
          <thead>
            <tr className="bg-surface-1">
              {selectable && (
                <th
                  scope="col"
                  className={[cellPad, "w-10 border-b border-field-border bg-surface-light-2"].join(" ")}
                >
                  <RowCheckbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    label="Select all rows on this page"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sort.key === col.key && sort.direction !== null;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    style={col.width ? { width: col.width } : undefined}
                    className={[
                      cellPad,
                      alignClass[col.align ?? "left"],
                      "border-b border-field-border",
                      col.hideOnMobile ? "hidden sm:table-cell" : "",
                      "select-none whitespace-nowrap text-xs font-bold uppercase tracking-[0.12em]",
                      col.sortable ? "cursor-pointer text-primary hover:text-accent-2" : "text-text-secondary",
                      isSorted ? "text-accent-2" : "text-primary",
                      "transition-colors duration-200 bg-surface-light-2",
                    ].join(" ")}
                    onClick={() => handleSort(col)}
                    aria-sort={
                      isSorted ? (sort.direction === "asc" ? "ascending" : "descending") : "none"
                    }
                  >
                    <span className="inline-flex items-center">
                      {col.header}
                      {col.sortable && <SortIcon direction={isSorted ? sort.direction : null} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="border-b border-field-border/60 last:border-b-0 bg-surface-light">
                  {selectable && <td className={cellPad} />}
                  {columns.map((col) => (
                    <td key={col.key} className={cellPad}>
                      <div className="h-4 w-3/4 animate-pulse rounded bg-field-border/60" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-red-600">
                  {error}
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-5 py-10 text-center text-sm text-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => {
                const key = rowKey(row, index);
                const isRowSelected = !!selectedKeys?.has(key);
                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(row, index)}
                    className={[
                      isRowSelected ? "bg-accent-dim" : "bg-surface-light",
                      "border-b border-field-border/60 last:border-b-0",
                      onRowClick ? "cursor-pointer hover:bg-accent-dim" : "hover:bg-surface-light-2",
                      "transition-colors duration-200",
                    ].join(" ")}
                  >
                    {selectable && (
                      <td className={cellPad}>
                        <RowCheckbox
                          checked={isRowSelected}
                          onChange={() => toggleRow(key)}
                          label={`Select row ${index + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={[
                          cellPad,
                          alignClass[col.align ?? "left"],
                          col.hideOnMobile ? "hidden sm:table-cell" : "",
                          "text-sm text-text-primary",
                        ].join(" ")}
                      >
                        {col.render ? col.render(row, index) : (cellValue(row, col.key) as ReactNode)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {footer && (
        <div className="border-t border-field-border bg-surface-1 px-5 py-4">
          {footer}
        </div>
      )}
    </div>
  );
}
import { useMemo, useState } from "react";

export type SortDirection = "asc" | "desc" | null;
export interface SortState { key: string; direction: SortDirection }

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

export function useTableQuery<T>(
  data: T[],
  matchesSearch: (row: T, query: string) => boolean,
  matchesFilters: (row: T, filters: Record<string, string[]>) => boolean,
  pageSize = 10,
  getSortValue?: (row: T, key: string) => string | number | null | undefined,
  defaultSort?: SortState
) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [rawPage, setRawPage] = useState(1);
  const [sort, setSort] = useState<SortState>(defaultSort ?? { key: "", direction: null });

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return data.filter((row) => (!q || matchesSearch(row, q)) && matchesFilters(row, filterValues));
  }, [data, searchQuery, filterValues, matchesSearch, matchesFilters]);

  const sorted = useMemo(() => {
    if (!sort.key || !sort.direction || !getSortValue) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const result = compareValues(getSortValue(a, sort.key), getSortValue(b, sort.key));
      return sort.direction === "asc" ? result : -result;
    });
    return copy;
  }, [filtered, sort, getSortValue]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  // Derive the clamped page during render instead of writing it back
  // via an effect. `rawPage` still remembers the "intended" page, so if
  // totalPages grows again (e.g. a filter is cleared) we snap back to it.
  const page = Math.min(rawPage, totalPages);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const isFiltered = !!searchQuery || Object.values(filterValues).some((v) => v.length > 0);

  const handleSort = (key: string) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      if (prev.direction === "desc") return { key: "", direction: null };
      return { key, direction: "asc" };
    });
  };

  return {
    searchQuery, setSearchQuery: (v: string) => { setSearchQuery(v); setRawPage(1); },
    filterValues,
    setFilter: (key: string, values: string[]) => { setFilterValues((p) => ({ ...p, [key]: values })); setRawPage(1); },
    clearFilters: () => { setFilterValues({}); setRawPage(1); },
    page, setPage: setRawPage, pageData, filtered: sorted, isFiltered,
    sort, setSort: handleSort,
  };
}
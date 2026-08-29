import { useCallback, useState } from "react";

export function useDetailPanel<TId, TDetail>(
  fetchDetail: (id: TId) => Promise<TDetail>
) {
  const [openFor, setOpenFor] = useState<TId | null>(null);
  const [detail, setDetail] = useState<TDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openPanel = useCallback(async (id: TId) => {
    setOpenFor(id);
    setLoading(true);
    setError(null);
    try {
      setDetail(await fetchDetail(id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load details.");
    } finally {
      setLoading(false);
    }
  }, [fetchDetail]);

  const closePanel = useCallback(() => {
    setOpenFor(null);
    setDetail(null);
    setError(null);
  }, []);

  return { 
    openFor, 
    detail, 
    loading, 
    error, 
    openPanel, 
    closePanel 
  };
}
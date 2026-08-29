import { useEffect, useState, useCallback } from "react";
import { fetchLogActivity, type ActivityLog } from "@/lib/supabase/activity-log";
import { ActivityLogItem } from "./ActivityLogItem";

export function ActivityLogPanel() {
  
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchLogActivity({ limit: 10 })
      .then((data) => {
        if (cancelled) return;
        setLogs(data);
        setHasMore(data.length === 10);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load activity logs:", err);
        setError("Couldn't load activity log.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (logs.length === 0) return;
    setLoadingMore(true);
    try {
      const more = await fetchLogActivity({
        limit: 10,
        cursor: logs[logs.length - 1].createdAt,
      });
      setLogs((prev) => [...prev, ...more]);
      setHasMore(more.length === 10);
    } catch (err) {
      console.error("Failed to load more activity logs:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [logs]);

  return (
    <div className="rounded-md border border-field-border bg-white p-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base italic text-text-primary">Recent activity</h2>
      </div>

      {loading && (
        <p className="py-6 text-center text-sm text-text-muted">Loading activity…</p>
      )}

      {!loading && error && (
        <p className="py-6 text-center text-sm text-rose-600">{error}</p>
      )}

      {!loading && !error && logs.length === 0 && (
        <p className="py-6 text-center text-sm text-text-muted">No activity yet.</p>
      )}

      {!loading && !error && logs.length > 0 && (
        <>
          <ul className="divide-y divide-field-border">
            {logs.map((log) => (
              <ActivityLogItem key={log.id} log={log} />
            ))}
          </ul>

          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="mt-3 w-full rounded-md border border-field-border py-2 text-xs font-medium text-text-secondary hover:bg-surface-light disabled:opacity-50"
            >
              {loadingMore ? "Loading…" : "Load more"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
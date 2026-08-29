import { useCallback, useEffect, useState } from "react";
import { fetchMembers } from "@/lib/supabase/members";
import type { MemberListRow } from "@/lib/supabase/members";


export function useFetchMembers() {

  const [members, setMembers] = useState<MemberListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchMembers();
      setMembers(rows);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load members.");
    } finally {
      setLoading(false);
    }
  }, []);

  // FETCH THE ALL PDG MEMBERS
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return {
    members,
    setMembers,
    loading,
    error,
    refetch: load
  };
}
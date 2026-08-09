import { useCallback, useState } from "react";
import { fetchMemberDetail } from "@/lib/supabase/members";
import type { MemberDetail } from "@/lib/supabase/types";

export function useMemberDetail() {

  const [openFor, setOpenFor] = useState<string | null>(null);
  const [detail, setDetail] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = useCallback(async (memberId: string) => {
    setOpenFor(memberId);
    setLoading(true);
    setError(null);
    try {
      setDetail(await fetchMemberDetail(memberId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load details.");
    } finally {
      setLoading(false);
    }
  }, []);

  const close = useCallback(() => {
    setOpenFor(null);
    setDetail(null);
    setError(null);
  }, []);

  return { 
    openFor, 
    detail, 
    loading, 
    error, 
    open, 
    close 
  };
}
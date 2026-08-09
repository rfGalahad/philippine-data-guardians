import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/Toast";
import { fetchMembers, removeMember } from "@/lib/supabase/members";
import type { MemberListRow } from "@/lib/supabase/members";


export function useMembers() {

  const toast = useToast();

  const [members, setMembers] = useState<MemberListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchMembers()
      .then((rows) => !cancelled && setMembers(rows))
      .catch((err: unknown) => !cancelled && setError(err instanceof Error ? err.message : "Failed to load members."))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const removeSelected = useCallback(async () => {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    if (!window.confirm(`Delete ${count} member${count > 1 ? "s" : ""}? This can't be undone.`)) return;

    setDeleting(true);
    try {
      const success = await removeMember(Array.from(selectedIds).map(String));
      if (success) {
        toast.success(`Successfully deleted ${count} member(s).`);
        setMembers((prev) => prev.filter((m) => !selectedIds.has(m.memberId)));
        setSelectedIds(new Set());
      } 
    } catch (err: unknown) {
      toast.error(`Failed deleted ${count} member(s).`);
      console.error(`Failed to delete ${count} member(s):`, err)
    } finally {
      setDeleting(false);
    }
  }, [selectedIds, toast]);

  return { 
    members, 
    loading, 
    error, 
    selectedIds, 
    setSelectedIds, 
    deleting, 
    removeSelected 
  };
}
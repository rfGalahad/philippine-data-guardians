import { useCallback, useState } from "react";
import { useToast } from "@/components/feedback/Toast";
import { removeMember } from "@/lib/supabase/members";


interface UseDeleteMemberOptions {
  onDeleted?: (deletedIds: Set<string | number>) => void;
}


export function useDeleteMember({ onDeleted }: UseDeleteMemberOptions = {}) {
  
  const toast = useToast();

  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const requestDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    setConfirmOpen(true);
  }, [selectedIds]);

  const cancelDelete = useCallback(() => {
    if (deleting) return;
    setConfirmOpen(false);
  }, [deleting]);

  const confirmDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    const idsToDelete = selectedIds;

    setDeleting(true);
    try {
      const success = await removeMember(Array.from(idsToDelete).map(String));
      if (success) {
        toast.success(`Successfully deleted ${count} member(s).`);
        onDeleted?.(idsToDelete);
        setSelectedIds(new Set());
      }
    } catch (err: unknown) {
      toast.error(`Failed to delete ${count} member(s).`);
      console.error(`Failed to delete ${count} member(s):`, err);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }, [selectedIds, toast, onDeleted]);

  return {
    selectedIds,
    setSelectedIds,
    deleting,
    confirmOpen,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
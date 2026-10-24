import { useCallback, useState } from "react";
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { useToast } from "@/components/feedback/Toast";


interface UseBulkDeleteOptions {
  deleteFn: (ids: string[]) => Promise<boolean>;
  queryKey: QueryKey;
  entityLabel: string; // e.g. "member", "subscriber"
}

export function useBulkDelete({ deleteFn, queryKey, entityLabel }: UseBulkDeleteOptions) {
  
  const toast = useToast();
  const queryClient = useQueryClient();

  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async (ids: Array<string | number>) => {
      const success = await deleteFn(ids.map(String));
      if (!success) throw new Error("Delete failed");
    },
    onSuccess: (_data, ids) => {
      toast.success(`Successfully deleted ${ids.length} ${entityLabel}(s).`);
      queryClient.invalidateQueries({ queryKey });
      setSelectedIds(new Set());
    },
    onError: (err, ids) => {
      toast.error(`Failed to delete ${ids.length} ${entityLabel}(s).`);
      console.error(`Failed to delete ${ids.length} ${entityLabel}(s):`, err);
    },
    onSettled: () => setConfirmOpen(false),
  });

  const requestDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    setConfirmOpen(true);
  }, [selectedIds]);

  const cancelDelete = useCallback(() => {
    if (isPending) return;
    setConfirmOpen(false);
  }, [isPending]);

  const confirmDelete = useCallback(() => {
    if (selectedIds.size === 0) return;
    mutate(Array.from(selectedIds));
  }, [selectedIds, mutate]);

  return {
    selectedIds,
    setSelectedIds,
    deleting: isPending,
    confirmOpen,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
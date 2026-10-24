import { useBulkDelete } from "@/hooks/useBulkDelete";
import { removeMember } from "@/lib/supabase/members";
import { memberKeys } from "./useMembers";

export const useDeleteMember = () =>
  useBulkDelete({ 
    deleteFn: removeMember, 
    queryKey: memberKeys.all,
    entityLabel: "member" 
  });
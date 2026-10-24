import { useBulkDelete } from "@/hooks/useBulkDelete";
import { removeSubscriber } from "@/lib/supabase/subscribers";
import { subscriberKeys } from "./useSubscribers";

export const useDeleteSubscriber = () =>
  useBulkDelete({ 
    deleteFn: removeSubscriber, 
    queryKey: subscriberKeys.all,
    entityLabel: "subscriber" 
  });
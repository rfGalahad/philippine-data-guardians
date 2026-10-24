import { useQuery } from "@tanstack/react-query";
import { fetchSubscribers } from "@/lib/supabase/subscribers";

export const subscriberKeys = {
  all: ["subscribers"] as const,
  list: () => [...subscriberKeys.all, "list"] as const,
};

export function useSubscribers() {
  return useQuery({
    queryKey: subscriberKeys.list(),
    queryFn: fetchSubscribers,
  });
}
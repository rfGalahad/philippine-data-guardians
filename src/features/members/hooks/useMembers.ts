import { useQuery } from "@tanstack/react-query";
import { fetchMembers } from "@/lib/supabase/members";

export const memberKeys = {
  all: ["members"] as const,
  list: () => [...memberKeys.all, "list"] as const,
};

export function useMembers() {
  return useQuery({
    queryKey: memberKeys.list(),
    queryFn: fetchMembers,
  });
}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/feedback/Toast";

import type { RegistrationValues } from "../schema";
import { updateMemberWithPhoto } from "../actions/updateMemberWithPhoto";


export function useUpdateMember(memberId: string, onSuccess?: () => void) {

  const toast = useToast();
  const queryClient = useQueryClient();
  
  // UPDATE MEMBER'S DETAILS
  const {
    mutateAsync: update,
    isPending: isUpdating,
  } = useMutation({
    mutationFn: async ({ 
      values, 
      plan 
    }: { values: RegistrationValues; plan: string }) => 
      updateMemberWithPhoto(values, plan),
    onSuccess: () => {
      toast.success("Member updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["member", memberId] });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  return { update, isUpdating };
}
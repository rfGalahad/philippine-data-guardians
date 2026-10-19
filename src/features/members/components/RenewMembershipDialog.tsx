import ConfirmDialog from "@/components/feedback/ConfirmDialog";

interface RenewMembershipDialogProps {
  expiresAt: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RenewMembershipDialog = ({
  expiresAt,
  onConfirm,
  onCancel,
}: RenewMembershipDialogProps) => {
  const formatted = expiresAt
    ? new Date(expiresAt).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const description =
    "This email already has an active membership" +
    (formatted ? ` that expires on ${formatted}` : "") +
    ". Would you like to renew it? The new year will be added on top of your remaining time.";

  return (
    <ConfirmDialog
      open
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      onConfirm={onConfirm}
      title="Active membership found"
      description={description}
      confirmLabel="Renew Membership"
      cancelLabel="Cancel"
      variant="primary"
    />
  );
};
import type { MemberDetail } from "@/lib/supabase/members";
import { formatDate } from "@/utils/date";
import { getFullName, getInitials } from "@/utils/string";
import { IDTemplate } from "../IDTemplate"; 

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

interface MemberDetailContentProps {
  detail: MemberDetail;
}
 
// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------

export default function MemberDetailContent({ 
  detail 
}: MemberDetailContentProps ) {
  
  const fullName = getFullName(detail);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 rounded-lg border border-[rgba(5,50,97,0.08)] p-4">
        {detail.photoUrl ? (
          <img
            src={detail.photoUrl}
            alt={fullName}
            className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-accent/10"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent/10 font-body text-lg font-bold text-accent">
            {getInitials(fullName)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="truncate font-body text-base font-semibold text-text-primary">
              {fullName}
            </div>
            {detail.memberStatus && (
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 font-body text-xs font-medium ${
                  detail.memberStatus === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {detail.memberStatus}
              </span>
            )}
          </div>

          <div className="mt-1 space-y-0.5">
            <div className="truncate font-body text-sm text-text-secondary">
              {detail.email}
            </div>
            <div className="font-body text-sm text-text-secondary">
              {detail.contactNumber ?? "—"}
            </div>
          </div>

          <div className="mt-2 font-body text-xs text-text-secondary">
            Member since {formatDate(detail.createdAt)}
          </div>
        </div>
      </div>

      {/* Digital ID */}
      <IDTemplate
        memberId={detail.memberId}
        fullName={fullName}
        photoUrl={detail.photoUrl}
        plan={detail.subscriptions[0].planName}
        address={detail.address}
      />
    </div>
  );
}
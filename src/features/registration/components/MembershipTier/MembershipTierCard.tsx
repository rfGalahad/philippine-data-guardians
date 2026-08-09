import { GraduationCap, Briefcase, Check, type LucideIcon } from 'lucide-react';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type TierName = 'Student/Academe' | 'Professionals';

interface TierData {
  icon: LucideIcon;
  benefits: string[];
}

interface MembershipTierCardProps {
  tier: TierName;
  cost: string;
  isSelected: boolean;
  onSelect: (tier: TierName, cost: string) => void;
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const TIERS: Record<TierName, TierData> = {
  'Student/Academe': {
    icon: GraduationCap,
    benefits: [
      'Access to free training sessions',
      'Free certificates and CPD units',
      'Announcements on free events',
      'PDG T-shirt and Membership ID',
    ],
  },
  Professionals: {
    icon: Briefcase,
    benefits: [
      'All Student/Academic benefits',
      'Priority access to workshops',
      'Networking opportunities',
      'Professional development resources',
    ],
  },
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export const MembershipTierCard = ({
  tier,
  cost,
  isSelected,
  onSelect,
}: MembershipTierCardProps) => {

  const tierData = TIERS[tier] ?? TIERS['Student/Academe'];
  const TierIcon = tierData.icon;

  return (
    <button
      type="button"
      onClick={() => onSelect(tier, cost)}
      aria-pressed={isSelected}
      className={[
        'group relative flex w-full flex-col rounded-2xl border-2 p-6 text-left',
        'transition-all duration-300 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7CF13] focus-visible:ring-offset-2',
        isSelected
          ? 'border-[#F7CF13] bg-[#FFFBEA]'
          : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-[#F7CF13] hover:bg-[#FFF8DC]',
      ].join(' ')}
    >
      {/* SELECTED BADGE */}
      {isSelected && (
        <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#F7CF13]">
          <Check className="h-4 w-4 text-[#053261]" strokeWidth={3} />
        </span>
      )}

      {/* HEADER */}
      <div className="mb-2 flex flex-col items-center">
        <div
          className={[
            'mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-300',
            isSelected ? 'bg-[#F7CF13]' : 'bg-[#FFF8DC] group-hover:bg-[#F7CF13]',
          ].join(' ')}
        >
          <TierIcon
            className={[
              'h-8 w-8 transition-colors duration-300',
              isSelected ? 'text-[#053261]' : 'text-[#F7CF13] group-hover:text-[#053261]',
            ].join(' ')}
            strokeWidth={2}
          />
        </div>

        {/* TIER NAME */}
        <h3 className="mb-1 text-center text-lg font-bold text-[#053261]">
          {tier}
        </h3>

        {/* COST */}
        <div className="mb-1 flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-[#053261]">₱{cost}</span>
          <span className="text-sm font-semibold text-slate-400">/year</span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="mb-5 h-0.5 w-full bg-linear-to-r from-transparent via-[#F7CF13] to-transparent" />

      {/* BENEFITS */}
      <ul className="flex flex-1 flex-col gap-3">
        {tierData.benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-3">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#F7CF13]" strokeWidth={2.5} />
            <span className="text-sm font-medium leading-relaxed text-[#053261]">
              {benefit}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-6 pt-1">
        <div
          className={[
            'w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-300',
            isSelected
              ? 'bg-linear-to-br from-[#F7CF13] to-[#FFD700] text-[#053261] shadow-[0_6px_16px_rgba(247,207,19,0.25)]'
              : 'bg-[#053261]/8 text-[#053261] group-hover:bg-linear-to-br group-hover:from-[#F7CF13] group-hover:to-[#FFD700] group-hover:shadow-[0_6px_16px_rgba(247,207,19,0.25)]',
          ].join(' ')}
        >
          {isSelected ? '✓ Selected' : 'Select'}
        </div>
      </div>
    </button>
  );
};
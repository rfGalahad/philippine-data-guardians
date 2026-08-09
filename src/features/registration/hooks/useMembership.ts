import { useState } from 'react';
import { useFormContext } from '../context/FormContext';
import type { TierName } from '../components/MembershipTier/MembershipTierCard';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface MembershipTypeData {
  tier: TierName;
  cost: string
}

interface UseMembershipReturn {
  selected: TierName | null;
  error: boolean;
  handleCardSelect: (tier: TierName, cost: string) => void;
  handleSubmit: () => void;
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export const useMembership = (handleNext: () => void): UseMembershipReturn => {
  
  const { formData, updateFormData } = useFormContext();
  const [error, setError] = useState(false);

  // DERIVE SELECTED TIER FROM CONTEXT — no local state/effect needed,
  const sectionData = formData?.membershipType as MembershipTypeData | undefined;
  const selected = sectionData?.tier ?? null;

  // SAVE SELECTED MEMBERSHIP TIER TO FORM DATA (membershipType)
  const handleCardSelect = (tier: TierName, cost: string) => {
    setError(false);
    updateFormData('membershipType', { tier, cost });
  };

  // REDIRECTS TO NEXT FORM STEP
  const handleSubmit = () => {
    if (selected) {
      handleNext();
    } else {
      setError(true);
    }
  };

  return {
    selected,
    error,
    handleCardSelect,
    handleSubmit,
  };
};
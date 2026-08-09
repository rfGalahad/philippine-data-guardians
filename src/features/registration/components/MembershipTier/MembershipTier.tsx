import { GraduationCap } from 'lucide-react';

import Button from '@/components/ui/Button';

import { useMembership } from '../../hooks/useMembership';
import { FormHeader } from '../FormHeader';
import { MembershipTierCard, type TierName } from './MembershipTierCard';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface MembershipTierProps {
  handleBack: () => void;
  handleNext: () => void;
}

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const MembershipTier = ({ 
  handleBack, 
  handleNext 
}: MembershipTierProps) => {
  
  const { 
    selected, 
    error, 
    handleCardSelect, 
    handleSubmit 
  } = useMembership(handleNext);

  return (
    <div className="box-border flex flex-col gap-8">
      {/* FORM HEADER */}
      <FormHeader 
        title="Membership Tier" 
        icon={<GraduationCap className="text-[#053261]" />} 
      />

      {/* FORM CONTENT */}
      <div className="flex flex-col gap-2 px-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <MembershipTierCard
            tier={'Student/Academe' as TierName}
            cost="300"
            isSelected={selected === 'Student/Academe'}
            onSelect={handleCardSelect}
          />
          <MembershipTierCard
            tier={'Professionals' as TierName}
            cost="500"
            isSelected={selected === 'Professionals'}
            onSelect={handleCardSelect}
          />
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <p role="alert" className="text-sm font-medium text-red-600">
            Please choose a tier
          </p>
        )}
      </div>

      {/* FORM BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full border-t rounded-b-2xl p-6 border-gray-200 bg-gray-50">
        <Button
          label="Previous Step"
          variant="outlined"
          color="white"
          onClick={handleBack}
          fullWidth
        />
        <Button
          label="Next Step"
          color="neutral"
          onClick={handleSubmit}
          fullWidth
        />
      </div>
    </div>
  );
};

export default MembershipTier;
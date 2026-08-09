import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const ITEMS = [
  'Consent to the collection and processing of my personal data for membership-related purposes.',
  'Acknowledge that I may access, update, or request the deletion of my personal data by contacting PDG.',
  'Understand that I may withdraw my consent anytime, subject to applicable laws and PDG policies.',
  'Hereby certify that the information I provided is true and correct to the best of my knowledge.',
];

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface AgreeCheckboxProps {
  agree: (allChecked: boolean) => void;
}

//-----------------------------------------------------------
// MAIN COMPONENTS
//-----------------------------------------------------------

export const AgreeCheckbox = ({ agree }: AgreeCheckboxProps) => {
  
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>(
    Object.fromEntries(ITEMS.map((_, i) => [i, false]))
  );

  const handleChange = (index: number) => (checked: boolean) => {
    const updated = { ...checkedItems, [index]: checked };
    setCheckedItems(updated);
    agree(Object.values(updated).every(Boolean));
  };

  const allChecked = Object.values(checkedItems).every(Boolean);
  const anyChecked = Object.values(checkedItems).some(Boolean);

  return (
    <div className='p-6'>
      {/* LABEL */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-[rgba(5,50,97,0.1)]" />
        <span className="whitespace-nowrap text-[0.7rem] font-extrabold uppercase tracking-[0.09em] text-[#053261] opacity-55">
          I agree to the following
        </span>
        <div className="h-px flex-1 bg-[rgba(5,50,97,0.1)]" />
      </div>

      {/* ITEMS */}
      <div className="flex flex-col gap-2.5">
        {ITEMS.map((item, index) => {
          const checked = checkedItems[index];
          return (
            <div
              key={index}
              role="checkbox"
              aria-checked={checked}
              tabIndex={0}
              onClick={() => handleChange(index)(!checked)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleChange(index)(!checked);
                }
              }}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border-[1.5px] p-3 transition-all duration-200 md:p-4 ${
                checked
                  ? 'border-[rgba(46,125,50,0.35)] bg-[rgba(46,125,50,0.04)] hover:border-[rgba(46,125,50,0.5)] hover:bg-[rgba(46,125,50,0.06)]'
                  : 'border-[rgba(5,50,97,0.1)] bg-transparent hover:border-[rgba(5,50,97,0.25)] hover:bg-[rgba(5,50,97,0.03)]'
              }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleChange(index)(!checked);
                }}
                className="mt-px shrink-0"
                aria-hidden="true"
                tabIndex={-1}
              >
                {checked ? (
                  <CheckCircle2 size={20} className="text-[#2e7d32]" />
                ) : (
                  <Circle size={20} className="text-[rgba(5,50,97,0.3)]" />
                )}
              </button>
              <p
                className={`select-none text-sm leading-relaxed transition-colors duration-200 ${
                  checked ? 'font-medium text-[#0c2444]' : 'font-normal text-[#5a7396]'
                }`}
              >
                {item}
              </p>
            </div>
          );
        })}
      </div>

      {/* VALIDATION MESSAGE */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          anyChecked && !allChecked ? 'mt-2 max-h-20 opacity-100' : 'mt-0 max-h-0 opacity-0'
        }`}
      >
        <span className="block rounded-md border border-[rgba(180,83,9,0.2)] bg-[rgba(180,83,9,0.07)] px-4 py-2 text-xs italic text-[#b45309]">
          Please confirm all items above to proceed.
        </span>
      </div>
    </div>
  );
};
import type { LucideIcon } from "lucide-react";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface ContactDetailsItemProps {
  icon: LucideIcon,
  title: string,
  description: string
}

//-----------------------------------------------------------
// MAIN COMPONENTS
//-----------------------------------------------------------

export const ContactDetailsItem = ({ 
  icon: Icon, 
  title, 
  description 
}: ContactDetailsItemProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#053261]/30">
        {Icon && <Icon className="h-5 w-5 text-[#053261]" />}
      </div>
      <div>
        <p className="text-sm font-semibold text-[#053261]">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default ContactDetailsItem;
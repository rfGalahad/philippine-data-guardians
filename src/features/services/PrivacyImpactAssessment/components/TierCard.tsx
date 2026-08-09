import { useState } from "react";
import { Briefcase, Building2, Check, Users } from "lucide-react";
import { useToast } from "@/components/Toast";
import PDGLogo from '@/assets/logo-pdg-1.png';

//-----------------------------------------------------------
// INTERFACE / TYPES
//-----------------------------------------------------------

export interface Tier {
  name: string;
  price: string;
  description: string;
  features: string[];
}

interface TierCardProps {
  tier: Tier;
}

//-----------------------------------------------------------
// HELPERS
//-----------------------------------------------------------

const getIcon = (name: string) => {
  const props = { size: 24, color: "#053261" };
  switch (name) {
    case "Basic":
      return <Briefcase {...props} />;
    case "Professional":
      return <Users {...props} />;
    case "Enterprise":
      return <Building2 {...props} />;
    default:
      return <Briefcase {...props} />;
  }
};

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const TierCard = ({ tier }: TierCardProps) => {

  const [isHovered, setIsHovered] = useState(false);
  const { name, price, description, features } = tier;
  const toast = useToast();
  const TierIcon = getIcon(name);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={[
        "border-[#E0E0E0] border-2",
        "relative flex h-full flex-col overflow-hidden rounded-lg bg-white p-6",
        "transition-all duration-300 ease-in-out",
        isHovered
          ? "-translate-y-1 shadow-[0_8px_24px_rgba(5,50,97,0.15)]"
          : "translate-y-0 shadow-[0_2px_4px_rgba(0,0,0,0.1)]",
      ].join(" ")}
    >
      {/* TIER HEADER */}
      <div className="mb-6 flex flex-col">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#BCD3EB]">
          {TierIcon}
        </div>

        <p className="mb-1 text-sm font-semibold text-[#053261]">{name}</p>

        <p className="mb-3 text-xs leading-relaxed text-[#8C8C8C]">
          {description}
        </p>

        {/* PRICING */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold leading-none text-[#053261]">
            ₱{price}
          </span>
          <span className="text-sm font-medium text-[#8C8C8C]">/month</span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="mb-6 h-px w-full bg-linear-to-r from-transparent via-[#E0E0E0] to-transparent" />

      <div className="z-1 flex flex-1 flex-col justify-between">
        {/* FEATURES LIST */}
        <div>
          {features.map((feature) => (
            <div key={feature} className="mb-2 flex items-start gap-2">
              <Check className="mt-0.75 h-4 w-4 shrink-0 text-[#F7CF13]" />
              <p className="text-sm leading-relaxed text-[#424242]">
                {feature}
              </p>
            </div>
          ))}
        </div>

        {/* REGISTER BUTTON */}
        <button
          onClick={() => toast.info("This feature is under development.")}
          className={[
            "z-1 mt-4 flex w-full items-center justify-center rounded-md border border-[#053261] py-3",
            "text-sm font-semibold normal-case text-[#053261] transition-all duration-300 ease-in-out",
            "hover:bg-[#053261] hover:text-[#F7CF13]",
            "cursor-pointer"
          ].join(" ")}
        >
          Subscribe
        </button>
      </div>

      {/* PDG LOGO */}
      <img
        src={PDGLogo}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-1.25 z-0 h-[60%] w-auto opacity-10 lg:-right-10"
      />
    </div>
  );
};

export default TierCard;
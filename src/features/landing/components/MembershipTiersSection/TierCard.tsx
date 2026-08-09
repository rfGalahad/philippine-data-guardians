import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Check, School, Users, Briefcase } from "lucide-react";
import PDGLogo from '@/assets/logo-pdg-1.png';
import { useLandingNavigation } from "../../hooks/useLandingNavigation";

//-----------------------------------------------------------
// INTERFACE / TYPES
//-----------------------------------------------------------

interface TierCardProps {
  tier: string,
  cost: string
}

//-----------------------------------------------------------
// HELPERS
//-----------------------------------------------------------

const getIcon = (tier: string) => {
  const props = { size: 24, color: "#053261" };
  switch (tier) {
    case "Student/Academic":
      return <School {...props} />;
    case "Professionals":
      return <Briefcase {...props} />;
    case "Student Organization":
      return <Users {...props} />;
    case "Institutional Organization":
      return <Building2 {...props} />;
    default:
      return <School {...props} />;
  }
};

const getInitialBenefits = (tier: string) => {
  const studentBenefits = [
    "Access to free training sessions",
    "Free certificates",
    "Announcements on free events",
    "PDG T-shirt and Membership ID",
  ];
  const professionalBenefits = [
    "All Student/Academic benefits",
    "Priority access to workshops",
    "Networking opportunities",
    "Professional development resources",
  ];
  const studentOrgBenefits = [
    "Group training sessions",
    "Bulk certificates",
    "Organization recognition",
    "Special group discounts",
  ];
  const institutionalOrgBenefits = [
    "Enterprise-level access",
    "Dedicated support",
    "Institutional partnerships",
  ];

  switch (tier) {
    case "Student/Academic":
      return studentBenefits;
    case "Professionals":
      return professionalBenefits;
    case "Student Organization":
      return studentOrgBenefits;
    case "Institutional Organization":
      return institutionalOrgBenefits;
    default:
      return [];
  }
};

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const TierCard = ({ tier, cost }: TierCardProps) => {

  const { scrollToSection } = useLandingNavigation();

  const [isHovered, setIsHovered] = useState(false);
  const benefits = getInitialBenefits(tier);
  const TierIcon = getIcon(tier);
  const canRegister = tier === "Student/Academic" || tier === "Professionals";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={[
        "relative flex h-full flex-col overflow-hidden rounded-lg bg-white p-6",
        "transition-all duration-300 ease-in-out",
        isHovered
          ? "-translate-y-1 shadow-[0_8px_24px_rgba(5,50,97,0.15)]"
          : "translate-y-0 shadow-[0_2px_8px_rgba(0,0,0,0.1)]",
      ].join(" ")}
    >
      {/* TIER HEADER */}
      <div className="mb-6 flex flex-col">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#BCD3EB]">
          {TierIcon}
        </div>

        <p className="mb-1 text-sm font-semibold text-[#053261]">{tier}</p>

        {/* PRICING */}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold leading-none text-[#053261]">
            ₱{cost}
          </span>
          <span className="text-sm font-medium text-[#8C8C8C]">/Annual</span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="mb-6 h-px w-full bg-linear-to-r from-transparent via-[#E0E0E0] to-transparent" />

      <div className="z-1 flex flex-1 flex-col justify-between">
        {/* BENEFITS LIST */}
        <div>
          {benefits.map((benefit) => (
            <div key={benefit} className="mb-2 flex items-start gap-2">
              <Check className="mt-0.75 h-4 w-4 shrink-0 text-[#F7CF13]" />
              <p className="text-sm leading-relaxed text-[#424242]">
                {benefit}
              </p>
            </div>
          ))}
        </div>

        {/* REGISTER / CONTACT BUTTON */}
        {canRegister ? (
          <Link
            to="/registration"
            className={[
              "z-1 mt-4 flex w-full items-center justify-center rounded-md border border-[#053261] py-3",
              "text-sm font-semibold normal-case text-[#053261] transition-all duration-300 ease-in-out",
              "hover:bg-[#053261] hover:text-[#F7CF13]",
            ].join(" ")}
          >
            Register Now
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className={[
              "z-1 mt-4 flex w-full items-center justify-center rounded-md border border-[#053261] py-3",
              "text-sm font-semibold normal-case text-[#053261] transition-all duration-300 ease-in-out",
              "hover:bg-[#053261] hover:text-[#F7CF13]",
            ].join(" ")}
          >
            Contact Us
          </button>
        )}
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
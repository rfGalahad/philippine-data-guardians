import { TierCard } from "./TierCard";

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const TIER_LIST = [
  { title: "Student/Academic", cost: "300" },
  { title: "Professionals", cost: "500" },
  { title: "Student Organization", cost: "1,000" },
  { title: "Institutional Organization", cost: "3,000" },
];

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const MembershipTiersSection = () => {

  return (
    <div 
      id="membership" 
      className="scroll-mt-24 max-w-7xl mx-auto mt-16 px-4"
    >
      {/* HEADER */}
      <div className="flex flex-col gap-1 text-center text-white">
        <h2 className="text-2xl font-semibold text-white md:text-[2.125rem]">
          Membership <span className="text-accent">Tiers</span>
        </h2>

        <p className="text-sm text-white md:text-base">
          Unlock exclusive features and member benefits.
        </p>
      </div>

      {/* TIER CARDS */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIER_LIST.map((item) => (
          <div key={item.title}>
            <TierCard tier={item.title} cost={item.cost} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipTiersSection;
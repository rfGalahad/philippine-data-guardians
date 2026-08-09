import { Check } from "lucide-react";
import { motion } from "framer-motion";

import Button from "@/components/ui/Button";
import { itemVariants } from "@/lib/motion";

import { useLandingNavigation } from "../../hooks/useLandingNavigation";

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const MEMBERSHIP_TYPE = [
  {
    title: "Become a Member",
    description:
      "Actively participates in our community to learn, share, and implement best practices in data privacy and cybersecurity.",
    benefits: [
      "Exclusive resources, toolkits, and learning materials",
      "Updates on data privacy trends, news, and events",
      "Access to forums, discussions, and capacity-building sessions",
    ],
    elevated: false,
    cta: "Join as Member",
  },
  {
    title: "Become an Advocate",
    description:
      "Go beyond membership by becoming a voice for data privacy and security in your organization or community.",
    benefits: [
      "Represent our cause in your professional or local network",
      "Lead initiatives that promote compliance and data protection",
      "Collaborate with advocates to drive change at a larger scale",
    ],
    elevated: false,
    cta: "Become an Advocate",
  },
];

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const MembershipTypes = () => {

  const { scrollToSection } = useLandingNavigation();

  return (
    <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
      {MEMBERSHIP_TYPE.map((type) => (
        <motion.div
          key={type.title}
          variants={itemVariants}
          className={[
            "relative flex flex-col rounded-2xl p-6 backdrop-blur-[10px]",
            "transition-all duration-500 ease-out hover:-translate-y-0.5",
            type.elevated
              ? "border border-[#F7CF13]/40 bg-[#F7CF13]/6 hover:border-[#F7CF13]/65"
              : "border border-white/10 bg-white/5 hover:border-white/20",
          ].join(" ")}
        >
          {/* TITLE */}
          <h3
            className={[
              "mb-1 text-lg font-bold leading-tight",
              type.elevated ? "text-[#F7CF13]" : "text-white",
            ].join(" ")}
          >
            {type.title}
          </h3>

          {/* DESCRIPTION */}
          <p className="mb-4 text-sm leading-relaxed text-[#90a8be]">
            {type.description}
          </p>

          <hr className="mb-4 border-white/8" />

          {/* BENEFITS */}
          <div className="flex flex-1 flex-col gap-2 mb-4">
            {type.benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-2">
                <Check className="mt-0.75 h-3.75 w-3.75 shrink-0 text-[#F7CF13]" />
                <p className="text-sm leading-relaxed text-[#d8e8f4]">
                  {benefit}
                </p>
              </div>
            ))}
          </div>

          {/* CALL-TO-ACTION BUTTON */}
          <Button
            label={type.cta}
            color="accent"
            onClick={() =>
              scrollToSection(
                type.title === 'Become a Member' ? 'membership' : 'contact'
              )
            }
          />
        </motion.div>
      ))}
    </div>
  );
};

export default MembershipTypes;
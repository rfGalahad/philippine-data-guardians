import { motion } from "framer-motion";
import { Briefcase, Gavel, PenTool, Shield } from "lucide-react";
import { itemVariants } from "@/lib/motion";

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const ITEMS = [
  { label: "Local & global regulation expertise", icon: Gavel },
  { label: "Gov, SME & community focus", icon: Briefcase },
  { label: "Data breach response", icon: Shield },
  { label: "Privacy-by-design technology", icon: PenTool },
];

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const FeatureCards = () => {
  return (
    <>
      {ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            variants={itemVariants}
            className={[
              "flex flex-col items-center justify-center gap-3 rounded-2xl p-5 text-center",
              "border border-accent/15 bg-white/5",
              "transition-all duration-200 ease-out",
              "hover:-translate-y-1 hover:border-accent/45 hover:bg-accent/6",
            ].join(" ")}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/12">
              <Icon className="h-5 w-5 shrink-0 text-accent" />
            </div>
            <span className="text-xs leading-snug text-[#d8e8f4]">
              {item.label}
            </span>
          </motion.div>
        );
      })}
    </>
  );
};

export default FeatureCards;
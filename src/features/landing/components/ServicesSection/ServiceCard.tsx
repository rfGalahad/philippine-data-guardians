import { ArrowRight, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  imageLabel?: string;
  index: number;
  link: string;
}

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const ServiceCard = ({
  icon: Icon,
  title,
  description,
  image,
  imageLabel,
  index,
  link,
}: ServiceCardProps) => {

  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(link)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={[
        "relative flex h-full cursor-pointer flex-col overflow-hidden rounded-lg bg-white",
        "transition-shadow duration-500 ease-out",
        isHovered
          ? "shadow-[0px_12px_32px_rgba(0,0,0,0.13)]"
          : "shadow-[0px_2px_8px_rgba(0,0,0,0.08)]",
      ].join(" ")}
    >
      {/* IMAGE SECTION */}
      <div className="relative h-37.5">
        <img
          src={image}
          alt={title}
          className={[
            "block h-full w-full object-cover",
            "transition-[filter,transform] duration-400 ease-in-out",
            isHovered ? "scale-100 brightness-100" : "scale-[1.04] brightness-50",
          ].join(" ")}
        />

        <div
          className={[
            "pointer-events-none absolute inset-0 bg-[#053261]/35",
            "transition-opacity duration-400 ease-in-out",
            isHovered ? "opacity-0" : "opacity-100",
          ].join(" ")}
        />

        {imageLabel && (
          <span className="absolute left-3 top-3 rounded-full bg-[#F7CF13] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#053261]">
            {imageLabel}
          </span>
        )}

        <div
          className={[
            "absolute -bottom-6 left-6 z-2 flex h-12 w-12 items-center justify-center rounded-[10px]",
            "shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-[background-color,transform] duration-300 ease-out",
            isHovered ? "scale-[1.12] bg-[#053261]" : "scale-100 bg-[#F7CF13]",
          ].join(" ")}
        >
          {Icon && (
            <Icon
              className={[
                "h-6 w-6 transition-colors duration-300 ease-out",
                isHovered ? "text-[#F7CF13]" : "text-[#053261]",
              ].join(" ")}
            />
          )}
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div
        className={[
          "flex flex-1 flex-col gap-2 px-6 pb-6 pt-8",
          "border-t-[3px] transition-colors duration-350 ease-out",
          isHovered ? "border-[#053261]" : "border-[#F7CF13]",
        ].join(" ")}
      >
        <p className="font-semibold text-[#053261]">{title}</p>

        <p className="flex-1 wrap-break-words text-sm leading-relaxed text-[#404040]">
          {description}
        </p>

        <button
          type="button"
          className="flex w-fit cursor-pointer items-center font-medium text-[#053261] normal-case"
        >
          Learn More
          <ArrowRight
            className={[
              "h-4 w-4 text-[#053261] transition-[margin-left] duration-300 ease-out",
              isHovered ? "ml-3" : "ml-1.5",
            ].join(" ")}
          />
        </button>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
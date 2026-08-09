import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { containerVariants, itemVariants } from '@/lib/motion';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface HeroSectionProps {
  image: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
}

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const HeroSection = ({
  image,
  imageAlt,
  title,
  subtitle,
  showBackButton = true,
}: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative h-80 overflow-hidden md:h-100">
      {/* BACKGROUND */}
      <motion.img
        src={image}
        alt={imageAlt}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* OVERLAY — layered for depth: directional wash + vignette */}
      <div className="absolute inset-0 bg-linear-to-r from-[#053261] via-[#053261]/70 to-[#053261]/20" />
      <div className="absolute inset-0 bg-linear-to-t from-[#053261]/50 via-transparent to-transparent" />

      {/* HERO TEXT */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-center gap-5"
      >
        {/* Back button */}
        {showBackButton && (
          <motion.button
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            type="button"
            onClick={() => navigate(-1)}
            className="group flex w-fit cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1.5 pr-4 pl-3 text-sm font-medium text-white/90 backdrop-blur-sm transition-colors duration-300 hover:border-white/30 hover:bg-white/15 hover:text-white"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back
          </motion.button>
        )}

        <div className="flex max-w-2xl flex-col gap-4">
          <motion.h1
            variants={itemVariants}
            className="text-4xl leading-[1.1] font-bold tracking-tight text-accent text-balance md:text-5xl"
          >
            {title}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-lg leading-relaxed text-white/75 text-balance"
          >
            {subtitle}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
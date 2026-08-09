import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/motion';
import { FacebookBanner } from "./FacebookBanner";
import { FeatureCards } from "./FeatureCard";


export const AboutSection = () => {
  return (
    <div
      id="about"
      className="scroll-mt-24 max-w-7xl mx-auto mt-16 px-4"
    >
      <motion.div
        className="grid grid-cols-2 gap-3 md:grid-cols-4 md:auto-rows-[minmax(100px,auto)]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* ABOUT US - PHILIPPINE DATA GUARDIANS */}
        <motion.div
          variants={itemVariants}
          className="relative col-span-2 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-[10px] md:row-span-2 md:p-8"
        >
          {/* BACKGROUND GRADIENT */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.3]"
            style={{
              backgroundImage: "radial-gradient(circle, #F7CF13 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              maskImage: "radial-gradient(ellipse 80% 80% at 100% 0%, black 40%, transparent 100%)",
            }}
          />

          {/* HEADING */}
          <h2 className="relative mb-2.5 text-2xl font-bold text-white md:text-[2.125rem]">
            <span className="text-accent">About</span> Philippine Data Guardians
          </h2>

          {/* BODY */}
          <p className="relative mb-2 text-sm text-white md:text-base">
            We specialize in delivering tailored{" "}
            <span className="font-semibold text-accent">
              data privacy and cybersecurity
            </span>{" "}
            strategies designed to meet the unique needs of government agencies,
            SMEs, and community organizations.
          </p>

          <p className="relative text-sm text-white md:text-base">
            Leveraging deep expertise in local regulations and global best practices,
            we help organizations achieve compliance, strengthen resilience, and build
            trust in an increasingly digital world.
          </p>
        </motion.div>

        {/* FEATURES */}
        <FeatureCards />

        {/* FACEBOOK BANNER */}
        <motion.div variants={itemVariants} className="col-span-2 md:col-span-4">
          <FacebookBanner />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutSection;
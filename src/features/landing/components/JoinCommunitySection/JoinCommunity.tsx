import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/motion';
import { MembershipTypes } from './MembershipTypes';
import MembershipIDCard from '@/assets/membership-card.png';

export const JoinCommunitySection = () => {
  return (
    <div
      id="join-community"
      className="mx-auto max-w-7xl scroll-mt-24 mt-16 px-4"
    >
      <motion.div
        className="grid grid-cols-1 gap-3 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* HEADING */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-[10px] md:col-span-2 md:p-8"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.3]"
            style={{
              backgroundImage: "radial-gradient(circle, #F7CF13 1px, transparent 1px)",
              backgroundSize: "22px 22px",
              maskImage: "radial-gradient(ellipse 80% 80% at 100% 0%, black 40%, transparent 100%)",
            }}
          />

          <h2 className="relative mt-2 text-2xl font-bold text-white md:text-[2.125rem]">
            <span className="text-accent">Join</span> Our Community
          </h2>

          <p className="relative mt-3 text-sm text-white md:text-base">
            Be part of a community that champions{" "}
            <span className="font-semibold text-accent">
              data privacy and cybersecurity
            </span>{" "}
            in the Philippines and take an active role in shaping a safer
            digital environment for everyone.
          </p>

          <p className="relative mt-3 text-sm text-white md:text-base">
            We welcome individuals, professionals, organizations, and
            advocates who share our mission of advancing data protection and
            compliance.
          </p>
        </motion.div>

        {/* MEMBERSHIP ID CARD */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-[10px] transition-colors duration-300 hover:border-white/20 md:col-start-3 md:row-start-1"
        >
          <img
            src={MembershipIDCard}
            alt="Philippine Data Guardians membership ID card"
            className="block w-full rounded-lg shadow-[0px_4px_12px_rgba(0,0,0,0.4)]"
          />
        </motion.div>

        {/* MEMBERSHIP TYPES */}
        <motion.div variants={itemVariants} className="flex md:col-span-3">
          <MembershipTypes />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JoinCommunitySection;
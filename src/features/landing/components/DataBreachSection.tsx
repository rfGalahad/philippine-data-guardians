import { motion } from 'framer-motion';
import DashboardPreviewImage from '@/assets/data-breach-dashboard-preview.png';

export const DataBreachSection = () => {
  return (
    <section
      id="data-breach"
      className="scroll-mt-24 max-w-7xl flex flex-col justify-center gap-8 mx-auto mt-16 px-4"
    >
      {/* HEADING */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex w-full flex-col items-center gap-2 text-white"
      >
        {/* Main heading */}
        <h2 className="text-center text-2xl font-bold text-white md:text-[2.125rem]">
          Report and Track <span className="text-accent">Data Breaches</span>
        </h2>

        {/* Sub heading */}
        <p className="text-center text-sm md:text-base">
          A secure and transparent platform designed to help individuals and organizations report, monitor,
          and resolve data breaches efficiently.
        </p>
      </motion.div>

      {/* IMAGE */}
      <motion.img
        src={DashboardPreviewImage}
        alt="Data breach reporting dashboard preview"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
        className="h-full rounded-lg shadow-[0px_12px_32px_rgba(0,0,0,0.4)]"
      />
    </section>
  );
};

export default DataBreachSection;
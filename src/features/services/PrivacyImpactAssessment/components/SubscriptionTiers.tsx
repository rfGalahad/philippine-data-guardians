import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/motion';

import TierCard from "./TierCard";

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const TIERS = [
  {
    name: 'Basic',
    price: '999',
    description: 'Ideal for small businesses conducting their first PIA.',
    features: [
      '1 Privacy Impact Assessment (PIA) project'
    ],
  },
  {
    name: 'Professional',
    price: '2,999',
    description: 'For growing organizations with multiple data processes.',
    features: [
      '10 Privacy Impact Assessment (PIA) project',
      'Risk Dashboard'
    ],
  },
  {
    name: 'Enterprise',
    price: '8,999',
    description: 'Full-scale PIA for complex, multi-department environments.',
    features: [
      'Unlimited Privacy Impact Assessment (PIA) project',
      'Risk Dashboard',
      'Team Access'
    ],
  },
];

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const SubscriptionTiers = () => {
  return (
    <section className="bg-[#F7F9FC] py-20">
      <div className='mx-auto max-w-6xl'>
        {/* HEADING */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={itemVariants}
          className="mb-16 max-w-2xl"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            Subscription <span className="text-accent-2">Tiers</span>
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#5B6560]">
            Choose the plan that best fits your organization's size and compliance needs.
          </p>
        </motion.div>

        {/* TIER CARDS */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {TIERS.map((tier) => (
            <motion.div key={tier.name} variants={itemVariants}>
              <TierCard tier={tier} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SubscriptionTiers;
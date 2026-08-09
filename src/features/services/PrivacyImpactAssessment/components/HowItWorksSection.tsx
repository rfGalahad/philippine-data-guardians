import { motion } from 'framer-motion';
import { FileSearch, TriangleAlert, ClipboardCheck, ChevronDown, type LucideIcon } from 'lucide-react';
import { containerVariants, itemVariants } from '@/lib/motion';
import type { Variants } from 'framer-motion';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface Step {
  icon: LucideIcon;
  step: string;
  color: string;
  backgroundColor: string;
  title: string;
  description: string;
}

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const TIP = 40;
const GAP = 14;

const cardVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const STEPS: Step[] = [
  {
    icon: FileSearch,
    step: '01',
    color: '#1D9E75',
    backgroundColor: '#E1F5EE',
    title: 'Set Up & Answer',
    description:
      'Provide organization details and complete a guided questionnaire about your data processing activities.',
  },
  {
    icon: TriangleAlert,
    step: '02',
    color: '#378ADD',
    backgroundColor: '#E6F1FB',
    title: 'Analyze & Review Risks',
    description:
      'Our system evaluates your inputs, calculates risk levels, and shows insights in a clear dashboard with recommended actions.',
  },
  {
    icon: ClipboardCheck,
    step: '03',
    color: '#D85A30',
    backgroundColor: '#FAECE7',
    title: 'Generate & Export Report',
    description:
      'Automatically generate your full Privacy Impact Assessment report and export it in PDF or DOCX.',
  },
];

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const HowItWorksSection = () => {
  return (
    <section className="relative bg-white py-20">
      <div className="relative mx-auto max-w-6xl">
        {/* HEADING */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={itemVariants}
          className="mb-16 max-w-2xl"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
            How It <span className='text-accent-2'>Works</span>
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#5B6560]">
            Three steps from raw questionnaire answers to an audit-ready
            report — each one logged, timestamped, and traceable.
          </p>
        </motion.div>

        {/* Steps — desktop: interlocking arrow blocks */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={containerVariants}
          className="hidden md:flex md:items-stretch"
        >
          {STEPS.map(({ icon: Icon, step, color, backgroundColor, title, description }, i) => {
            const isFirst = i === 0;
            const clipPath = isFirst
              ? `polygon(0 0, calc(100% - ${TIP}px) 0, 100% 50%, calc(100% - ${TIP}px) 100%, 0 100%)`
              : `polygon(0 0, calc(100% - ${TIP}px) 0, 100% 50%, calc(100% - ${TIP}px) 100%, 0 100%, ${TIP}px 50%)`;

            return (
              <motion.div
                key={step}
                variants={cardVariants}
                className="flex flex-1 flex-col border py-9"
                style={{
                  clipPath,
                  background: `linear-gradient(
                    160deg,
                    ${backgroundColor} 0%,
                    ${backgroundColor} 35%,
                    color-mix(in srgb, ${backgroundColor} 80%, #f8fafc) 100%
                  )`,
                  borderColor: `${color}33`,
                  marginLeft: isFirst ? 0 : -(TIP - GAP),
                  zIndex: STEPS.length - i,
                  paddingLeft: isFirst ? 28 : TIP + 20,
                  paddingRight: TIP + 24,
                  filter: 'drop-shadow(0 2px 6px rgba(20,35,29,0.06))',
                }}
              >
                <Icon size={30} strokeWidth={1.75} color={color} className="mb-4" />
                <span className="mb-3 font-mono text-xs font-semibold tracking-wider" style={{ color }}>
                  STEP {step}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-[#14231D]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#5B6560]">{description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Steps — mobile: stacked blocks with a down-connector between them */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={containerVariants}
          className="flex flex-col md:hidden"
        >
          {STEPS.map(({ icon: Icon, step, color, backgroundColor, title, description }, i) => (
            <motion.div key={step} variants={cardVariants}>
              <div
                className="rounded-2xl border p-6"
                style={{
                  background: `linear-gradient(160deg, ${backgroundColor} 0%, #FFFFFF 75%)`,
                  borderColor: `${color}33`,
                }}
              >
                <Icon size={28} strokeWidth={1.75} color={color} className="mb-4" />
                <span className="mb-2 block font-mono text-xs font-semibold tracking-wider" style={{ color }}>
                  STEP {step}
                </span>
                <h3 className="mb-2 text-lg font-semibold text-[#14231D]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#5B6560]">{description}</p>
              </div>

              {i < STEPS.length - 1 && (
                <div className="flex justify-center py-2">
                  <ChevronDown aria-hidden="true" size={18} className="text-[#C3CAC5]" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
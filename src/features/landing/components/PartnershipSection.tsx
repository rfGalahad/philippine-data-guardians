import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/motion';

import partnerOne from '@/assets/partners/partner_cyber404.webp';
import partnerTwo from '@/assets/partners/partner_iotconferenceph.webp';
import partnerThree from '@/assets/partners/partner_redwizard.webp';
import partnerFour from '@/assets/partners/partner_numoa.webp';
import partnerFive from '@/assets/partners/partner_olivarezcollege.webp';
import partnerSix from '@/assets/partners/partner_nordvpn.webp';

type Partner = {
  name: string;
  logo: string;
  href?: string;
};

const partners: Partner[] = [
  { name: 'Cyber 404', logo: partnerOne },
  { name: 'IoT Conference Ph', logo: partnerTwo },
  { name: 'Red Wizard Events Technology', logo: partnerThree },
  { name: 'National University MoA', logo: partnerFour },
  { name: 'Olivarez College', logo: partnerFive },
  { name: 'Nord VPN', logo: partnerSix },
];

const PartnerLogo = ({ partner }: { partner: Partner }) => {
  const content = (
    <div className="group/logo relative flex h-24 w-44 shrink-0 items-center justify-center">
      <img
        src={partner.logo}
        alt={partner.name}
        loading="lazy"
        draggable={false}
        className="max-h-14 w-auto max-w-32 object-contain transition duration-300 group-hover/logo:-translate-y-2"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-2 translate-y-1 text-center text-[11px] font-medium tracking-wide text-white/80 opacity-0 transition duration-200 group-hover/logo:translate-y-0 group-hover/logo:opacity-100"
      >
        {partner.name}
      </span>
    </div>
  );

  return partner.href ? (
    <a
      href={partner.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={partner.name}
      className="shrink-0"
    >
      {content}
    </a>
  ) : (
    content
  );
};

export const PartnershipSection = () => {
  return (
    <section
      id="partners"
      className="mx-auto mt-16 max-w-7xl scroll-mt-24 px-4"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white md:text-[2.125rem]">
            Our <span className="text-accent">Partners</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70 md:text-base">
            Working together with organizations that share our commitment to
            data privacy and cybersecurity.
          </p>
        </motion.div>

        {/* MARQUEE */}
        <motion.div
          variants={itemVariants}
          className="group overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {/* Two identical groups = seamless loop. The second is decorative. */}
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 gap-4 pr-4"
                aria-hidden={copy === 1}
              >
                {partners.map((partner) => (
                  <PartnerLogo key={`${copy}-${partner.name}`} partner={partner} />
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PartnershipSection;
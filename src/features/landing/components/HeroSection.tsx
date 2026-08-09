import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/motion';

import { useLandingNavigation } from '../hooks/useLandingNavigation';

import heroImage from '@/assets/hero-background.png';
import Button from '@/components/ui/Button';


export const HeroSection = () => {

  const { scrollToSection } = useLandingNavigation();

  return (
    <div
      id="home"
      className="min-h-screen flex justify-center items-center bg-cover bg-top bg-no-repeat scroll-mt-16"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <motion.div
        className="w-full max-w-7xl flex flex-col gap-2 px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Protect your data with */}
        <motion.h2
          variants={itemVariants}
          className="text-3xl sm:text-4xl font-bold text-white"
        >
          Protect Your Data with
        </motion.h2>

        {/* Philippine Data */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl font-bold text-accent"
        >
          Philippine Data
        </motion.h1>

        {/* Guardians */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl font-bold text-accent"
        >
          Guardians
        </motion.h1>

        {/* Body */}
        <motion.p
          variants={itemVariants}
          className="max-w-lg text-sm sm:text-lg text-left sm:text-justify text-white"
        >
          Specialized data privacy and cybersecurity strategies for government
          agencies, SMEs, and community organizations. Ensuring compliance,
          strengthening resilience, and building trust in the digital world.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-4 flex flex-col gap-2 sm:flex-row"
        >
          <Button 
            label="Join Us Now"
            color="accent" 
            onClick={() => scrollToSection('join-community')}
          />
          <Button 
            label="Report A Data Breach" 
            variant="outlined" 
            color="accent" 
            onClick={() => scrollToSection('data-breach')}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
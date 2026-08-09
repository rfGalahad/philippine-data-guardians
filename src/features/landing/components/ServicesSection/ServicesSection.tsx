import { motion } from "framer-motion";
import {
  Briefcase,
  ClipboardList,
  FileText,
  Gavel,
  Globe,
  Laptop,
  School,
  ShieldAlert,
} from "lucide-react";

import auditAssessment from "@/assets/services/audit-assessment.png";
import breachResponse from "@/assets/services/breach-response.png";
import complianceConsulting from "@/assets/services/compliance-consulting.png";
import piaService from "@/assets/services/pia-service.png";
import policyDevelopment from "@/assets/services/policy-development.png";
import privacyTraining from "@/assets/services/privacy-training.png";
import researchAdvocacy from "@/assets/services/research-advocacy.png";
import techSolutions from "@/assets/services/tech-solutions.png";

import ServiceCard from "./ServiceCard";

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const SERVICES_ITEM = [
  {
    title: "Privacy Impact Assesment (PIA)",
    description: "Assess organizational processes and systems for privacy risk.",
    icon: Briefcase,
    image: piaService,
    link: "/services/privacy-impact-assessment",
  },
  {
    title: "Data Privacy & Cybersecurity Trainings",
    description: "Conduct workshops, webinars, and seminars.",
    icon: School,
    image: privacyTraining,
    link: "/services/privacy-training",
  },
  {
    title: "Compliance Consulting",
    description:
      "Assistance with compliance to the Data Privacy Act (RA 10173) and other regulations.",
    icon: Gavel,
    image: complianceConsulting,
    link: "/services/compliance-consulting",
  },
  {
    title: "Policy & Framework Development",
    description: "Drafting privacy manuals, data sharing agreements, and security policies.",
    icon: FileText,
    image: policyDevelopment,
    link: "/services/policy-development",
  },
  {
    title: "Data Breach Response & Management",
    description: "Incident handling, reporting, and mitigation support.",
    icon: ShieldAlert,
    image: breachResponse,
    link: "/services/data-breach-response",
  },
  {
    title: "Audits & Risk Assessment",
    description: "Evaluate systems, networks, and organizational processes for vulnerabilities.",
    icon: ClipboardList,
    image: auditAssessment,
    link: "/services/audit-risk-assessment",
  },
  {
    title: "Research & Advocacy",
    description: "Collaborations on studies, projects, and policy development.",
    icon: Globe,
    image: researchAdvocacy,
    link: "/services/research-advocacy",
  },
  {
    title: "Technology Solutions",
    description: "Privacy-by-design tools and secure information systems.",
    icon: Laptop,
    image: techSolutions,
    link: "/services/technology-solutions",
  },
];

//-----------------------------------------------------------
// MAIN COMPONENTS
//-----------------------------------------------------------

export const ServicesSection = () => {
  return (
    <div
      id="services"
      className="scroll-mt-24 mx-auto mt-16 flex max-w-7xl flex-col justify-center gap-8 px-4"
    >
      {/* SERVICES - HEADING */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col gap-1 text-center"
      >
        <h2 className="text-2xl font-bold text-white md:text-[2.125rem]">
          Our <span className="text-accent">Services</span>
        </h2>
        <p className="text-center text-sm text-white md:text-base">
          We deliver tailored data privacy and cybersecurity strategies designed to meet
          the unique needs of government agencies, SMEs, and community organizations.
        </p>
      </motion.div>

      {/* SERVICES */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES_ITEM.map((item, index) => (
          <ServiceCard key={item.title} {...item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
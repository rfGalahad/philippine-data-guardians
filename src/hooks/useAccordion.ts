import { useState } from "react";

type Section =
  | "personalInfo"
  | "address"
  | "photo"
  | "memberDetails";

export const useAccordion = (
  initialSection: Section | null = null
) => {
  
  const [openSection, setOpenSection] = useState<Section | null>(initialSection);

  const toggleSection = (section: Section) => {
    setOpenSection((current) =>
      current === section ? null : section
    );
  };

  const collapse = () => {
    setOpenSection(null);
  };

  return {
    openSection,
    toggleSection,
    collapse,
  };
};
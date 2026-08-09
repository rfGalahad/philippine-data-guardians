import { useLandingNavigation } from "../../hooks/useLandingNavigation";

const QUICK_LINKS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Membership', id: 'join-community' },
  { label: 'Services', id: 'services' },
  { label: 'Data Breach Report', id: 'report' },
  { label: 'Contact', id: 'contact' },
];

export const QuickLinks = () => {
  
  const { scrollToSection } = useLandingNavigation();
  
  return (
    <div className="flex flex-[0.5] flex-col gap-4">
      {/* Header */}
      <h3 className="text-base font-bold text-[#F7CF13]">Quick Links</h3>

      {/* Links */}
      <div className="flex flex-col gap-2">
        {QUICK_LINKS.map((link) => (
          <a
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            className="w-fit cursor-pointer text-sm text-inherit underline decoration-transparent transition-all duration-300 ease-in-out hover:pl-2 hover:text-[#F7CF13] hover:decoration-current"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};
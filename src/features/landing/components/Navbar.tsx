import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLandingNavigation } from "../hooks/useLandingNavigation";
import pdgLogo from '@/assets/logo-pdg-1.png';

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const NAV_ITEMS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Membership", id: "join-community" },
  { label: "Services", id: "services" },
  { label: "Data Breach Report", id: "data-breach" },
  { label: "Contact", id: "contact" },
  { label: "Articles", id: "articles" },
  { label: "Infographics", id: "infographics" },
];

//-----------------------------------------------------------
// INTERFACE
//-----------------------------------------------------------

interface NavbarProps {
  activeId?: string;
}

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const Navbar = ({ activeId }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const { scrollToSection } = useLandingNavigation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // SCROLL-SPY
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Consider only sections currently intersecting the "active zone"
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        // Prefer the one closest to the top of the viewport
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );

        setActiveSection(topMost.target.id);
      },
      {
        // Shrinks the detection zone to a band near the top of the viewport,
        // accounting for the fixed header height (~80px)
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Allow an explicit activeId prop to override the auto-detected one
  const currentActive = activeId ?? activeSection;

  const handleNavigate = (id: string) => {
    scrollToSection(id);
    setOpen(false);
  };

  return (
    <header
      className={[
        "fixed top-0 left-0 z-50 w-full transition-colors duration-300",
        scrolled ? "bg-surface-2/90 backdrop-blur-md border-border" : "bg-transparent",
      ].join(" ")}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* PDG LOGO */}
        <div className="flex gap-2 items-center text-lg font-semibold tracking-tight text-white">
          <img src={pdgLogo} alt="Philippine Data Guardians logo" className="h-8 w-8 object-contain" />
          <span className="hidden sm:block">PHILIPPINE DATA GUARDIANS</span>
        </div>

        {/* NAV ITEMS */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === currentActive;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={[
                    "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium",
                    "cursor-pointer transition-colors duration-150",
                    isActive
                      ? "border-b-2 border-accent rounded-none text-accent"
                      : "text-white/80 hover:hover:border-b-2 border-accent rounded-none",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* MOBILE MENU */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-white/90 hover:bg-white/10 hover:text-white lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* MOBILE DROPDOWN */}
      <div
        className={[
          "overflow-hidden transition-[max-height,opacity] duration-300 ease-out lg:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <ul className="space-y-1 border-t border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === currentActive;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  className={[
                    "flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium",
                    "transition-colors duration-150",
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
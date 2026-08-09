import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";


export const ScrollToTopButton = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 50;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-1000 sm:bottom-6 sm:right-6">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="scroll back to top"
        className={[
          "flex h-12 w-12 cursor-pointer items-center justify-center rounded-full",
          "bg-[#2563eb] text-white shadow-[0_4px_10px_rgba(0,0,0,0.3)]",
          "transition-all duration-300 ease-out hover:bg-[#1d4ed8]",
          isScrolled
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-75 opacity-0",
        ].join(" ")}
      >
        <ChevronUp className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ScrollToTopButton;
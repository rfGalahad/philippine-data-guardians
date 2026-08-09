export const useLandingNavigation = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "auto",
      block: "start",
    });
  };

  return {
    scrollToSection,
  };
};
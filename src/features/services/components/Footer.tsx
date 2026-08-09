export const Footer = () => {
  return (
    <div id="footer" className="bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-8 text-white">

        {/* BOTTOM SECTION */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* COPYRIGHT NOTICE */}
          <p className="text-center text-sm sm:text-left">
            © 2026 Philippine Data Guardians. All rights reserved.
          </p>

          {/* TAGLINE */}
          <p className="text-center text-sm text-accent sm:text-right">
            Securing your digital future.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
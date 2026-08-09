import { CompanyDetails } from './CompanyDetails';
import { ContactInformation } from './ContactInformation';
import { QuickLinks } from './QuickLinks';

export const Footer = () => {
  return (
    <div id="footer" className="bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-8 text-white">
        {/* TOP SECTION */}
        <div className="flex flex-col gap-8 sm:flex-row">
          {/* COMPANY DETAILS */}
          <CompanyDetails />

          {/* QUICK LINKS */}
          <QuickLinks />

          {/* CONTACT INFO */}
          <ContactInformation />
        </div>

        <hr className="my-6 border-white/20" />

        {/* BOTTOM SECTION */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* COPYRIGHT NOTICE */}
          <p className="text-center text-sm sm:text-left">
            © 2026 Philippine Data Guardians. All rights reserved.
          </p>

          {/* ADMIN LOGIN LINK */}
          <a
            href="/admin/login"
            className="cursor-pointer text-sm text-accent underline decoration-transparent transition-opacity duration-300 ease-in-out hover:opacity-80 hover:decoration-current"
          >
            ®
          </a>

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
import { Link } from 'react-router-dom';

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const LOGO_SRC = 'https://res.cloudinary.com/diuruuyas/image/upload/f_auto,q_auto/logo-pdg-1_gojiba';

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

type BrandLogoProps = {
  to?: string | null;
  variant?: 1 | 2 | 3;
  className?: string;
};

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

const BrandLogo = ({
  to = '/',
  variant = 1,
  className = '',
}: BrandLogoProps) => {

  const content = (
    <div className={`flex items-center gap-2.5 text-left ${className}`}>
      <img
        className="h-6 w-auto object-contain"
        src={LOGO_SRC}
        alt="Philippine Data Guardians logo"
        loading="eager"
        decoding="async"
      />

      {variant === 1 && (
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-white">
          Philippine Data <span className="text-accent">Guardians</span>
        </p>
      )}

      {variant === 2 && (
        <div className="flex flex-col leading-tight">
          <span className="text-base font-bold tracking-tight text-white">
            Admin Dashboard
          </span>
          <span className="text-[0.7rem] tracking-wide text-text-secondary">
            Philippine Data Guardians
          </span>
        </div>
      )}
    </div>
  );

  if (!to) return content;

  return (
    <Link
      to={to}
      className="inline-flex rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white/40"
      aria-label="Philippine Data Guardians, go to homepage"
    >
      {content}
    </Link>
  );
};

export default BrandLogo;
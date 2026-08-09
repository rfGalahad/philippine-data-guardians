import PDGLogo from '@/assets/logo-pdg-1.png'

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const SOCIAL_LINKS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
      </svg>
    ),
    url: 'https://www.facebook.com/profile.php?id=61578893785140',
    label: 'Facebook',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 18.34V10.1H5.67v8.24h2.67ZM7 8.98a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1ZM18.34 18.34v-4.44c0-2.38-1.27-3.49-2.97-3.49-1.37 0-1.98.75-2.32 1.28v-1.1h-2.67c.04.75 0 8.24 0 8.24h2.67v-4.6c0-.25.02-.5.09-.68.2-.5.65-1.02 1.42-1.02.99 0 1.39.76 1.39 1.87v4.43h2.68Z" />
      </svg>
    ),
    url: 'https://www.linkedin.com/company/philippine-data-guardians/',
    label: 'LinkedIn',
  },
];

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const CompanyDetails = () => {

  return (
    <div className="flex flex-2 flex-col gap-4">
      {/* COMPANY INFO */}
      <div className="flex flex-row items-center gap-2">
        <img src={PDGLogo} alt="Logo" className="h-6" />
        <div className="text-sm font-bold md:text-base">
          PHILIPPINE DATA <span className="text-acccent">GUARDIANS</span>
        </div>
      </div>

      {/* TAGLINE */}
      <p className="text-justify text-sm leading-[1.7]">
        Protecting your data, ensuring compliance, and empowering secure
        operations in the digital world.
      </p>

      {/* SOCIAL MEDIA ICONS */}
      <div className="mt-1 flex flex-row gap-2">
        {SOCIAL_LINKS.map((social) => (
          <a
            key={social.label}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 ease-in-out hover:-translate-y-0.75 hover:bg-[#F7CF13] hover:text-primary"
          >
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  );
};
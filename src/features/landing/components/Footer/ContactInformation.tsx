 const CONTACT_INFO = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    text: 'C5 Ext. Paranaque City, Metro Manila',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
      </svg>
    ),
    text: '(+63) 929 344 5296',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 6-10 7L2 6" />
      </svg>
    ),
    text: 'members@phdataguardians.org',
  },
];

export const ContactInformation = () => {
  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* HEADER */}
      <h3 className="text-base font-bold text-accent">
        Contact Us
      </h3>

      {/* CONTACT DETAILS */}
      <div className="flex flex-col gap-2">
        {CONTACT_INFO.map((info, index) => (
          <div key={index} className="flex flex-row items-start gap-2">
            <span className="text-accent">{info.icon}</span>
            <p className="text-sm">{info.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
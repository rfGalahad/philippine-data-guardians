import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import pdgBackground from '@/assets/pdg-background.png';

export const EmptyPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-2 bg-cover bg-center px-6 text-center"
      style={{ backgroundImage: `url(${pdgBackground})` }}
    >
      {/* PULSING DOTS */}
      <div className="mb-8 flex gap-2">
        {[0, 0.2, 0.4].map((delay, i) => (
          <span
            key={i}
            className="h-4 w-4 animate-pulse rounded-full bg-white"
            style={{ animationDelay: `${delay}s`, animationDuration: '1.4s' }}
          />
        ))}
      </div>

      {/* HEADING */}
      <h2 className="text-xl font-semibold text-[#F7CF13] sm:text-2xl">
        This page isn&apos;t ready yet
      </h2>

      {/* SUBTEXT */}
      <p className="max-w-95
      x] text-sm leading-loose text-white">
        We&apos;re still building this feature. Check back soon.
      </p>

      {/* GO BACK */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className={[
          "mt-4 flex cursor-pointer items-center gap-2 rounded-md px-3 py-2",
          "text-sm normal-case text-white transition-colors duration-200 ease-in-out",
          "hover:bg-transparent hover:underline",
        ].join(" ")}
      >
        <ArrowLeft size={18} />
        Go Back
      </button>
    </div>
  );
};

export default EmptyPage;
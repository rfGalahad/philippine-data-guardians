import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, RotateCcw, XCircle } from 'lucide-react';

import BackgroundImage from '@/assets/pdg-background.png';
import Button from '../ui/Button';

//-----------------------------------------------------------
// TYPES & CONSTANTS
//-----------------------------------------------------------

type ServiceName = 'membership' | 'privacy-impact-assessment';

const isServiceName = (value?: string): value is ServiceName =>
  value === 'membership' || value === 'privacy-impact-assessment';

const SERVICE_LABEL: Record<ServiceName, string> = {
  membership: 'your membership',
  'privacy-impact-assessment': 'your privacy impact assessment',
};

// Only allow internal paths to avoid open redirects
const getSafeReturnPath = (value: string | null) =>
  value && value.startsWith('/') && !value.startsWith('//') ? value : '/';

const cancelledMessage = (serviceName?: ServiceName) => (
  <>
    You cancelled the checkout before paying, so{' '}
    {serviceName ? SERVICE_LABEL[serviceName] : 'your order'} wasn&apos;t started and you
    haven&apos;t been charged. You can try again whenever you&apos;re ready.
  </>
);
//-----------------------------------------------------------
// STYLES
//-----------------------------------------------------------

const keyframes = `
  @keyframes ripple { 0% { transform: scale(0.85); opacity: 0.5; } 100% { transform: scale(1.9); opacity: 0; } }
  @keyframes popIn  { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  @keyframes fadeUp { 0% { transform: translateY(10px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
`;

//-----------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------

export const PaymentCancelledPage = () => {
  const navigate = useNavigate();

  const { service } = useParams<{ service: string }>();
  const [searchParams] = useSearchParams();
  const serviceName = isServiceName(service) ? service : undefined;
  const returnPath = getSafeReturnPath(searchParams.get('returnTo'));

  return (
    <>
      <style>{keyframes}</style>
      <div
        className="flex min-h-dvh w-full justify-center bg-cover bg-center px-6"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="mx-auto flex w-full max-w-sm flex-col justify-center gap-8">
          <div className="flex flex-col items-center justify-center text-center">
            {/* PAYMENT CANCELLED - LOGO */}
            <div className="relative mb-6 inline-flex h-18 w-18 items-center justify-center md:h-24 md:w-24">
              <span className="absolute inset-0 rounded-full border border-[rgba(245,158,11,0.4)] opacity-0 animate-[ripple_1.6s_ease-out_0.35s_forwards]" />
              <span className="absolute inset-0 rounded-full border border-[rgba(245,158,11,0.4)] opacity-0 animate-[ripple_1.6s_ease-out_0.85s_forwards]" />
              <div className="flex h-full w-full items-center justify-center rounded-full border border-[rgba(245,158,11,0.28)] bg-[rgba(245,158,11,0.1)] animate-[popIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_both]">
                <XCircle className="h-9 w-9 text-[#f59e0b] md:h-11 md:w-11" strokeWidth={1.5} />
              </div>
            </div>

            {/* BADGE */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[rgba(245,158,11,0.22)] bg-[rgba(245,158,11,0.07)] px-3 py-1 animate-[fadeUp_0.4s_ease_0.2s_both]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.13em] text-[#f59e0b]">
                Payment cancelled
              </span>
            </div>

            {/* HEADING */}
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white animate-[fadeUp_0.4s_ease_0.3s_both] md:text-3xl">
              Your payment didn&apos;t go through
            </h1>

            {/* DESCRIPTION */}
            <p className="text-sm text-gray-400 animate-[fadeUp_0.4s_ease_0.4s_both]">
              {cancelledMessage(serviceName)}
            </p>
          </div>

          <div className="flex flex-col gap-2 animate-[fadeUp_0.4s_ease_0.55s_both]">
            <Button
              label="Try again"
              onClick={() => navigate(returnPath, { replace: true })}
              color="accent"
              variant="text"
              prefixIcon={RotateCcw}
            />
            <Button
              label="Back to Homepage"
              onClick={() => navigate('/', { replace: true })}
              color="neutral"
              variant="text"
              prefixIcon={ArrowLeft}
            />
          </div>

          <p className="text-center text-xs text-gray-400 animate-[fadeUp_0.4s_ease_0.75s_both]">
            Think you were charged? Contact us and include your payment reference.
          </p>
        </div>
      </div>
    </>
  );
};

export default PaymentCancelledPage;
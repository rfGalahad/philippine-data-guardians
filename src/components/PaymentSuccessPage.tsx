import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';

import type { ServiceName } from '@/features/checkout/api/createCheckout';

import BackgroundImage from '@/assets/pdg-background.png';
import Button from './ui/Button';

//----------------------------------------------------------- 
// CONSTANTS 
//----------------------------------------------------------- 

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const membershipMessage = (email: string) => (
  <>
    You&apos;re now a PDG Member! We&apos;ve sent a confirmation email to{' '}
    <span className="text-accent">{email}</span>. Please check your inbox and spam folder for an
    email from Philippine Data Guardians.
  </>
);

const subscriptionMessage = (email: string) => (
  <>
    Your subscription is now active. We&apos;ve sent a link to{' '}
    <span className="text-accent">{email}</span> so you can set your password. Please check your
    inbox and spam folder for an email from Philippine Data Guardians.
  </>
);

//----------------------------------------------------------- 
// TYPES 
//----------------------------------------------------------- 

type Status = 'checking' | 'verified' | 'invalid';

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
 
export const PaymentSuccessPage = () => {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const reference = searchParams.get('ref');

  const [status, setStatus] = useState<Status>(() => (reference ? 'checking' : 'invalid'));
  const [email, setEmail] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState<ServiceName>();

  useEffect(() => {
    if (!reference) return;

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ reference }),
        });

        const data = await res.json();

        console.log("DATA", data)

        if (data.paid) {
          setEmail(data.email);
          setServiceName(data.serviceName);
          setStatus('verified');
          clearInterval(interval);
        } else if (attempts >= 6) {
          setStatus('invalid');
          clearInterval(interval);
        }
      } catch {
        if (attempts >= 6) {
          setStatus('invalid');
          clearInterval(interval);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [reference]);

  if (status === 'checking') {
    return (
      <div
        className="flex h-screen w-full items-center justify-center bg-cover bg-center px-6"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Confirming your payment…</p>
        </div>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div
        className="flex h-screen w-full items-center justify-center bg-cover bg-center px-6"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-4 text-center">
          <XCircle className="h-10 w-10 text-red-500" strokeWidth={1.5} />
          <h1 className="text-xl font-bold text-text-primary">
            We couldn&apos;t confirm this payment
          </h1>
          <p className="text-sm text-gray-500">
            If you just paid, this can take a moment to sync — try refreshing.
            Otherwise, this link isn&apos;t valid.
          </p>
          <Button
            label='Back to Homepage'
            variant='text'
            onClick={() => navigate("/")}
            prefixIcon={ArrowLeft}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{keyframes}</style>
      <div
        className="flex h-screen w-full justify-center bg-cover bg-center px-6"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="mx-auto flex w-full max-w-sm flex-col justify-center gap-8">
          <div className="flex flex-col items-center justify-center text-center">
            {/* PAYMENT CONFIRMED - LOGO */}
            <div className="relative mb-6 inline-flex h-18 w-18 items-center justify-center md:h-24 md:w-24">
              <span className="absolute inset-0 rounded-full border border-[rgba(34,197,94,0.4)] opacity-0 animate-[ripple_1.6s_ease-out_0.35s_forwards]" />
              <span className="absolute inset-0 rounded-full border border-[rgba(34,197,94,0.4)] opacity-0 animate-[ripple_1.6s_ease-out_0.85s_forwards]" />
              <div className="flex h-full w-full items-center justify-center rounded-full border border-[rgba(34,197,94,0.28)] bg-[rgba(34,197,94,0.1)] animate-[popIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_both]">
                <CheckCircle className="h-9 w-9 text-[#22c55e] md:h-11 md:w-11" strokeWidth={1.5} />
              </div>
            </div>

            {/* PAYMENT CONFIRMED - TEXT */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[rgba(34,197,94,0.22)] bg-[rgba(34,197,94,0.07)] px-3 py-1 animate-[fadeUp_0.4s_ease_0.2s_both]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.13em] text-[#22c55e]">
                Payment confirmed
              </span>
            </div>

            {/* HEADING */}
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-white animate-[fadeUp_0.4s_ease_0.3s_both] md:text-3xl">
              You&apos;re officially {serviceName === 'membership' ? 'a member!' : 'subscribed!'}
            </h1>

            {/* DESCRIPTION */}
            <p className="text-sm text-gray-500 animate-[fadeUp_0.4s_ease_0.4s_both]">
              {serviceName === 'membership'
                ? membershipMessage(email ?? 'your email')
                : subscriptionMessage(email ?? 'your email')}
            </p>
          </div>

          <Button
            label='Back to Homepage'
            onClick={() => navigate("/")}
            color='neutral'
            variant='text'
            prefixIcon={ArrowLeft}
          />

          <p className="text-center text-xs text-gray-400 animate-[fadeUp_0.4s_ease_0.75s_both]">
            Didn&apos;t get the email? Check your spam folder.
          </p>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccessPage;
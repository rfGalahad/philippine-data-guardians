import { useEffect, useState } from 'react';

// --------------------------------------------------------------------------------------------//
// CONSTANTS
// --------------------------------------------------------------------------------------------//

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const MAX_ATTEMPTS = 8;
const INTERVAL_MS = 2000;

// --------------------------------------------------------------------------------------------//
// TYPES
// --------------------------------------------------------------------------------------------//

export type VerifyStatus = 'checking' | 'verified' | 'invalid';

interface VerifyState {
  status: VerifyStatus;
  email: string | null;
  serviceName: string | null;
}

// --------------------------------------------------------------------------------------------//
// HOOK
// --------------------------------------------------------------------------------------------//
export function useVerifyPayment(reference: string | null): VerifyState {
  
  const [state, setState] = useState<VerifyState>({
    status: reference ? 'checking' : 'invalid',
    email: null,
    serviceName: null,
  });

  useEffect(() => {
    if (!reference) return;

    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;

    const poll = async () => {
      attempts++;
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ reference }),
        });
        const data = await res.json();

        if (data.paid) {
          setState({
            status: 'verified',
            email: data.email ?? null,
            serviceName: data.serviceName ?? null,
          });
          return;
        }
      } catch {
        if (controller.signal.aborted) return;
      }

      if (attempts >= MAX_ATTEMPTS) {
        setState((s) => ({ ...s, status: 'invalid' }));
        return;
      }
      timer = setTimeout(poll, INTERVAL_MS);
    };

    poll();

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [reference]);

  return state;
}
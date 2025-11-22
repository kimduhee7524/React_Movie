'use client';

import { NextErrorPage } from '@/errors/components/NextErrorPage';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return <NextErrorPage error={error} reset={reset} />;
}

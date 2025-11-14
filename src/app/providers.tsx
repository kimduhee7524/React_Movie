'use client';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/api/queryClient';
import { useEffect, useState } from 'react';
import { setupGlobalErrorHandlers } from '@/errors';
import { ErrorBoundary } from '@/errors';
import { NextErrorPage } from '@/errors/components/NextErrorPage';
import Navbar from '@/layouts/components/Navbar';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== 'undefined') {
      setupGlobalErrorHandlers();
    }

    console.log('[ReactQueryProvider] Error handling initialized');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground overflow-y-auto relative">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-6 relative z-10">
          <ErrorBoundary
            fallback={(error, reset) => (
              <div className="min-h-[60vh]">
                <NextErrorPage error={error} reset={reset} />
              </div>
            )}
            onReset={() => window.location.reload()}
            onError={(error, errorInfo) => {
              if (process.env.NODE_ENV === 'development') {
                console.error('[ErrorBoundary] Component Error:', error);
                console.error('[ErrorBoundary] Error Info:', errorInfo);
              }
            }}
          >
            {children}
          </ErrorBoundary>
        </main>
      </div>
      {isClient && (
        <ReactQueryDevtools
          initialIsOpen={true}
          buttonPosition="bottom-right"
          position="bottom"
        />
      )}
    </QueryClientProvider>
  );
}

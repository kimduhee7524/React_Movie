'use client';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { setupGlobalErrorHandlers } from '@/errors';
import { ErrorBoundary } from '@/errors';
import { NextErrorPage } from '@/errors/components/NextErrorPage';
import { handleError } from '@/errors';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        throwOnError: true,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: 60 * 1000,
      },
      mutations: {
        throwOnError: false,
        onError: (error) => {
          handleError(error);
        },
      },
    },
  });
}

// 브라우저 전용 (서버에서는 사용 안 함)
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  // 서버: 매 요청마다 새로운 QueryClient 생성
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }

  // 브라우저: 한 번만 생성하고 재사용
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(getQueryClient);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setupGlobalErrorHandlers();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
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

      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition="bottom-right"
        position="bottom"
      />
    </QueryClientProvider>
  );
}

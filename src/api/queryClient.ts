import { QueryClient } from '@tanstack/react-query';
import { handleError } from '@/errors';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: {
      throwOnError: false,
      onError: (error) => {
        handleError(error);
      },
    },
  },
});


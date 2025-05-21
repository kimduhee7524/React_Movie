import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: false,
      retry: 1,
    },
    mutations: {
      throwOnError: false,
    },
  },
});

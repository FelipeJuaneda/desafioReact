import { QueryClient } from "@tanstack/react-query";
import { TmdbError } from "@/services/tmdb/client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Catalog data barely changes within a session: serve it from cache for 5 minutes.
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      // A 4xx (unknown id, bad params) will not fix itself; retry only network/5xx errors once.
      retry: (failureCount, error) =>
        !(error instanceof TmdbError && error.status < 500) && failureCount < 1,
    },
  },
});

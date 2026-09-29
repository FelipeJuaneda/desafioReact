import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router";

/** Renders UI inside the app-level providers, at the given route. */
export const renderWithProviders = (ui: ReactElement, { route = "/" } = {}) => {
  // A fresh client per test: no cache shared between tests, no retries slowing failures down.
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
};

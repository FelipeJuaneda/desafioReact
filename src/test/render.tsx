import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { createMemoryRouter, MemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { routes } from "@/app/routes";
import AuthProvider from "@/features/auth/AuthProvider";
import FavoritesProvider from "@/features/favorites/FavoritesProvider";

// A fresh client per test: no cache shared between tests, no retries slowing failures down.
const testQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

/** Renders a component with query cache and a router, for isolated UI tests. */
export const renderWithProviders = (ui: ReactElement, { route = "/" } = {}) =>
  render(
    <QueryClientProvider client={testQueryClient()}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );

/** Renders the whole app (real routes and providers) at a URL. Firebase must be mocked. */
export const renderApp = (url: string) => {
  const router = createMemoryRouter(routes, { initialEntries: [url] });
  const view = render(
    <QueryClientProvider client={testQueryClient()}>
      <AuthProvider>
        <FavoritesProvider>
          <RouterProvider router={router} />
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>,
  );
  return { ...view, router };
};

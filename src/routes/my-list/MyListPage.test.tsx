import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Favorite } from "@/features/favorites/favorite";
import {
  FavoriteContext,
  type FavoriteContextValue,
} from "@/features/favorites/useFavoriteContext";
import MyListPage from "./MyListPage";

vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { error: vi.fn() }) }));

// The next showing asks TMDB for its backdrop; these tests are about the list, so it never answers.
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => new Promise(() => {})),
  );
});

const favorite = (overrides: Partial<Favorite>): Favorite => ({
  id: "movie-550",
  tmdbId: 550,
  mediaType: "movie",
  title: "El Club de la Pelea",
  posterPath: null,
  releaseDate: "1999-10-15",
  voteAverage: 8.4,
  addedAt: new Date(2026, 4, 3),
  ...overrides,
});

const renderList = (value: Partial<FavoriteContextValue>, url = "/mi-lista") => {
  const context: FavoriteContextValue = {
    favorites: [],
    status: "ready",
    isFavorite: () => false,
    addFavorite: vi.fn(async () => {}),
    removeFavorite: vi.fn(async () => {}),
    ...value,
  };
  const router = createMemoryRouter([{ path: "/mi-lista", element: <MyListPage /> }], {
    initialEntries: [url],
  });
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <FavoriteContext.Provider value={context}>
        <RouterProvider router={router} />
      </FavoriteContext.Provider>
    </QueryClientProvider>,
  );
  return { context, router };
};

// Saved in this order: Alien first (frame 01), then the series, then Fight Club (newest).
const list = [
  favorite({ addedAt: new Date(2026, 4, 3) }),
  favorite({
    id: "tv-1399",
    tmdbId: 1399,
    mediaType: "tv",
    title: "El juego de tronos",
    addedAt: new Date(2026, 3, 20),
  }),
  favorite({
    id: "movie-348",
    tmdbId: 348,
    title: "Alien",
    voteAverage: 8.1,
    addedAt: new Date(2026, 2, 1),
  }),
];

const selection = () => within(screen.getByRole("region", { name: "Tu selección" }));

describe("MyListPage", () => {
  it("invites to explore when nothing is saved", () => {
    renderList({ favorites: [] });
    expect(screen.getByRole("heading", { name: "Todavía no hay nada en cartel" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Explorar películas" })).toHaveAttribute(
      "href",
      "/peliculas",
    );
    expect(screen.getByRole("link", { name: "Explorar series" })).toHaveAttribute(
      "href",
      "/series",
    );
  });

  it("projects the newest title and lays the rest on the contact sheet", () => {
    renderList({ favorites: list });
    expect(screen.getByText(/2 películas y 1 serie esperando función/)).toBeInTheDocument();

    const next = within(screen.getByRole("region", { name: "Próxima función" }));
    expect(next.getByRole("link", { name: "El Club de la Pelea" })).toHaveAttribute(
      "href",
      "/pelicula/550-el-club-de-la-pelea",
    );
    expect(next.getByText("03")).toBeInTheDocument(); // third title saved

    expect(selection().getAllByRole("listitem")).toHaveLength(2);
    expect(selection().getByRole("link", { name: "El juego de tronos" })).toBeInTheDocument();
  });

  it("filters by type and sorts, keeping both in the URL", async () => {
    const { router } = renderList({ favorites: list });

    await userEvent.click(screen.getByRole("button", { name: /películas/i }));
    expect(screen.getByRole("button", { name: /películas/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(router.state.location.search).toBe("?tipo=peliculas");
    expect(selection().queryByRole("link", { name: "El juego de tronos" })).toBeNull();

    await userEvent.selectOptions(screen.getByLabelText("Ordenar por"), "titulo");
    expect(router.state.location.search).toBe("?tipo=peliculas&orden=titulo");
  });

  it("strikes a title off and offers to undo it", async () => {
    const { context } = renderList({ favorites: list });
    await userEvent.click(
      selection().getByRole("button", { name: 'Quitar "El juego de tronos" de Mi lista' }),
    );
    expect(context.removeFavorite).toHaveBeenCalledWith("tv", 1399);
    expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();

    const [message, options] = vi.mocked(toast).mock.calls.at(-1)!;
    expect(message).toBe('Tachaste "El juego de tronos" de tu lista');
    const action = options?.action as { onClick: (event: unknown) => void };
    action.onClick(undefined);
    expect(context.addFavorite).toHaveBeenCalledWith(
      expect.objectContaining({ tmdbId: 1399, mediaType: "tv", title: "El juego de tronos" }),
    );
  });

  it("removes the next showing from its own button", async () => {
    const { context } = renderList({ favorites: list });
    await userEvent.click(screen.getByRole("button", { name: /quitar de la lista/i }));
    expect(context.removeFavorite).toHaveBeenCalledWith("movie", 550);
  });

  it("announces a loading error", () => {
    renderList({ status: "error" });
    expect(screen.getByRole("alert")).toHaveTextContent("No pudimos traer tu lista");
  });
});

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";
import type { Favorite } from "@/features/favorites/favorite";
import {
  FavoriteContext,
  type FavoriteContextValue,
} from "@/features/favorites/useFavoriteContext";
import MyListPage from "./MyListPage";

vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { error: vi.fn() }) }));

const favorite = (overrides: Partial<Favorite>): Favorite => ({
  id: "movie-550",
  tmdbId: 550,
  mediaType: "movie",
  title: "El club de la lucha",
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
    <FavoriteContext.Provider value={context}>
      <RouterProvider router={router} />
    </FavoriteContext.Provider>,
  );
  return { context, router };
};

const list = [
  favorite({}),
  favorite({ id: "tv-1399", tmdbId: 1399, mediaType: "tv", title: "El juego de tronos" }),
];

describe("MyListPage", () => {
  it("invites to explore when nothing is saved", () => {
    renderList({ favorites: [] });
    expect(screen.getByText("Tu mesa de luz está vacía")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explorar películas" })).toHaveAttribute(
      "href",
      "/peliculas",
    );
  });

  it("lists saved titles linking to their page", () => {
    renderList({ favorites: list });
    expect(screen.getByText(/1 película y 1 serie/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "El club de la lucha" })).toHaveAttribute(
      "href",
      "/pelicula/550-el-club-de-la-lucha",
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("filters by type and keeps the filter in the URL", async () => {
    const { router } = renderList({ favorites: list });
    await userEvent.click(screen.getByRole("button", { name: /series/i }));
    expect(screen.getByRole("button", { name: /series/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "El juego de tronos" })).toBeInTheDocument();
    expect(router.state.location.search).toBe("?tipo=series");
  });

  it("removes a title and offers to undo it", async () => {
    const { context } = renderList({ favorites: list });
    const strip = screen.getAllByRole("listitem")[0]!;
    await userEvent.click(within(strip).getByRole("button", { name: /quitar/i }));
    expect(context.removeFavorite).toHaveBeenCalledWith("movie", 550);
    expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();

    const [, options] = vi.mocked(toast).mock.calls.at(-1)!;
    const action = options?.action as { onClick: (event: unknown) => void };
    action.onClick(undefined);
    expect(context.addFavorite).toHaveBeenCalledWith(
      expect.objectContaining({ tmdbId: 550, mediaType: "movie", title: "El club de la lucha" }),
    );
  });

  it("announces a loading error", () => {
    renderList({ status: "error" });
    expect(screen.getByRole("alert")).toHaveTextContent("No pudimos traer tu lista");
  });
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Favorite } from "@/features/favorites/favorite";
import {
  FavoriteContext,
  type FavoriteContextValue,
} from "@/features/favorites/useFavoriteContext";
import { ForYouRail } from "./ForYouRail";

// The save chip needs the auth session; this rail is about what gets recommended.
vi.mock("@/features/favorites/SaveButton", () => ({ SaveButton: () => null }));

const favorite = (tmdbId: number, title: string, day: number): Favorite => ({
  id: `movie-${tmdbId}`,
  tmdbId,
  mediaType: "movie",
  title,
  posterPath: null,
  releaseDate: null,
  voteAverage: 8,
  addedAt: new Date(2026, 9, day),
});

const recommended = (id: number, title: string) => ({
  id,
  title,
  release_date: "2001-01-01",
  vote_average: 7.5,
  overview: "",
  poster_path: `/p${id}.jpg`,
  backdrop_path: null,
});

// TMDB recommendations per saved title; 603 is already in the list.
const RECOMMENDATIONS: Record<string, unknown[]> = {
  "550": [recommended(680, "Pulp Fiction"), recommended(603, "Matrix")],
  "603": [recommended(680, "Pulp Fiction"), recommended(155, "Batman: El caballero de la noche")],
};

const renderRail = (favorites: Favorite[]) => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL) => {
      const id = /\/movie\/(\d+)\/recommendations/.exec(String(input))?.[1] ?? "";
      const results = RECOMMENDATIONS[id] ?? [];
      return Response.json({ page: 1, results, total_pages: 1, total_results: results.length });
    }),
  );
  const context: FavoriteContextValue = {
    favorites,
    status: "ready",
    isFavorite: () => false,
    addFavorite: vi.fn(async () => {}),
    removeFavorite: vi.fn(async () => {}),
  };
  return render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <FavoriteContext.Provider value={context}>
        {/* A data router: TitleCard reads view-transition state. */}
        <RouterProvider router={createMemoryRouter([{ path: "/", element: <ForYouRail /> }])} />
      </FavoriteContext.Provider>
    </QueryClientProvider>,
  );
};

describe("ForYouRail", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("merges recommendations from your latest titles and says why each is there", async () => {
    renderRail([favorite(550, "El Club de la Pelea", 2), favorite(603, "Matrix", 5)]);

    // The skeleton shares the region's name: wait for the real frames first.
    await screen.findByRole("heading", { name: "Pulp Fiction" });
    const rail = screen.getByRole("region", { name: "Para vos" });
    const titles = within(rail).getAllByRole("heading", { level: 3 });
    // Pulp Fiction comes from both saved titles: first. Matrix is already saved: out.
    expect(titles.map((t) => t.textContent)).toEqual([
      "Pulp Fiction",
      "Batman: El caballero de la noche",
    ]);
    // Matrix is the newest saved title, so it gets the credit for both.
    expect(within(rail).getAllByText("Porque guardaste Matrix", { selector: "p" })).toHaveLength(2);
  });

  it("stays out of the way with an empty list", () => {
    renderRail([]);
    expect(screen.queryByRole("region", { name: "Para vos" })).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
});

import { describe, expect, it } from "vitest";
import { favoriteId, toFavoriteInput } from "@/features/favorites/favorite";
import { clearLegacyFavorites, readLegacyFavorites } from "@/features/favorites/legacyFavorites";
import type { MovieSummary, TvSummary } from "@/types/tmdb";

const movie: MovieSummary = {
  id: 550,
  title: "El club de la lucha",
  release_date: "1999-10-15",
  overview: "…",
  poster_path: "/poster.jpg",
  backdrop_path: null,
  vote_average: 8.4,
};

const series: TvSummary = {
  id: 1399,
  name: "Juego de tronos",
  first_air_date: "",
  overview: "…",
  poster_path: null,
  backdrop_path: null,
  vote_average: 8.5,
};

describe("toFavoriteInput", () => {
  it("keeps only the snapshot the list needs, in the shape the security rules expect", () => {
    expect(toFavoriteInput("movie", movie)).toEqual({
      tmdbId: 550,
      mediaType: "movie",
      title: "El club de la lucha",
      posterPath: "/poster.jpg",
      releaseDate: "1999-10-15",
      voteAverage: 8.4,
    });
  });

  it("uses the series name and turns empty dates and posters into null", () => {
    expect(toFavoriteInput("tv", series)).toMatchObject({
      title: "Juego de tronos",
      posterPath: null,
      releaseDate: null,
    });
  });

  it("keeps the rating inside the 0-10 range the rules allow", () => {
    expect(toFavoriteInput("movie", { ...movie, vote_average: 11 }).voteAverage).toBe(10);
    expect(toFavoriteInput("movie", { ...movie, vote_average: Number.NaN }).voteAverage).toBe(0);
  });

  it("builds document ids as mediaType-tmdbId", () => {
    expect(favoriteId("tv", 1399)).toBe("tv-1399");
  });
});

describe("legacy device favorites", () => {
  it("reads both legacy keys and ignores malformed entries", () => {
    localStorage.setItem("favoritemovie", JSON.stringify([movie, { nope: true }, null]));
    localStorage.setItem("favoritetv", JSON.stringify([series]));

    expect(readLegacyFavorites().map((f) => favoriteId(f.mediaType, f.tmdbId))).toEqual([
      "movie-550",
      "tv-1399",
    ]);
  });

  it("survives corrupt JSON", () => {
    localStorage.setItem("favoritemovie", "{not json");
    localStorage.removeItem("favoritetv");
    expect(readLegacyFavorites()).toEqual([]);
  });

  it("clears the legacy keys after importing", () => {
    localStorage.setItem("favoritemovie", "[]");
    localStorage.setItem("favoritetv", "[]");
    clearLegacyFavorites();
    expect(localStorage.getItem("favoritemovie")).toBeNull();
    expect(localStorage.getItem("favoritetv")).toBeNull();
  });
});

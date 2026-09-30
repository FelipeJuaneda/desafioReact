import { describe, expect, it } from "vitest";
import type { Favorite } from "@/features/favorites/favorite";
import { applySheet, frameNumbers, nextShowing, parseFilter, parseSort } from "./sheet";

const fav = (
  id: string,
  mediaType: "movie" | "tv",
  title: string,
  savedDay: number | null,
  voteAverage = 7,
  releaseDate = "2000-01-01",
): Favorite => ({
  id,
  tmdbId: Number(id.replace(/\D/g, "")) || 1,
  mediaType,
  title,
  posterPath: null,
  releaseDate,
  voteAverage,
  addedAt: savedDay === null ? null : new Date(2026, 8, savedDay),
});

const list = [
  fav("m1", "movie", "Zodiac", 10, 7.7, "2007-03-02"),
  fav("t2", "tv", "Arcane", 20, 8.7, "2021-11-06"),
  fav("m3", "movie", "Alien", 5, 8.1, "1979-05-25"),
];

describe("frameNumbers", () => {
  it("numbers titles in the order they were saved, oldest first", () => {
    const numbers = frameNumbers(list);
    expect([numbers.get("m3"), numbers.get("m1"), numbers.get("t2")]).toEqual([1, 2, 3]);
  });

  it("treats a title still waiting for its server timestamp as the newest", () => {
    const numbers = frameNumbers([...list, fav("m9", "movie", "Nueva", null)]);
    expect(numbers.get("m9")).toBe(4);
  });
});

describe("applySheet", () => {
  it("filters by type", () => {
    expect(applySheet(list, "series", "recientes").map((f) => f.id)).toEqual(["t2"]);
    expect(applySheet(list, "peliculas", "recientes").map((f) => f.id)).toEqual(["m1", "m3"]);
  });

  it("sorts by date saved, rating, release year and title", () => {
    expect(applySheet(list, "todo", "recientes").map((f) => f.id)).toEqual(["t2", "m1", "m3"]);
    expect(applySheet(list, "todo", "puntaje").map((f) => f.id)).toEqual(["t2", "m3", "m1"]);
    expect(applySheet(list, "todo", "anio").map((f) => f.id)).toEqual(["t2", "m1", "m3"]);
    expect(applySheet(list, "todo", "titulo").map((f) => f.id)).toEqual(["m3", "t2", "m1"]);
  });

  it("does not reorder the caller's array", () => {
    const copy = [...list];
    applySheet(list, "todo", "titulo");
    expect(list).toEqual(copy);
  });
});

describe("nextShowing / parse", () => {
  it("picks the most recently saved title", () => {
    expect(nextShowing(list)?.id).toBe("t2");
    expect(nextShowing([])).toBeUndefined();
  });

  it("falls back to defaults for unknown URL values", () => {
    expect(parseFilter("x")).toBe("todo");
    expect(parseFilter("series")).toBe("series");
    expect(parseSort(null)).toBe("recientes");
    expect(parseSort("titulo")).toBe("titulo");
  });
});

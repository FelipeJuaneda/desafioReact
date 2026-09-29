import { describe, expect, it } from "vitest";
import { paths } from "@/app/paths";
import { formatDate, formatRating, formatRuntime, formatSeasons, formatYear } from "@/lib/format";
import { idFromSlug, slugify } from "@/lib/slug";

describe("format", () => {
  it("formats catalog metadata for es-AR", () => {
    expect(formatYear("1999-10-15")).toBe("1999");
    expect(formatYear("")).toBeNull();
    expect(formatRuntime(139)).toBe("2 h 19 min");
    expect(formatRuntime(120)).toBe("2 h");
    expect(formatRuntime(45)).toBe("45 min");
    expect(formatRuntime(null)).toBeNull();
    expect(formatRating(8.438)).toBe("8,4");
    expect(formatRating(0)).toBeNull();
    expect(formatSeasons(1)).toBe("1 temporada");
    expect(formatSeasons(8)).toBe("8 temporadas");
    expect(formatDate("2026-07-29")).toBe("29 de julio de 2026");
  });
});

describe("slugs and paths", () => {
  it("builds readable, accent-free URLs", () => {
    expect(slugify("El Señor de los Anillos: la comunidad")).toBe(
      "el-senor-de-los-anillos-la-comunidad",
    );
    expect(paths.title("movie", 550, "El club de la lucha")).toBe(
      "/pelicula/550-el-club-de-la-lucha",
    );
    expect(paths.title("tv", 1399)).toBe("/serie/1399");
    expect(paths.genre("tv", 10765)).toBe("/series?genero=10765");
    expect(paths.search("la odisea")).toBe("/buscar?q=la%20odisea");
  });

  it("reads the TMDB id from a slug parameter", () => {
    expect(idFromSlug("550-el-club-de-la-lucha")).toBe("550");
    expect(idFromSlug("550")).toBe("550");
    expect(idFromSlug("el-club")).toBeNull();
    expect(idFromSlug(undefined)).toBeNull();
  });
});

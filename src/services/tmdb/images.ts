// TMDB image CDN. Pick the smallest size that covers the rendered box (see `sizes` in Poster).
const IMAGE_BASE = "https://image.tmdb.org/t/p/";

export const POSTER_WIDTHS = [185, 342, 500, 780] as const;
export const BACKDROP_WIDTHS = [780, 1280] as const;
export const PROFILE_WIDTHS = [185, 632] as const;

export const tmdbImage = (path: string, width: number | "original") =>
  `${IMAGE_BASE}${width === "original" ? "original" : `w${width}`}${path}`;

export const tmdbSrcSet = (path: string, widths: readonly number[]) =>
  widths.map((width) => `${tmdbImage(path, width)} ${width}w`).join(", ");

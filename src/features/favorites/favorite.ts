import { getTitle, type MediaType, type MovieSummary, type TvSummary } from "@/types/tmdb";

/** A saved title: a small snapshot of what the list needs, not the whole TMDB payload. */
export interface Favorite {
  id: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
  addedAt: Date | null;
}

export type FavoriteInput = Omit<Favorite, "id" | "addedAt">;

/** Document id, e.g. "movie-550". The Firestore rules enforce the same shape. */
export const favoriteId = (mediaType: MediaType, tmdbId: number) => `${mediaType}-${tmdbId}`;

const clampRating = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? Math.min(Math.max(value, 0), 10) : 0;

export const toFavoriteInput = (
  mediaType: MediaType,
  item: MovieSummary | TvSummary,
): FavoriteInput => ({
  tmdbId: item.id,
  mediaType,
  title: getTitle(item),
  posterPath: item.poster_path ?? null,
  releaseDate: ("release_date" in item ? item.release_date : item.first_air_date) || null,
  voteAverage: clampRating(item.vote_average),
});

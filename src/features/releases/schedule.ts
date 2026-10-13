import { todayIso } from "@/lib/dates";
import type { MovieSummary } from "@/types/tmdb";

export interface ReleaseDay {
  date: string;
  movies: MovieSummary[];
}

/**
 * The release schedule: one entry per opening day (in Argentina, mostly Thursdays), soonest
 * first, each day's films in popularity order as TMDB sent them.
 */
export const groupByReleaseDay = (movies: MovieSummary[], today = todayIso()): ReleaseDay[] => {
  const days = new Map<string, MovieSummary[]>();
  for (const movie of movies) {
    if (!movie.release_date || movie.release_date < today) continue;
    days.set(movie.release_date, [...(days.get(movie.release_date) ?? []), movie]);
  }
  return [...days]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, list]) => ({ date, movies: list }));
};

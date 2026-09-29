// Query definitions for every TMDB resource: one place for cache keys and fetchers.
import { queryOptions } from "@tanstack/react-query";
import { tmdbFetch } from "@/services/tmdb/client";
import type {
  Credits,
  Genre,
  MediaType,
  MovieSummary,
  TitleDetail,
  TmdbPage,
  Videos,
} from "@/types/tmdb";

export const tmdbKeys = {
  all: ["tmdb"] as const,
  list: (path: string, params: Record<string, unknown>) =>
    [...tmdbKeys.all, "list", path, params] as const,
  title: (type: MediaType, id: string) => [...tmdbKeys.all, "title", type, id] as const,
  genres: (type: MediaType) => [...tmdbKeys.all, "genres", type] as const,
};

/** Any paginated TMDB list: discover, search, person/popular... */
export const listQuery = <T>(path: string, params: { page: number; [key: string]: unknown }) =>
  queryOptions({
    queryKey: tmdbKeys.list(path, params),
    queryFn: ({ signal }) =>
      tmdbFetch<TmdbPage<T>>(path, params as Record<string, string | number>, signal),
  });

export const titleDetailQuery = (type: MediaType, id: string) =>
  queryOptions({
    queryKey: [...tmdbKeys.title(type, id), "detail"],
    queryFn: ({ signal }) => tmdbFetch<TitleDetail>(`${type}/${id}`, {}, signal),
  });

export const titleCreditsQuery = (type: MediaType, id: string) =>
  queryOptions({
    queryKey: [...tmdbKeys.title(type, id), "credits"],
    queryFn: ({ signal }) => tmdbFetch<Credits>(`${type}/${id}/credits`, {}, signal),
  });

export const titleVideosQuery = (type: MediaType, id: string) =>
  queryOptions({
    queryKey: [...tmdbKeys.title(type, id), "videos"],
    queryFn: ({ signal }) => tmdbFetch<Videos>(`${type}/${id}/videos`, {}, signal),
  });

export const genresQuery = (type: MediaType) =>
  queryOptions({
    queryKey: tmdbKeys.genres(type),
    queryFn: async ({ signal }) =>
      (await tmdbFetch<{ genres: Genre[] }>(`genre/${type}/list`, {}, signal)).genres,
    // Genre names are effectively static.
    staleTime: Infinity,
  });

export const moviesByGenreQuery = (genreId: string) =>
  listQuery<MovieSummary>("discover/movie", { page: 1, with_genres: genreId });

// Query definitions for every TMDB resource: one place for cache keys and fetchers.
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { tmdbFetch } from "@/services/tmdb/client";
import type {
  Credits,
  Genre,
  MediaType,
  MovieSummary,
  MultiSearchResult,
  TitleDetail,
  TmdbPage,
  TvSummary,
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

/** Titles people are watching this week. */
export const trendingQuery = <T extends MovieSummary | TvSummary>(type: MediaType) =>
  listQuery<T>(`trending/${type}/week`, { page: 1 });

export const nowPlayingQuery = () =>
  listQuery<MovieSummary>("movie/now_playing", { page: 1, region: "AR" });

/** Best rated with enough votes to mean something (TMDB's top_rated lets 20-vote titles in). */
export const topRatedQuery = <T extends MovieSummary | TvSummary>(type: MediaType) =>
  listQuery<T>(`discover/${type}`, {
    page: 1,
    sort_by: "vote_average.desc",
    "vote_count.gte": 1500,
  });

export type CatalogSort = "populares" | "puntuadas" | "recientes";

/** TMDB discover params for each sort, with vote floors so rankings are not driven by 3 votes. */
const sortParams = (type: MediaType, sort: CatalogSort): Record<string, string | number> => {
  const today = new Date().toISOString().slice(0, 10);
  const dateField = type === "movie" ? "primary_release_date" : "first_air_date";
  switch (sort) {
    case "puntuadas":
      return { sort_by: "vote_average.desc", "vote_count.gte": type === "movie" ? 1000 : 300 };
    case "recientes":
      return { sort_by: `${dateField}.desc`, [`${dateField}.lte`]: today, "vote_count.gte": 30 };
    default:
      return { sort_by: "popularity.desc" };
  }
};

/** TMDB never serves past page 500 of any list. */
const TMDB_MAX_PAGE = 500;

/** Browsable catalog with "load more": pages accumulate in one cache entry. */
export const catalogQuery = <T extends MovieSummary | TvSummary>(
  type: MediaType,
  { genre, sort }: { genre?: string; sort: CatalogSort },
) =>
  infiniteQueryOptions({
    queryKey: [...tmdbKeys.all, "catalog", type, { genre, sort }],
    queryFn: ({ pageParam, signal }) =>
      tmdbFetch<TmdbPage<T>>(
        `discover/${type}`,
        { ...sortParams(type, sort), with_genres: genre, page: pageParam },
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < Math.min(last.total_pages, TMDB_MAX_PAGE) ? last.page + 1 : undefined,
  });

/** Titles and people matching a free-text query, page by page. */
export const searchQuery = (query: string) =>
  infiniteQueryOptions({
    queryKey: [...tmdbKeys.all, "search", query],
    queryFn: ({ pageParam, signal }) =>
      tmdbFetch<TmdbPage<MultiSearchResult>>(
        "search/multi",
        { query, page: pageParam, include_adult: "false" },
        signal,
      ),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < Math.min(last.total_pages, TMDB_MAX_PAGE) ? last.page + 1 : undefined,
    enabled: query.length > 0,
  });

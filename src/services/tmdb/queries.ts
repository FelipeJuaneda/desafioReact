// Query definitions for every TMDB resource: one place for cache keys and fetchers.
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { todayIso } from "@/lib/dates";
import { tmdbFetch } from "@/services/tmdb/client";
import type {
  Credits,
  Genre,
  MediaType,
  MovieSummary,
  MultiSearchResult,
  ReleaseDates,
  SeasonDetail,
  TitleDetail,
  TmdbPage,
  TvSummary,
  Videos,
  WatchProviders,
} from "@/types/tmdb";

/** The audience's country: watch providers and release dates are per country. */
export const REGION = "AR";

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
    // Every Spanish variant (es-MX Latin, es-ES Spain) plus the original: videos.ts ranks them.
    queryFn: ({ signal }) =>
      tmdbFetch<Videos>(
        `${type}/${id}/videos`,
        { include_video_language: "es-MX,es,en,null" },
        signal,
      ),
  });

/** Where to watch it, per country (TMDB gets it from JustWatch). Changes daily at most. */
export const watchProvidersQuery = (type: MediaType, id: string) =>
  queryOptions({
    queryKey: [...tmdbKeys.title(type, id), "providers"],
    queryFn: ({ signal }) => tmdbFetch<WatchProviders>(`${type}/${id}/watch/providers`, {}, signal),
    select: (data) => data.results?.[REGION] ?? null,
    staleTime: 60 * 60 * 1000,
  });

/** "If you liked this": TMDB's recommendations, or similar titles when there are none. */
export const recommendationsQuery = <T extends MovieSummary | TvSummary>(
  type: MediaType,
  id: string | number,
) =>
  queryOptions({
    queryKey: [...tmdbKeys.title(type, String(id)), "recommendations"],
    queryFn: async ({ signal }) => {
      const recommended = await tmdbFetch<TmdbPage<T>>(
        `${type}/${id}/recommendations`,
        { page: 1 },
        signal,
      );
      if (recommended.results.length > 0) return recommended;
      return tmdbFetch<TmdbPage<T>>(`${type}/${id}/similar`, { page: 1 }, signal);
    },
  });

export const seasonQuery = (id: string, season: number) =>
  queryOptions({
    queryKey: [...tmdbKeys.title("tv", id), "season", season],
    queryFn: ({ signal }) => tmdbFetch<SeasonDetail>(`tv/${id}/season/${season}`, {}, signal),
  });

/** A film's release dates by country (the detail only carries the worldwide premiere). */
export const releaseDatesQuery = (id: string) =>
  queryOptions({
    queryKey: [...tmdbKeys.title("movie", id), "release-dates"],
    queryFn: ({ signal }) => tmdbFetch<ReleaseDates>(`movie/${id}/release_dates`, {}, signal),
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
  listQuery<MovieSummary>("movie/now_playing", { page: 1, region: REGION });

/** Best rated with enough votes to mean something (TMDB's top_rated lets 20-vote titles in). */
export const topRatedQuery = <T extends MovieSummary | TvSummary>(type: MediaType) =>
  listQuery<T>(`discover/${type}`, {
    page: 1,
    sort_by: "vote_average.desc",
    "vote_count.gte": 1500,
  });

/**
 * Films opening in Argentine cinemas in the next four months. With `region`, TMDB answers with
 * the local release date. Popularity picks the 60 worth listing; the page orders them by date.
 */
export const upcomingReleasesQuery = () =>
  queryOptions({
    queryKey: [...tmdbKeys.all, "releases", REGION],
    queryFn: async ({ signal }) => {
      const today = todayIso();
      const params = {
        region: REGION,
        with_release_type: "2|3",
        "release_date.gte": today,
        "release_date.lte": todayIso(new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)),
        sort_by: "popularity.desc",
      };
      const pages = await Promise.all(
        [1, 2, 3].map((page) =>
          tmdbFetch<TmdbPage<MovieSummary>>("discover/movie", { ...params, page }, signal),
        ),
      );
      const seen = new Set<number>();
      return (
        pages
          .flatMap((p) => p.results)
          // Re-releases come back with their original date: those aren't openings.
          .filter(
            (movie) => movie.release_date >= today && !seen.has(movie.id) && seen.add(movie.id),
          )
      );
    },
  });

/** The next openings, most anticipated first: the home rail. */
export const comingSoonQuery = () => {
  const today = todayIso();
  return queryOptions({
    ...listQuery<MovieSummary>("discover/movie", {
      page: 1,
      region: REGION,
      with_release_type: "2|3",
      "release_date.gte": today,
      sort_by: "popularity.desc",
    }),
    select: (data: TmdbPage<MovieSummary>) => ({
      ...data,
      results: data.results.filter((movie) => movie.release_date >= today),
    }),
  });
};

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
  { genre, sort, providers = [] }: { genre?: string; sort: CatalogSort; providers?: number[] },
) =>
  infiniteQueryOptions({
    queryKey: [...tmdbKeys.all, "catalog", type, { genre, sort, providers }],
    queryFn: ({ pageParam, signal }) =>
      tmdbFetch<TmdbPage<T>>(
        `discover/${type}`,
        {
          ...sortParams(type, sort),
          with_genres: genre,
          // Only what streams (or plays free) on the viewer's services in Argentina.
          ...(providers.length > 0 && {
            watch_region: REGION,
            with_watch_providers: providers.join("|"),
            with_watch_monetization_types: "flatrate|free|ads",
          }),
          page: pageParam,
        },
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

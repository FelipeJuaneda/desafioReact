// Shapes of the TMDB v3 responses the app reads. Only the fields in use are declared.

export type MediaType = "movie" | "tv";

export interface Genre {
  id: number;
  name: string;
}

export interface TmdbPage<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface MediaBase {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
}

export interface MovieSummary extends MediaBase {
  title: string;
  release_date: string;
  genre_ids?: number[];
}

export interface TvSummary extends MediaBase {
  name: string;
  first_air_date: string;
}

export interface PersonSummary {
  id: number;
  name: string;
  profile_path: string | null;
}

interface DetailExtras {
  genres: Genre[];
  tagline?: string;
  vote_count: number;
  original_language: string;
}

export interface MovieDetail extends MovieSummary, DetailExtras {
  runtime: number | null;
  original_title: string;
}

export interface SeasonSummary {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  overview: string;
  poster_path: string | null;
  vote_average: number;
}

export interface EpisodeSummary {
  id: number;
  name: string;
  season_number: number;
  episode_number: number;
  air_date: string | null;
}

export interface TvDetail extends TvSummary, DetailExtras {
  number_of_seasons: number;
  number_of_episodes: number;
  original_name: string;
  created_by?: Array<{ id: number; name: string }>;
  seasons?: SeasonSummary[];
  next_episode_to_air?: EpisodeSummary | null;
  last_episode_to_air?: EpisodeSummary | null;
}

export interface Episode extends EpisodeSummary {
  overview: string;
  runtime: number | null;
  still_path: string | null;
  vote_average: number;
}

export interface SeasonDetail {
  id: number;
  name: string;
  season_number: number;
  air_date: string | null;
  overview: string;
  episodes: Episode[];
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority: number;
}

/** One country's offer: TMDB's data comes from JustWatch. */
export interface WatchOffer {
  link?: string;
  flatrate?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface WatchProviders {
  id: number;
  results?: Record<string, WatchOffer>;
}

export interface ReleaseDates {
  id: number;
  results: Array<{
    iso_3166_1: string;
    release_dates: Array<{ release_date: string; type: number }>;
  }>;
}

export type TitleDetail = MovieDetail | TvDetail;

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
}

export interface Credits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  /** Audio language ("es", "en"…) and the country of the upload ("MX", "ES"…). */
  iso_639_1?: string;
  iso_3166_1?: string;
  official?: boolean;
}

export interface Videos {
  id: number;
  results: Video[];
}

export const getTitle = (item: MovieSummary | TvSummary): string =>
  "title" in item ? item.title : item.name;

/** search/multi mixes titles and people; each result says what it is. */
export type MultiSearchResult =
  | (MovieSummary & { media_type: "movie" })
  | (TvSummary & { media_type: "tv" })
  | (PersonSummary & { media_type: "person"; known_for_department?: string });

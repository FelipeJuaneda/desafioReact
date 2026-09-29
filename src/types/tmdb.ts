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

export interface TvDetail extends TvSummary, DetailExtras {
  number_of_seasons: number;
  number_of_episodes: number;
  original_name: string;
  created_by?: Array<{ id: number; name: string }>;
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

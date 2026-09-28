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

export interface MovieDetail extends MovieSummary {
  genres: Genre[];
  runtime: number | null;
}

export interface TvDetail extends TvSummary {
  genres: Genre[];
  number_of_seasons: number;
}

export type TitleDetail = MovieDetail | TvDetail;

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Credits {
  id: number;
  cast: CastMember[];
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

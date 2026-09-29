import { queryOptions } from "@tanstack/react-query";
import { tmdbFetch } from "@/services/tmdb/client";
import type { MediaType, MovieSummary, TvSummary } from "@/types/tmdb";

type Credit =
  | (MovieSummary & {
      media_type: "movie";
      vote_count?: number;
      character?: string;
      job?: string;
      order?: number;
    })
  | (TvSummary & {
      media_type: "tv";
      vote_count?: number;
      character?: string;
      job?: string;
      order?: number;
    });

export interface PersonDetail {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  combined_credits: { cast: Credit[]; crew: Credit[] };
}

export const personQuery = (id: string) =>
  queryOptions({
    queryKey: ["tmdb", "person", id],
    queryFn: ({ signal }) =>
      tmdbFetch<PersonDetail>(`person/${id}`, { append_to_response: "combined_credits" }, signal),
  });

export interface KnownForItem {
  mediaType: MediaType;
  item: MovieSummary | TvSummary;
}

const MAX_BILLING = 12;

/**
 * The titles a person is best known for: acting credits (or directing, for directors), one
 * entry per title, ranked by how many people voted on them, so talk shows and cameos sink.
 */
export const knownFor = (person: PersonDetail, limit = 18): KnownForItem[] => {
  const credits =
    person.known_for_department === "Directing"
      ? person.combined_credits.crew.filter((credit) => credit.job === "Director")
      : // Cameos and walk-ons are billed far down; they are not what someone is known for.
        person.combined_credits.cast.filter((credit) => (credit.order ?? 0) <= MAX_BILLING);
  const seen = new Set<string>();
  return [...credits]
    .sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
    .filter((credit) => {
      const key = `${credit.media_type}-${credit.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit)
    .map((credit) => ({ mediaType: credit.media_type, item: credit }));
};

const DEPARTMENTS: Record<string, string> = {
  Acting: "Actuación",
  Directing: "Dirección",
  Writing: "Guion",
  Production: "Producción",
  Sound: "Sonido",
  Camera: "Fotografía",
  Editing: "Montaje",
};

export const departmentLabel = (department: string) => DEPARTMENTS[department] ?? department;

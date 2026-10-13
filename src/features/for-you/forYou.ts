import type { Favorite } from "@/features/favorites/favorite";
import type { MediaType, MovieSummary, TvSummary } from "@/types/tmdb";

/** How many saved titles feed "Para vos": the most recent ones say the most about today. */
export const SEED_COUNT = 6;
const MAX_PICKS = 20;

export interface ForYouPick {
  mediaType: MediaType;
  item: MovieSummary | TvSummary;
  /** The saved title that brought it in (the most recent one, when several did). */
  because: string;
}

export interface SeedResult {
  seed: Pick<Favorite, "mediaType" | "title">;
  results: Array<MovieSummary | TvSummary>;
}

/** Newest saved titles first. */
export const pickSeeds = (favorites: Favorite[]) =>
  [...favorites]
    .sort((a, b) => (b.addedAt?.getTime() ?? 0) - (a.addedAt?.getTime() ?? 0))
    .slice(0, SEED_COUNT);

/**
 * Merges each saved title's recommendations into one list. A title recommended by several of
 * your titles ranks first; ties go to the better rated. Titles already in your list are skipped,
 * and so are the unrated or posterless ones that TMDB's long tail brings in.
 */
export const mergePicks = (seeds: SeedResult[], saved: ReadonlySet<string>): ForYouPick[] => {
  const picks = new Map<string, ForYouPick & { votes: number; order: number }>();
  seeds.forEach(({ seed, results }, seedIndex) => {
    results.forEach((item, position) => {
      const key = `${seed.mediaType}-${item.id}`;
      if (saved.has(key) || !item.poster_path || !item.vote_average) return;
      const existing = picks.get(key);
      if (existing) {
        existing.votes += 1;
        return;
      }
      picks.set(key, {
        mediaType: seed.mediaType,
        item,
        because: seed.title,
        votes: 1,
        // Earlier seeds and higher positions first, to break ties after votes and rating.
        order: seedIndex * 100 + position,
      });
    });
  });
  return [...picks.values()]
    .sort(
      (a, b) =>
        b.votes - a.votes ||
        Math.round(b.item.vote_average * 2) - Math.round(a.item.vote_average * 2) ||
        a.order - b.order,
    )
    .slice(0, MAX_PICKS)
    .map(({ mediaType, item, because }) => ({ mediaType, item, because }));
};

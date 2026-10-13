import { useQueries } from "@tanstack/react-query";
import { favoriteId } from "@/features/favorites/favorite";
import { useFavoriteContext } from "@/features/favorites/useFavoriteContext";
import { recommendationsQuery } from "@/services/tmdb/queries";
import type { MovieSummary, TvSummary } from "@/types/tmdb";
import { mergePicks, pickSeeds } from "./forYou";

/** "Para vos": recommendations from the titles you saved last, merged into one rail. */
export const useForYou = () => {
  const { favorites, status } = useFavoriteContext();
  const seeds = pickSeeds(favorites);
  return useQueries({
    queries: seeds.map((seed) =>
      recommendationsQuery<MovieSummary | TvSummary>(seed.mediaType, seed.tmdbId),
    ),
    combine: (results) => {
      const ready = results.filter((result) => result.data);
      const saved = new Set(favorites.map((f) => favoriteId(f.mediaType, f.tmdbId)));
      return {
        status,
        hasSeeds: seeds.length > 0,
        isPending:
          results.length > 0 && ready.length < results.length && results.some((r) => r.isPending),
        picks: mergePicks(
          results.flatMap((result, index) =>
            result.data ? [{ seed: seeds[index]!, results: result.data.results }] : [],
          ),
          saved,
        ),
      };
    },
  });
};

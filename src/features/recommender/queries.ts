import { queryOptions } from "@tanstack/react-query";
import { todayIso } from "@/lib/dates";
import { tmdbFetch } from "@/services/tmdb/client";
import { tmdbKeys } from "@/services/tmdb/queries";
import type { MovieSummary, TmdbPage, TvSummary } from "@/types/tmdb";
import {
  cleanCandidates,
  discoverRequests,
  mediaTypes,
  type Candidate,
  type DiscoverRequest,
} from "./engine";
import { writeAnswers, type Complete } from "./questions";

type Result = (MovieSummary | TvSummary) & { genre_ids?: number[]; popularity?: number };

const toCandidate = (item: Result, request: DiscoverRequest): Candidate => ({
  id: item.id,
  mediaType: request.mediaType,
  title: "title" in item ? item.title : item.name,
  date: ("release_date" in item ? item.release_date : item.first_air_date) ?? "",
  genreIds: item.genre_ids ?? [],
  voteAverage: item.vote_average ?? 0,
  voteCount: (item as { vote_count?: number }).vote_count ?? 0,
  popularity: item.popularity ?? 0,
  posterPath: item.poster_path,
  backdropPath: item.backdrop_path,
  overview: item.overview ?? "",
  relaxed: request.relaxed,
});

/** Enough to rank from with room for variety; below it, loosen runtime and era. */
const ENOUGH = 24;

/**
 * Every candidate for a set of answers: the strict searches first and, if they find too
 * little, the relaxed ones. Scoring happens in the component, where the viewer's list is known.
 */
export const candidatesQuery = (answers: Complete) =>
  queryOptions({
    queryKey: [...tmdbKeys.all, "recommender", writeAnswers(answers).toString()],
    queryFn: async ({ signal }) => {
      const today = todayIso();
      const run = async (requests: DiscoverRequest[]) =>
        (
          await Promise.all(
            requests.map(async (request) => {
              const page = await tmdbFetch<TmdbPage<Result>>(
                `discover/${request.mediaType}`,
                request.params,
                signal,
              );
              return page.results.map((item) => toCandidate(item, request));
            }),
          )
        ).flat();

      const types = mediaTypes(answers);
      const strict = await run(types.flatMap((type) => discoverRequests(answers, type, today)));
      if (cleanCandidates(strict).length >= ENOUGH) return strict;
      const relaxed = await run(
        types.flatMap((type) => discoverRequests(answers, type, today, true)),
      );
      return [...strict, ...relaxed];
    },
    staleTime: 10 * 60 * 1000,
  });

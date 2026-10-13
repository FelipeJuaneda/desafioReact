import { useQuery } from "@tanstack/react-query";
import { daysUntil, isIsoDate } from "@/lib/dates";
import { REGION, releaseDatesQuery } from "@/services/tmdb/queries";
import type { ReleaseDates, TitleDetail } from "@/types/tmdb";

/** TMDB release types: 2 limited theatrical, 3 theatrical. */
const THEATRICAL = [3, 2];

/** The Argentine cinema opening ("YYYY-MM-DD"), theatrical first, or null. */
export const localTheatricalDate = (data: ReleaseDates | undefined) => {
  const dates = data?.results.find((r) => r.iso_3166_1 === REGION)?.release_dates ?? [];
  for (const type of THEATRICAL) {
    const date = dates
      .filter((d) => d.type === type)
      .map((d) => d.release_date.slice(0, 10))
      .sort()[0];
    if (date) return date;
  }
  return null;
};

/**
 * For a film still to open (or opened in the last months somewhere), when it opens here. Only
 * those ask for release dates: a 1999 classic doesn't need the extra request.
 */
export const useLocalRelease = (title: TitleDetail, isMovie: boolean) => {
  const premiere = "release_date" in title ? title.release_date : null;
  const recent = isIsoDate(premiere) && (daysUntil(premiere) ?? -Infinity) > -180;
  const { data } = useQuery({
    ...releaseDatesQuery(String(title.id)),
    enabled: isMovie && recent,
  });
  const local = localTheatricalDate(data);
  const date = local ?? (recent ? premiere : null);
  const days = date ? daysUntil(date) : null;
  return date && days !== null && days > 0 ? { date, days } : null;
};

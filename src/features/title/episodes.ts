import { todayIso } from "@/lib/dates";
import type { Episode, SeasonSummary, TvDetail } from "@/types/tmdb";

/** Regular seasons in order, then "Especiales" (season 0) at the end. Empty seasons are hidden. */
export const orderSeasons = (seasons: SeasonSummary[] = []) =>
  [...seasons]
    .filter((season) => season.episode_count > 0)
    .sort((a, b) => (a.season_number || Infinity) - (b.season_number || Infinity));

/** The season still airing (it has an announced next episode), if any. */
export const airingSeason = (series: Pick<TvDetail, "next_episode_to_air">) =>
  series.next_episode_to_air?.season_number ?? null;

/** Where to start: the first regular season, which is where someone deciding begins. */
export const defaultSeason = (seasons: SeasonSummary[]) =>
  seasons.find((season) => season.season_number > 0)?.season_number ??
  seasons[0]?.season_number ??
  null;

/** "?temporada=3" -> 3, only when the series has that season. */
export const parseSeason = (value: string | null, seasons: SeasonSummary[]) => {
  const number = Number(value);
  return value !== null &&
    Number.isInteger(number) &&
    seasons.some((s) => s.season_number === number)
    ? number
    : null;
};

/** Not out yet: no date, or a date after today. */
export const isUpcoming = (episode: Pick<Episode, "air_date">, today = todayIso()) =>
  !episode.air_date || episode.air_date > today;

/** "E01", "E12", "E104". */
export const episodeCode = (episode: Pick<Episode, "episode_number">) =>
  `E${String(episode.episode_number).padStart(2, "0")}`;

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/Button";
import { EdgeCode } from "@/components/ui/EdgeCode";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatePanel } from "@/components/ui/StatePanel";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/dates";
import { formatRating, formatRuntime, formatYear } from "@/lib/format";
import { tmdbImage, tmdbSrcSet } from "@/services/tmdb/images";
import { seasonQuery } from "@/services/tmdb/queries";
import type { Episode, SeasonSummary, TvDetail } from "@/types/tmdb";
import {
  airingSeason,
  defaultSeason,
  episodeCode,
  isUpcoming,
  orderSeasons,
  parseSeason,
} from "./episodes";

/** Long seasons (daily soaps run past 200 episodes) open with the first ones. */
const FIRST_EPISODES = 10;
const STILL_WIDTHS = [185, 300] as const;

const seasonLabel = (season: SeasonSummary) =>
  season.season_number === 0 ? "Esp." : `T${season.season_number}`;

/** One frame of the season strip: an episode with its still and edge code. */
const EpisodeRow = ({ episode }: { episode: Episode }) => {
  const upcoming = isUpcoming(episode);
  const code = episodeCode(episode);
  return (
    // Phones: still and title side by side, details full width below. From sm the still spans
    // both rows and everything else reads in one column beside it.
    <li className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] gap-x-4 gap-y-3 border-t border-frameline py-5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:grid-rows-[auto_1fr] sm:gap-x-6 sm:gap-y-2">
      <div className="relative aspect-video self-start overflow-hidden rounded-aperture bg-acetate-raised outline outline-1 -outline-offset-1 outline-frameline sm:row-span-2">
        {episode.still_path && !upcoming ? (
          <img
            src={tmdbImage(episode.still_path, 300)}
            srcSet={tmdbSrcSet(episode.still_path, STILL_WIDTHS)}
            sizes="(min-width: 40rem) 15rem, 7.5rem"
            alt=""
            width={300}
            height={169}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        ) : (
          // Unexposed frame: the episode number stands in for the picture.
          <span
            aria-hidden
            className="absolute inset-0 grid place-items-center font-display text-4xl font-extrabold text-emulsion-subtle uppercase sm:text-6xl"
          >
            {code}
          </span>
        )}
      </div>
      <div className="grid content-start gap-1">
        <EdgeCode
          items={[
            { label: code, emphasis: true },
            upcoming && {
              label: episode.air_date
                ? `Se estrena ${formatShortDate(episode.air_date)}`
                : "Sin fecha",
              emphasis: true,
            },
          ]}
        />
        <h4 className="text-title font-bold text-balance text-emulsion">{episode.name}</h4>
      </div>
      <div className="col-span-2 grid content-start gap-1.5 sm:col-span-1 sm:col-start-2">
        {!upcoming && (
          <EdgeCode
            items={[
              { label: formatShortDate(episode.air_date) },
              { label: formatRuntime(episode.runtime) },
              { label: formatRating(episode.vote_average), emphasis: true },
            ]}
          />
        )}
        {episode.overview ? (
          <p className="line-clamp-3 max-w-[65ch] text-body text-emulsion-muted">
            {episode.overview}
          </p>
        ) : (
          <p className="text-small text-emulsion-subtle">
            {upcoming ? "Todavía no hay sinopsis." : "Sin sinopsis en español."}
          </p>
        )}
      </div>
    </li>
  );
};

const EpisodesSkeleton = () => (
  <div aria-hidden className="grid">
    {Array.from({ length: 3 }, (_, i) => (
      <div
        key={i}
        className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] gap-x-4 border-t border-frameline py-5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-x-6"
      >
        <Skeleton className="aspect-video w-full rounded-aperture" />
        <div className="grid content-start gap-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-5 w-3/5" />
          <Skeleton className="h-4 w-full max-w-[65ch]" />
        </div>
      </div>
    ))}
  </div>
);

const SeasonPanel = ({ seriesId, season }: { seriesId: number; season: SeasonSummary }) => {
  const { data, isPending, isError, refetch } = useQuery(
    seasonQuery(String(seriesId), season.season_number),
  );
  const [showAll, setShowAll] = useState(false);
  const episodes = data?.episodes ?? [];
  const visible = showAll ? episodes : episodes.slice(0, FIRST_EPISODES);
  const overview = data?.overview || season.overview;

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <h3 className="font-display text-display-md font-extrabold text-balance text-emulsion uppercase">
          {season.name}
        </h3>
        <EdgeCode
          items={[
            { label: formatYear(season.air_date) },
            {
              label: `${season.episode_count} ${season.episode_count === 1 ? "episodio" : "episodios"}`,
            },
            { label: formatRating(season.vote_average), emphasis: true },
          ]}
        />
        {overview && <p className="max-w-[65ch] text-body text-emulsion-muted">{overview}</p>}
      </div>

      {isPending ? (
        <EpisodesSkeleton />
      ) : isError ? (
        <StatePanel
          role="alert"
          title="Se cortó la proyección"
          action={<Button onClick={() => void refetch()}>Reintentar</Button>}
        >
          No pudimos traer los episodios de esta temporada.
        </StatePanel>
      ) : (
        <>
          <ol aria-label={`Episodios de ${season.name}`} className="grid">
            {visible.map((episode) => (
              <EpisodeRow key={episode.id} episode={episode} />
            ))}
          </ol>
          {episodes.length > visible.length && (
            <Button
              variant="secondary"
              className="justify-self-start"
              onClick={() => setShowAll(true)}
            >
              Ver los {episodes.length} episodios
            </Button>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Seasons and episodes. The chosen season lives in the URL (?temporada=2), so a link can point
 * at it; the season still airing is marked "En emisión".
 */
export const Seasons = ({ series }: { series: TvDetail }) => {
  const seasons = orderSeasons(series.seasons);
  const [params, setParams] = useSearchParams();
  const airing = airingSeason(series);
  const selected = parseSeason(params.get("temporada"), seasons) ?? defaultSeason(seasons);
  const season = seasons.find((s) => s.season_number === selected);
  if (!season) return null;

  const choose = (number: number) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (number === defaultSeason(seasons)) next.delete("temporada");
        else next.set("temporada", String(number));
        return next;
      },
      { replace: true, preventScrollReset: true },
    );

  const regular = seasons.filter((s) => s.season_number > 0);
  const totalEpisodes = regular.reduce((sum, s) => sum + s.episode_count, 0);

  return (
    <section aria-labelledby="seasons" className="grid gap-6">
      <div className="grid gap-2">
        <h2
          id="seasons"
          className="font-display text-display-lg font-extrabold text-emulsion uppercase"
        >
          Temporadas
        </h2>
        <EdgeCode
          items={[
            {
              label: `${regular.length} ${regular.length === 1 ? "temporada" : "temporadas"}`,
            },
            { label: `${totalEpisodes} episodios` },
            airing !== null && { label: `En emisión: T${airing}`, emphasis: true },
          ]}
        />
      </div>

      {seasons.length > 1 && (
        <div
          role="group"
          aria-label="Elegí una temporada"
          className="-mx-(--spacing-gutter) flex [scrollbar-width:thin] gap-2 overflow-x-auto px-(--spacing-gutter) pb-1"
        >
          {seasons.map((s) => {
            const active = s.season_number === selected;
            const isAiring = s.season_number === airing;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={active}
                aria-label={`${s.name}${s.air_date ? `, ${formatYear(s.air_date)}` : ""}${isAiring ? ", en emisión" : ""}`}
                onClick={() => choose(s.season_number)}
                className={cn(
                  "grid min-h-14 min-w-16 shrink-0 content-center justify-items-start gap-0.5 rounded-aperture border px-3.5 py-1.5 text-left transition-colors duration-(--duration-fast) ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge",
                  active
                    ? "border-edge bg-acetate-raised"
                    : "border-control-line hover:border-emulsion-muted hover:bg-acetate",
                )}
              >
                <span
                  className={cn(
                    "font-display text-2xl leading-none font-extrabold uppercase",
                    active ? "text-edge" : "text-emulsion",
                  )}
                >
                  {seasonLabel(s)}
                </span>
                <span
                  className={cn(
                    "font-code text-code leading-none uppercase [font-stretch:75%] tabular-nums",
                    isAiring ? "text-edge" : "text-emulsion-muted",
                  )}
                >
                  {isAiring ? "En emisión" : (formatYear(s.air_date) ?? "—")}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <SeasonPanel key={season.season_number} seriesId={series.id} season={season} />
    </section>
  );
};

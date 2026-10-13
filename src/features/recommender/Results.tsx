import { RiCheckLine, RiPencilLine, RiRefreshLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { m } from "motion/react";
import { useState } from "react";
import { Link } from "react-router";
import { paths } from "@/app/paths";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EdgeCode } from "@/components/ui/EdgeCode";
import { Poster } from "@/components/ui/Poster";
import { StatePanel } from "@/components/ui/StatePanel";
import { SaveButton } from "@/features/favorites/SaveButton";
import { cn } from "@/lib/cn";
import { formatRating, formatRuntime, formatSeasons, formatYear } from "@/lib/format";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { BACKDROP_WIDTHS, tmdbImage, tmdbSrcSet } from "@/services/tmdb/images";
import { titleDetailQuery, watchProvidersQuery } from "@/services/tmdb/queries";
import type { MovieSummary, TvSummary } from "@/types/tmdb";
import type { Recommendation } from "./engine";
import type { Service } from "./queries";

const pad = (n: number) => String(n).padStart(2, "0");

/** The engine's candidate, in the shape TitleCard and SaveButton read. */
const asSummary = (r: Recommendation): MovieSummary | TvSummary =>
  r.mediaType === "movie"
    ? {
        id: r.id,
        title: r.title,
        release_date: r.date,
        overview: r.overview,
        poster_path: r.posterPath,
        backdrop_path: r.backdropPath,
        vote_average: r.voteAverage,
      }
    : {
        id: r.id,
        name: r.title,
        first_air_date: r.date,
        overview: r.overview,
        poster_path: r.posterPath,
        backdrop_path: r.backdropPath,
        vote_average: r.voteAverage,
      };

/** Runtime (or seasons) and the viewer's services that carry it: two small cached lookups. */
const useDetails = (r: Recommendation, services: Service[]) => {
  const detail = useQuery(titleDetailQuery(r.mediaType, String(r.id)));
  const offer = useQuery(watchProvidersQuery(r.mediaType, String(r.id)));
  const data = detail.data;
  const length = data
    ? "runtime" in data
      ? formatRuntime(data.runtime)
      : formatSeasons(data.number_of_seasons)
    : null;
  const streaming = new Set(
    [...(offer.data?.flatrate ?? []), ...(offer.data?.free ?? []), ...(offer.data?.ads ?? [])].map(
      (p) => p.provider_id,
    ),
  );
  return { length, on: services.filter((s) => streaming.has(s.id)) };
};

const Match = ({ value, large, inline }: { value: number; large?: boolean; inline?: boolean }) => (
  <p
    className={cn(
      "leading-none",
      inline ? "flex items-baseline gap-2" : "grid shrink-0 justify-items-end gap-1",
    )}
  >
    <span
      className={cn(
        "font-display font-extrabold text-edge tabular-nums",
        large ? "text-5xl" : "text-3xl",
      )}
    >
      {value}%
    </span>
    <span className="font-code text-code font-medium text-emulsion-muted uppercase [font-stretch:75%]">
      Coincidencia
    </span>
  </p>
);

const ServiceLogos = ({ on }: { on: Service[] }) =>
  on.length > 0 ? (
    <p className="flex flex-wrap items-center gap-2 text-small text-emulsion-muted">
      <span>En</span>
      {on.map((service) => (
        <span
          key={service.id}
          className="inline-flex items-center gap-1.5 font-semibold text-emulsion"
        >
          {service.logoPath && (
            <img
              src={tmdbImage(service.logoPath, 92)}
              alt=""
              width={24}
              height={24}
              className="size-6 rounded-perf"
            />
          )}
          {service.name}
        </span>
      ))}
    </p>
  ) : null;

const ReasonList = ({ r }: { r: Recommendation }) => (
  <ul className="grid gap-1.5">
    {r.reasons.map((reason) => (
      <li key={reason.kind} className="flex items-start gap-2 text-body text-emulsion">
        <RiCheckLine aria-hidden className="mt-0.5 size-5 shrink-0 text-edge" />
        {reason.text}
      </li>
    ))}
  </ul>
);

const typeLabel = (r: Recommendation) => (r.mediaType === "movie" ? "Película" : "Serie");

/** Number one, projected: the backdrop, the reasons in full, and the way to the title. */
const BestPick = ({ r, services }: { r: Recommendation; services: Service[] }) => {
  const { length, on } = useDetails(r, services);
  const href = paths.title(r.mediaType, r.id, r.title);
  return (
    <article
      aria-labelledby="best-pick"
      className="grid gap-x-10 gap-y-6 border-b border-frameline pb-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]"
    >
      <Link
        to={href}
        tabIndex={-1}
        aria-hidden
        className="relative aspect-video overflow-hidden rounded-aperture bg-acetate-raised outline outline-1 -outline-offset-1 outline-frameline"
      >
        {r.backdropPath ? (
          <img
            src={tmdbImage(r.backdropPath, 1280)}
            srcSet={tmdbSrcSet(r.backdropPath, BACKDROP_WIDTHS)}
            sizes="(min-width: 64rem) 50vw, 94vw"
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <Poster path={r.posterPath} title={r.title} sizes="40vw" className="mx-auto h-full" />
        )}
      </Link>
      <div className="grid content-start gap-4">
        <div className="flex items-start justify-between gap-6">
          <h2
            id="best-pick"
            className="font-display text-display-xl font-extrabold text-balance text-emulsion uppercase"
          >
            <span className="sr-only">La mejor opción: </span>
            <span aria-hidden className="mr-3 text-edge tabular-nums">
              01
            </span>
            <Link
              to={href}
              className="rounded-perf hover:text-edge-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-edge"
            >
              {r.title}
            </Link>
          </h2>
          <Match value={r.match} large />
        </div>
        <EdgeCode
          items={[
            { label: typeLabel(r), emphasis: true },
            { label: formatYear(r.date) },
            { label: length },
            { label: formatRating(r.voteAverage), emphasis: true },
          ]}
        />
        <ReasonList r={r} />
        <p className="line-clamp-4 max-w-[65ch] text-body-lg text-emulsion-muted">{r.overview}</p>
        <ServiceLogos on={on} />
        <div className="flex flex-wrap gap-3 pt-1">
          <ButtonLink to={href}>Ver ficha</ButtonLink>
          <SaveButton mediaType={r.mediaType} item={asSummary(r)} />
        </div>
      </div>
    </article>
  );
};

/** Places 2 to 20: rank, poster, why, and how well it matches. */
const RankedRow = ({
  r,
  rank,
  services,
}: {
  r: Recommendation;
  rank: number;
  services: Service[];
}) => {
  const { length, on } = useDetails(r, services);
  const href = paths.title(r.mediaType, r.id, r.title);
  return (
    <m.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: Math.min(rank - 2, 8) * 0.04 }}
      className="grid grid-cols-[2.75rem_4.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-frameline py-5 sm:grid-cols-[3.5rem_5.5rem_minmax(0,1fr)_auto] sm:gap-x-6"
    >
      <span
        aria-hidden
        className="pt-1 font-display text-4xl leading-none font-extrabold text-emulsion-subtle tabular-nums sm:text-5xl"
      >
        {pad(rank)}
      </span>
      <Link to={href} tabIndex={-1} aria-hidden className="self-start">
        <Poster path={r.posterPath} title={r.title} sizes="(min-width: 40rem) 88px, 72px" />
      </Link>
      <div className="grid content-start gap-2">
        <h3 className="text-title font-bold text-balance text-emulsion">
          <span className="sr-only">{rank}. </span>
          <Link
            to={href}
            className="rounded-perf decoration-edge decoration-2 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
          >
            {r.title}
          </Link>
        </h3>
        <EdgeCode
          items={[
            { label: typeLabel(r), emphasis: true },
            { label: formatYear(r.date) },
            { label: length },
            { label: formatRating(r.voteAverage), emphasis: true },
          ]}
        />
        <p className="text-small text-emulsion-muted">
          {r.reasons.map((reason) => reason.text).join(" · ")}
        </p>
        <ServiceLogos on={on} />
        <div className="sm:hidden">
          <Match value={r.match} inline />
        </div>
      </div>
      <div className="hidden sm:block">
        <Match value={r.match} />
      </div>
    </m.li>
  );
};

interface ResultsProps {
  results: Recommendation[];
  summary: string[];
  services: Service[];
  onEdit: () => void;
  onRestart: () => void;
}

export const Results = ({ results, summary, services, onEdit, onRestart }: ResultsProps) => {
  const [more, setMore] = useState(false);
  const [best, ...rest] = results;
  const shown = more ? rest : rest.slice(0, 9);

  const toolbar = (
    <div className="grid gap-4 border-b border-frameline pb-6">
      <EdgeCode items={summary.map((label) => ({ label }))} />
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" size="sm" onClick={onEdit}>
          <RiPencilLine aria-hidden />
          Cambiar respuestas
        </Button>
        <Button variant="ghost" size="sm" onClick={onRestart}>
          <RiRefreshLine aria-hidden />
          Empezar de nuevo
        </Button>
      </div>
    </div>
  );

  if (!best) {
    return (
      <div className="grid gap-8">
        {toolbar}
        <StatePanel
          title="No encontramos nada con todo eso junto"
          action={<Button onClick={onEdit}>Cambiar respuestas</Button>}
        >
          Probá sumar plataformas o elegir otro ánimo: así hay más títulos para comparar.
        </StatePanel>
      </div>
    );
  }

  return (
    <div className="grid gap-10">
      {toolbar}
      <BestPick r={best} services={services} />
      {rest.length > 0 && (
        <section aria-labelledby="also" className="grid gap-2">
          <h2
            id="also"
            className="font-display text-display-lg font-extrabold text-emulsion uppercase"
          >
            También te van a gustar
          </h2>
          <ol className="grid">
            {shown.map((r, index) => (
              <RankedRow
                key={`${r.mediaType}-${r.id}`}
                r={r}
                rank={index + 2}
                services={services}
              />
            ))}
          </ol>
          {!more && rest.length > 9 && (
            <Button
              variant="secondary"
              className="mt-4 justify-self-start"
              onClick={() => setMore(true)}
            >
              Ver otras {rest.length - 9}
            </Button>
          )}
        </section>
      )}
      <p className="text-small text-emulsion-subtle">
        Cómo elegimos: puntaje de TMDB ponderado por cantidad de votos, cuánto encaja con lo que
        tenés ganas, con quién la ves, la época y qué tan conocida es. Después evitamos repetir
        género o saga.
      </p>
    </div>
  );
};

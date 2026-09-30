import { RiArrowRightLine, RiMarkPenLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { Link, useViewTransitionState } from "react-router";
import { paths } from "@/app/paths";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EdgeCode } from "@/components/ui/EdgeCode";
import { Poster } from "@/components/ui/Poster";
import type { Favorite } from "@/features/favorites/favorite";
import { formatRating, formatRuntime, formatSeasons, formatYear } from "@/lib/format";
import { BACKDROP_WIDTHS, tmdbImage, tmdbSrcSet } from "@/services/tmdb/images";
import { titleDetailQuery } from "@/services/tmdb/queries";

const pad = (n: number) => String(n).padStart(2, "0");
const savedOn = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long" });

interface NextShowingProps {
  favorite: Favorite;
  /** Frame number on the contact sheet (order saved). */
  frame: number;
  onRemove: () => void;
}

/**
 * The last title saved, projected large: the next showing. Everything else about it (backdrop,
 * runtime, genres, synopsis) comes from TMDB; while that loads, the saved poster holds the frame.
 */
export const NextShowing = ({ favorite, frame, onRemove }: NextShowingProps) => {
  const { data: detail } = useQuery(titleDetailQuery(favorite.mediaType, String(favorite.tmdbId)));
  const href = paths.title(favorite.mediaType, favorite.tmdbId, favorite.title);
  const opening = useViewTransitionState(href);
  const isMovie = favorite.mediaType === "movie";
  const extent = detail
    ? "runtime" in detail
      ? formatRuntime(detail.runtime)
      : formatSeasons(detail.number_of_seasons)
    : null;
  const genres = detail?.genres
    .slice(0, 2)
    .map((genre) => genre.name)
    .join(" · ");

  return (
    <section aria-labelledby="next-showing" className="grid gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-frameline pb-3">
        <h2 id="next-showing" className="font-display text-display-lg font-extrabold uppercase">
          Próxima función
        </h2>
        <p className="font-code text-code font-medium text-emulsion-subtle uppercase [font-stretch:75%] tabular-nums">
          Cuadro <span className="text-edge">{pad(frame)}</span>
          {favorite.addedAt && ` · guardada el ${savedOn.format(favorite.addedAt)}`}
        </p>
      </div>

      <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        {/* The projected frame: backdrop in scope ratio, the poster standing in while it loads. */}
        <div className="relative aspect-video overflow-hidden rounded-aperture bg-acetate-raised outline -outline-offset-1 outline-frameline lg:aspect-auto lg:min-h-[22rem]">
          {detail?.backdrop_path ? (
            <img
              src={tmdbImage(detail.backdrop_path, 1280)}
              srcSet={tmdbSrcSet(detail.backdrop_path, BACKDROP_WIDTHS)}
              sizes="(min-width: 1024px) 58vw, 94vw"
              alt=""
              className="size-full object-cover"
              style={opening ? { viewTransitionName: "title-art" } : undefined}
            />
          ) : (
            <div className="absolute inset-y-0 left-0 w-1/3 max-w-56 p-4">
              <Poster path={favorite.posterPath} title={favorite.title} sizes="220px" priority />
            </div>
          )}
        </div>

        <div className="grid content-center gap-4">
          <h3 className="font-display text-display-xl font-extrabold text-balance uppercase">
            <Link
              to={href}
              viewTransition
              state={{ morph: true }}
              className="rounded-perf hover:text-edge-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-edge"
            >
              {favorite.title}
            </Link>
          </h3>
          <EdgeCode
            items={[
              { label: isMovie ? "Película" : "Serie", emphasis: true },
              { label: formatYear(favorite.releaseDate) },
              extent && { label: extent },
              genres && { label: genres },
              { label: formatRating(favorite.voteAverage), emphasis: true },
            ]}
          />
          {detail?.overview && (
            <p className="line-clamp-4 max-w-[60ch] text-body-lg text-emulsion-muted">
              {detail.overview}
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-1">
            <ButtonLink to={href} viewTransition state={{ morph: true }}>
              Ver ficha
              <RiArrowRightLine aria-hidden />
            </ButtonLink>
            <Button variant="secondary" onClick={onRemove}>
              <RiMarkPenLine aria-hidden />
              Quitar de la lista
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const NextShowingSkeleton = () => (
  <div aria-hidden className="grid gap-5">
    <div className="h-10 w-72 rounded-perf bg-acetate-raised motion-safe:animate-expose" />
    <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
      <div className="aspect-video rounded-aperture bg-acetate-raised motion-safe:animate-expose lg:aspect-auto lg:min-h-[22rem]" />
      <div className="grid content-center gap-4">
        <div className="h-16 w-4/5 rounded-perf bg-acetate-raised motion-safe:animate-expose" />
        <div className="h-3 w-64 rounded-perf bg-acetate-raised motion-safe:animate-expose" />
        <div className="h-20 w-full rounded-perf bg-acetate-raised motion-safe:animate-expose" />
      </div>
    </div>
  </div>
);

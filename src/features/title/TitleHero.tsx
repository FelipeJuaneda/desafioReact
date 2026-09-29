import { RiPlayFill } from "@remixicon/react";
import { Link } from "react-router";
import { paths } from "@/app/paths";
import { Button } from "@/components/ui/Button";
import { EdgeCode } from "@/components/ui/EdgeCode";
import { Poster } from "@/components/ui/Poster";
import { SaveButton } from "@/features/favorites/SaveButton";
import { formatRating, formatRuntime, formatSeasons, formatYear } from "@/lib/format";
import { BACKDROP_WIDTHS, tmdbImage, tmdbSrcSet } from "@/services/tmdb/images";
import { getTitle, type MediaType, type TitleDetail } from "@/types/tmdb";

interface TitleHeroProps {
  mediaType: MediaType;
  title: TitleDetail;
  onPlayTrailer?: () => void;
}

/**
 * The title projected: backdrop in scope ratio (the view-transition target the poster frame
 * expands into), poster, title in extra condensed caps and the edge-code line.
 */
export const TitleHero = ({ mediaType, title, onPlayTrailer }: TitleHeroProps) => {
  const name = getTitle(title);
  const year = formatYear("release_date" in title ? title.release_date : title.first_air_date);
  const length =
    "runtime" in title ? formatRuntime(title.runtime) : formatSeasons(title.number_of_seasons);

  return (
    <section aria-labelledby="title-name">
      <div className="mx-auto max-w-(--container-reel) px-(--spacing-gutter) pt-6 lg:pt-10">
        <div className="aspect-video overflow-hidden rounded-aperture bg-acetate lg:aspect-[2.39/1]">
          {title.backdrop_path && (
            <img
              src={tmdbImage(title.backdrop_path, 1280)}
              srcSet={tmdbSrcSet(title.backdrop_path, BACKDROP_WIDTHS)}
              sizes="(min-width: 90rem) 84rem, 94vw"
              alt=""
              fetchPriority="high"
              className="size-full object-cover"
              style={{ viewTransitionName: "title-art" }}
            />
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-(--container-reel) gap-x-10 gap-y-6 px-(--spacing-gutter) pt-7 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
        <Poster
          path={title.poster_path}
          title={name}
          alt={`Afiche de ${name}`}
          sizes="(min-width: 1024px) 240px, (min-width: 768px) 208px, 112px"
          priority
          className="relative -mt-20 ml-3 w-28 md:-mt-24 md:ml-0 md:w-full lg:-mt-32"
        />
        <div className="grid content-start gap-4">
          <h1
            id="title-name"
            className="font-display text-display-xl font-extrabold text-balance uppercase"
          >
            {name}
          </h1>
          <EdgeCode
            items={[
              { label: mediaType === "movie" ? "Película" : "Serie", emphasis: true },
              year && { label: year },
              length && { label: length },
              { label: formatRating(title.vote_average), emphasis: true },
            ]}
          />
          {title.genres.length > 0 && (
            <ul aria-label="Géneros" className="flex flex-wrap gap-2">
              {title.genres.map((genre) => (
                <li key={genre.id}>
                  <Link
                    to={paths.genre(mediaType, genre.id)}
                    className="inline-flex min-h-11 items-center rounded-perf border border-frameline bg-acetate px-3 text-small font-semibold text-emulsion-muted hover:border-control-line hover:text-emulsion focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
                  >
                    {genre.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {title.tagline && (
            <p className="font-display text-title font-bold text-emulsion uppercase">
              {title.tagline}
            </p>
          )}
          {title.overview && (
            <p className="max-w-[65ch] text-body-lg text-emulsion-muted">{title.overview}</p>
          )}
          <div className="flex flex-wrap gap-3 pt-1">
            {onPlayTrailer && (
              <Button onClick={onPlayTrailer}>
                <RiPlayFill aria-hidden />
                Ver tráiler
              </Button>
            )}
            <SaveButton mediaType={mediaType} item={title} />
          </div>
        </div>
      </div>
    </section>
  );
};

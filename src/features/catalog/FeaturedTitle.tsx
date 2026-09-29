import { RiArrowRightLine } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { paths } from "@/app/paths";
import { ButtonLink } from "@/components/ui/Button";
import { EdgeCode } from "@/components/ui/EdgeCode";
import { Skeleton } from "@/components/ui/Skeleton";
import { SaveButton } from "@/features/favorites/SaveButton";
import { formatRating, formatRuntime, formatYear } from "@/lib/format";
import { BACKDROP_WIDTHS, tmdbImage, tmdbSrcSet } from "@/services/tmdb/images";
import { titleDetailQuery, trendingQuery } from "@/services/tmdb/queries";
import type { MovieDetail, MovieSummary } from "@/types/tmdb";

const SCREEN = "aspect-[4/3] sm:aspect-video lg:aspect-[2.39/1]";

const FeaturedSkeleton = () => (
  <div aria-hidden className="grid gap-6">
    <Skeleton className={`${SCREEN} w-full rounded-aperture`} />
    <div className="grid gap-3 border-b border-frameline pb-10">
      <Skeleton className="h-14 w-3/4 max-w-2xl" />
      <Skeleton className="h-3.5 w-80 max-w-full" />
      <Skeleton className="h-4 w-full max-w-[60ch]" />
    </div>
  </div>
);

/**
 * The first viewport: this week's most-watched film projected in scope ratio between leader
 * bars, its title set large on the lower bar with the edge-code line beneath.
 */
export const FeaturedTitle = () => {
  const trending = useQuery(trendingQuery<MovieSummary>("movie"));
  const featured = trending.data?.results.find((item) => item.backdrop_path);
  const detail = useQuery({
    ...titleDetailQuery("movie", String(featured?.id ?? "")),
    enabled: Boolean(featured),
  });

  if (!featured) {
    return (
      <div className="mx-auto max-w-(--container-reel) px-(--spacing-gutter) pt-6 lg:pt-10">
        {trending.isError ? null : <FeaturedSkeleton />}
      </div>
    );
  }

  const movie = detail.data as MovieDetail | undefined;
  const genres = movie?.genres
    .slice(0, 3)
    .map((genre) => genre.name)
    .join(" · ");
  const href = paths.title("movie", featured.id, featured.title);

  return (
    <section
      aria-labelledby="featured-title"
      className="mx-auto max-w-(--container-reel) px-(--spacing-gutter) pt-6 lg:pt-10"
    >
      <div className={`${SCREEN} overflow-hidden rounded-aperture bg-acetate`}>
        <img
          src={tmdbImage(featured.backdrop_path!, 1280)}
          srcSet={tmdbSrcSet(featured.backdrop_path!, BACKDROP_WIDTHS)}
          sizes="(min-width: 90rem) 84rem, 94vw"
          alt=""
          fetchPriority="high"
          className="size-full object-cover"
          style={{ viewTransitionName: `backdrop-${featured.id}` }}
        />
      </div>
      <div className="grid items-end gap-x-12 gap-y-6 border-b border-frameline pt-7 pb-10 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <h2
            id="featured-title"
            className="mb-3.5 font-display text-display-xl font-extrabold text-balance uppercase"
          >
            {featured.title}
          </h2>
          <EdgeCode
            items={[
              { label: "Película", emphasis: true },
              { label: formatYear(featured.release_date) },
              movie && { label: formatRuntime(movie.runtime) },
              genres && { label: genres },
              { label: formatRating(featured.vote_average), emphasis: true },
            ]}
          />
          {featured.overview && (
            <p className="mt-4 line-clamp-3 max-w-[60ch] text-body-lg text-emulsion-muted">
              {featured.overview}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to={href} viewTransition>
            Ver ficha
            <RiArrowRightLine aria-hidden />
          </ButtonLink>
          <SaveButton mediaType="movie" item={featured} />
        </div>
      </div>
    </section>
  );
};

import { useQuery, type QueryKey, type UseQueryOptions } from "@tanstack/react-query";
import { m } from "motion/react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import type { EdgeCodeItem } from "@/components/ui/EdgeCode";
import { Rail } from "@/components/ui/Rail";
import { railColumns } from "@/components/ui/railColumns";
import { TitleCardSkeleton } from "@/components/ui/Skeleton";
import { StatePanel } from "@/components/ui/StatePanel";
import { TitleCard } from "@/features/catalog/TitleCard";
import { GRID_POSTER_SIZES } from "@/features/catalog/TitleGrid";
import { RISE } from "@/lib/motion";
import type { MediaType, MovieSummary, TmdbPage, TvSummary } from "@/types/tmdb";

/** Rail frames use the grid's columns (2 → 6), so they take the grid's image sizes too. */
const RAIL_POSTER_SIZES = GRID_POSTER_SIZES;

interface CatalogRailProps<T extends MovieSummary | TvSummary, D, K extends QueryKey> {
  title: string;
  mediaType: MediaType;
  /** Any query that ends in a TMDB page: listQuery, recommendations, a filtered discover… */
  query: UseQueryOptions<D, Error, TmdbPage<T>, K>;
  action?: ReactNode;
  /** First rail on the page: load its posters eagerly. */
  eager?: boolean;
  /** Replaces each card's edge code (see TitleCard). */
  edge?: (item: T) => EdgeCodeItem[];
}

/** A rail of titles fed by a TMDB list, with its own loading and error states. */
export const CatalogRail = <
  T extends MovieSummary | TvSummary,
  D = TmdbPage<T>,
  K extends QueryKey = QueryKey,
>({
  title,
  mediaType,
  query,
  action,
  eager,
  edge,
}: CatalogRailProps<T, D, K>) => {
  const { data, isPending, isError, refetch } = useQuery(query);

  if (isPending) {
    return (
      <section aria-label={title} aria-busy="true" className="grid gap-5">
        <h2 className="font-display text-display-lg font-extrabold text-emulsion uppercase">
          {title}
        </h2>
        <div className={`${railColumns("posters")} overflow-hidden`}>
          {Array.from({ length: 6 }, (_, i) => (
            <TitleCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section aria-label={title} className="grid gap-5">
        <h2 className="font-display text-display-lg font-extrabold text-emulsion uppercase">
          {title}
        </h2>
        <StatePanel
          role="alert"
          title="Se cortó la proyección"
          action={<Button onClick={() => void refetch()}>Reintentar</Button>}
        >
          No pudimos traer esta lista. Revisá tu conexión y volvé a intentar.
        </StatePanel>
      </section>
    );
  }

  // Nothing to show (e.g. a title without recommendations): no empty rail.
  if (data.results.length === 0) return null;

  return (
    // Rails further down rise into place as the page scrolls to them; the first one is painted.
    <m.div
      initial={eager ? false : RISE.initial}
      whileInView={RISE.animate}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={RISE.transition}
    >
      <Rail
        title={title}
        action={action}
        items={data.results}
        getKey={(item) => item.id}
        renderItem={(item, index) => (
          <TitleCard
            mediaType={mediaType}
            item={item}
            sizes={RAIL_POSTER_SIZES}
            priority={eager && index < 5}
            edge={edge?.(item)}
          />
        )}
      />
    </m.div>
  );
};

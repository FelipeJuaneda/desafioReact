import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Rail } from "@/components/ui/Rail";
import { TitleCardSkeleton } from "@/components/ui/Skeleton";
import { StatePanel } from "@/components/ui/StatePanel";
import { TitleCard } from "@/features/catalog/TitleCard";
import type { listQuery } from "@/services/tmdb/queries";
import type { MediaType, MovieSummary, TvSummary } from "@/types/tmdb";

/** Rendered rail frame width (see Rail's column size): lets the browser pick w185 or w342. */
export const RAIL_POSTER_SIZES =
  "(min-width: 1110px) 216px, (max-width: 450px) 152px, calc(7rem + 9vw)";

interface CatalogRailProps<T extends MovieSummary | TvSummary> {
  title: string;
  mediaType: MediaType;
  query: ReturnType<typeof listQuery<T>>;
  action?: ReactNode;
  /** First rail on the page: load its posters eagerly. */
  eager?: boolean;
}

/** A rail of titles fed by a TMDB list, with its own loading and error states. */
export const CatalogRail = <T extends MovieSummary | TvSummary>({
  title,
  mediaType,
  query,
  action,
  eager,
}: CatalogRailProps<T>) => {
  const { data, isPending, isError, refetch } = useQuery(query);

  if (isPending) {
    return (
      <section aria-label={title} aria-busy="true" className="grid gap-5">
        <h2 className="font-display text-display-lg font-extrabold text-emulsion uppercase">
          {title}
        </h2>
        <div className="grid auto-cols-[clamp(9.5rem,7rem+9vw,13.5rem)] grid-flow-col gap-[clamp(0.75rem,0.5rem+0.8vw,1.25rem)] overflow-hidden">
          {Array.from({ length: 7 }, (_, i) => (
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

  return (
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
        />
      )}
    />
  );
};

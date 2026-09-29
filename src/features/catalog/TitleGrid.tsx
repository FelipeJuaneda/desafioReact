import { m } from "motion/react";
import { TitleCardSkeleton } from "@/components/ui/Skeleton";
import { RISE } from "@/lib/motion";
import { TitleCard } from "@/features/catalog/TitleCard";
import type { MediaType, MovieSummary, TvSummary } from "@/types/tmdb";

const GRID =
  "grid grid-cols-2 gap-x-[clamp(0.75rem,0.5rem+1vw,1.5rem)] gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

/** Matches GRID: the poster is roughly one column wide at each breakpoint. */
export const GRID_POSTER_SIZES =
  "(min-width: 1440px) 216px, (min-width: 1280px) 16vw, (min-width: 1024px) 19vw, (min-width: 768px) 23vw, (min-width: 640px) 31vw, 47vw";

interface TitleGridProps {
  /** One type for the whole grid, or per item for mixed results (search). */
  mediaType: MediaType | ((item: MovieSummary | TvSummary) => MediaType);
  items: Array<MovieSummary | TvSummary>;
}

/** First row (up to six columns): painted at once, never held back by an entrance. */
const FIRST_ROW = 6;

/**
 * Frames below the fold settle in as they scroll into view, a few milliseconds apart, like a
 * contact sheet being developed row by row. "Cargar más" pages arrive the same way.
 */
export const TitleGrid = ({ mediaType, items }: TitleGridProps) => (
  <ul className={GRID}>
    {items.map((item, index) => {
      const type = typeof mediaType === "function" ? mediaType(item) : mediaType;
      const aboveFold = index < FIRST_ROW;
      return (
        <m.li
          key={`${type}-${item.id}`}
          initial={aboveFold ? false : RISE.initial}
          whileInView={RISE.animate}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ ...RISE.transition, delay: (index % FIRST_ROW) * 0.04 }}
        >
          <TitleCard mediaType={type} item={item} sizes={GRID_POSTER_SIZES} priority={aboveFold} />
        </m.li>
      );
    })}
  </ul>
);

export const TitleGridSkeleton = ({ count = 12 }: { count?: number }) => (
  <div aria-hidden className={GRID}>
    {Array.from({ length: count }, (_, i) => (
      <TitleCardSkeleton key={i} />
    ))}
  </div>
);

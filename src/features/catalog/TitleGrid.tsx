import { TitleCardSkeleton } from "@/components/ui/Skeleton";
import { TitleCard } from "@/features/catalog/TitleCard";
import type { MediaType, MovieSummary, TvSummary } from "@/types/tmdb";

const GRID =
  "grid grid-cols-2 gap-x-[clamp(0.75rem,0.5rem+1vw,1.5rem)] gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

/** Matches GRID: the poster is roughly one column wide at each breakpoint. */
const GRID_POSTER_SIZES =
  "(min-width: 1440px) 216px, (min-width: 1280px) 16vw, (min-width: 1024px) 19vw, (min-width: 768px) 23vw, (min-width: 640px) 31vw, 47vw";

interface TitleGridProps {
  mediaType: MediaType;
  items: Array<MovieSummary | TvSummary>;
}

export const TitleGrid = ({ mediaType, items }: TitleGridProps) => (
  <ul className={GRID}>
    {items.map((item, index) => (
      <li key={item.id}>
        <TitleCard
          mediaType={mediaType}
          item={item}
          sizes={GRID_POSTER_SIZES}
          priority={index < 6}
        />
      </li>
    ))}
  </ul>
);

export const TitleGridSkeleton = ({ count = 12 }: { count?: number }) => (
  <div aria-hidden className={GRID}>
    {Array.from({ length: count }, (_, i) => (
      <TitleCardSkeleton key={i} />
    ))}
  </div>
);

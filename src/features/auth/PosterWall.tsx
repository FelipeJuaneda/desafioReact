import { useQuery } from "@tanstack/react-query";
import { m } from "motion/react";
import { cn } from "@/lib/cn";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { tmdbImage } from "@/services/tmdb/images";
import { trendingQuery } from "@/services/tmdb/queries";
import type { MovieSummary, TvSummary } from "@/types/tmdb";

/** This week's films and series, interleaved, only the ones with a poster. */
const usePosters = () => {
  const movies = useQuery(trendingQuery<MovieSummary>("movie"));
  const series = useQuery(trendingQuery<TvSummary>("tv"));
  const a = movies.data?.results ?? [];
  const b = series.data?.results ?? [];
  const mixed = Array.from({ length: Math.max(a.length, b.length) }, (_, i) => [a[i], b[i]])
    .flat()
    .filter((item): item is MovieSummary | TvSummary => Boolean(item?.poster_path));
  return mixed.map((item) => ({ key: `${item.id}`, path: item.poster_path! }));
};

const Frame = ({ path }: { path: string }) => (
  <img
    src={tmdbImage(path, 185)}
    alt=""
    loading="lazy"
    decoding="async"
    className="aspect-2/3 w-full rounded-aperture object-cover outline -outline-offset-1 outline-frameline"
  />
);

/**
 * The house before the show: columns of this week's posters drifting past, dimmed, behind the
 * slate. Purely decorative (hidden from assistive tech); it stands still under reduced motion.
 * Each column is its list twice, and moves by half its height, so the loop has no seam.
 */
export const PosterWall = ({ className }: { className?: string }) => {
  const posters = usePosters();
  if (posters.length < 8) return <div aria-hidden className={className} />;

  const columns = [0, 1, 2, 3].map((c) => posters.filter((_, i) => i % 4 === c));
  const drift = [
    "animate-drift-up",
    "animate-drift-down",
    "animate-drift-up [animation-duration:135s]",
    "animate-drift-down [animation-duration:165s]",
  ];

  return (
    <div aria-hidden className={cn("relative overflow-hidden", className)}>
      <m.div
        className="absolute inset-0 grid grid-cols-3 gap-3 px-3 xl:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE_OUT }}
      >
        {columns.map((column, c) => (
          <div
            key={c}
            className={cn(
              "grid content-start gap-3 motion-reduce:animate-none",
              drift[c],
              c === 3 && "hidden xl:grid",
              // Stagger the columns so their gaps never line up.
              c % 2 === 1 && "-mt-24",
            )}
          >
            {[...column, ...column].map((poster, i) => (
              <Frame key={`${poster.key}-${i}`} path={poster.path} />
            ))}
          </div>
        ))}
      </m.div>
      {/* The house lights are down: dim the wall and let it fall off into the leader. */}
      <div className="absolute inset-0 bg-leader/55" />
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-leader" />
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-leader to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-leader to-transparent" />
    </div>
  );
};

/** Phones: a single strip of posters running sideways above the slate. */
export const PosterStrip = ({ className }: { className?: string }) => {
  const posters = usePosters().slice(0, 14);
  if (posters.length < 6) return null;
  return (
    <div aria-hidden className={cn("relative overflow-hidden", className)}>
      <m.div
        className="flex w-max animate-drift-left gap-2.5 motion-reduce:animate-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.slow * 2, ease: EASE_OUT }}
      >
        {[...posters, ...posters].map((poster, i) => (
          <div key={`${poster.key}-${i}`} className="w-20 shrink-0">
            <Frame path={poster.path} />
          </div>
        ))}
      </m.div>
      <div className="absolute inset-0 bg-leader/45" />
      <div className="absolute inset-y-0 left-0 w-10 bg-linear-to-r from-leader to-transparent" />
      <div className="absolute inset-y-0 right-0 w-10 bg-linear-to-l from-leader to-transparent" />
    </div>
  );
};

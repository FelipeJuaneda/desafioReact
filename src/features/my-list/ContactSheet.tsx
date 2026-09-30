import { RiMarkPenLine } from "@remixicon/react";
import { AnimatePresence, m, useIsPresent } from "motion/react";
import { Link, useViewTransitionState } from "react-router";
import { paths } from "@/app/paths";
import { EdgeCode } from "@/components/ui/EdgeCode";
import { Poster } from "@/components/ui/Poster";
import { GRID_POSTER_SIZES } from "@/features/catalog/TitleGrid";
import type { Favorite } from "@/features/favorites/favorite";
import { formatRating, formatYear } from "@/lib/format";
import { DURATION, EASE_OUT } from "@/lib/motion";

const pad = (n: number) => String(n).padStart(2, "0");
const savedShort = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" });

/** Same columns as the catalog grids: posters read at the same size across the app. */
export const SHEET_GRID =
  "grid grid-cols-2 gap-x-[clamp(0.75rem,0.5rem+1vw,1.5rem)] gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

/**
 * The editor's grease-pencil X, drawn stroke by stroke over a frame being struck off. Two
 * slightly bowed lines in viewBox units of a 2:3 poster, so it scales with the frame.
 */
const GreaseCross = () => (
  <svg
    aria-hidden
    viewBox="0 0 100 150"
    preserveAspectRatio="none"
    className="pointer-events-none absolute inset-0 size-full text-grease drop-shadow-[0_1px_1px_rgb(0_0_0/0.5)]"
  >
    {["M13 20 C 38 58, 62 94, 88 132", "M88 18 C 64 56, 40 96, 12 130"].map((d, i) => (
      <m.path
        key={d}
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={6.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.22, delay: i * 0.2, ease: [0.4, 0, 0.6, 1] }}
      />
    ))}
  </svg>
);

interface FrameProps {
  favorite: Favorite;
  frame: number;
  onRemove: () => void;
  priority?: boolean;
}

const Frame = ({ favorite, frame, onRemove, priority }: FrameProps) => {
  // While AnimatePresence plays this frame's exit, it is being struck off: draw the X.
  const struck = !useIsPresent();
  const href = paths.title(favorite.mediaType, favorite.tmdbId, favorite.title);
  const opening = useViewTransitionState(href);

  return (
    <article className="group grid gap-2.5">
      {/* Printed on the film edge above the frame: its number and the day it was saved. */}
      <p
        aria-hidden
        className="flex justify-between font-code text-code font-medium uppercase [font-stretch:75%] tabular-nums"
      >
        <span className="text-edge">{pad(frame)}</span>
        {favorite.addedAt && (
          <span className="text-emulsion-subtle">{savedShort.format(favorite.addedAt)}</span>
        )}
      </p>
      <div className="relative">
        <Link to={href} viewTransition state={{ morph: true }} tabIndex={-1} aria-hidden>
          <Poster
            path={favorite.posterPath}
            title={favorite.title}
            sizes={GRID_POSTER_SIZES}
            priority={priority}
            viewTransitionName={opening ? "title-art" : undefined}
            className="transition-transform duration-(--duration-slow) ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </Link>
        {struck && <GreaseCross />}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Quitar "${favorite.title}" de Mi lista`}
          title="Tachar de la lista"
          className="absolute top-2 right-2 grid size-11 place-items-center rounded-aperture bg-leader/80 text-emulsion transition-colors duration-(--duration-fast) hover:bg-grease hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
        >
          <RiMarkPenLine aria-hidden className="size-5" />
        </button>
      </div>
      <h3 className="text-body leading-tight font-semibold text-balance">
        <Link
          to={href}
          viewTransition
          state={{ morph: true }}
          className="rounded-perf text-emulsion decoration-edge decoration-2 underline-offset-4 group-hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-edge"
        >
          {favorite.title}
        </Link>
      </h3>
      <EdgeCode
        items={[
          { label: favorite.mediaType === "movie" ? "Película" : "Serie" },
          { label: formatYear(favorite.releaseDate) },
          { label: formatRating(favorite.voteAverage), emphasis: true },
        ]}
      />
    </article>
  );
};

interface ContactSheetProps {
  favorites: Favorite[];
  frames: Map<string, number>;
  onRemove: (favorite: Favorite) => void;
}

/**
 * Every other saved title as a frame on the editor's contact sheet. Striking one off draws a
 * grease-pencil X, then the frame fades and the rest close the gap.
 */
export const ContactSheet = ({ favorites, frames, onRemove }: ContactSheetProps) => (
  <ol className={SHEET_GRID}>
    <AnimatePresence initial={false}>
      {favorites.map((favorite, index) => (
        <m.li
          key={favorite.id}
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          // Hold the frame while the X is drawn (~0.45s), then let it go.
          exit={{ opacity: 0, scale: 0.96, transition: { delay: 0.5, duration: DURATION.base } }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
        >
          <Frame
            favorite={favorite}
            frame={frames.get(favorite.id) ?? index + 1}
            priority={index < 6}
            onRemove={() => onRemove(favorite)}
          />
        </m.li>
      ))}
    </AnimatePresence>
  </ol>
);

export const ContactSheetSkeleton = () => (
  <div aria-hidden className={SHEET_GRID}>
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="grid gap-2.5">
        <div className="h-3 w-8 rounded-perf bg-acetate-raised motion-safe:animate-expose" />
        <div className="aspect-2/3 rounded-aperture bg-acetate-raised motion-safe:animate-expose" />
        <div className="h-4 w-4/5 rounded-perf bg-acetate-raised motion-safe:animate-expose" />
      </div>
    ))}
  </div>
);

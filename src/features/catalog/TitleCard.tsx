import { Link, useViewTransitionState } from "react-router";
import { paths } from "@/app/paths";
import { EdgeCode } from "@/components/ui/EdgeCode";
import { Poster } from "@/components/ui/Poster";
import { SaveButton } from "@/features/favorites/SaveButton";
import { formatRating, formatYear } from "@/lib/format";
import { getTitle, type MediaType, type MovieSummary, type TvSummary } from "@/types/tmdb";

interface TitleCardProps {
  mediaType: MediaType;
  item: MovieSummary | TvSummary;
  /** Rendered poster width per breakpoint (see Poster). */
  sizes: string;
  priority?: boolean;
}

/** A frame of the reel: poster, title and the edge-code line (year · rating). */
export const TitleCard = ({ mediaType, item, sizes, priority }: TitleCardProps) => {
  const title = getTitle(item);
  const year = formatYear("release_date" in item ? item.release_date : item.first_air_date);
  const rating = formatRating(item.vote_average);
  const href = paths.title(mediaType, item.id, title);
  // Only the frame being opened carries the shared name, so duplicates across rails never clash.
  const opening = useViewTransitionState(href);

  return (
    <article className="group relative">
      <Link
        to={href}
        viewTransition
        // Tells the screen transition to stand aside: the View Transition morph runs instead.
        state={{ morph: true }}
        className="grid gap-2.5 rounded-aperture focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-edge"
      >
        <Poster
          path={item.poster_path}
          title={title}
          sizes={sizes}
          priority={priority}
          viewTransitionName={opening ? "title-art" : undefined}
          className="transition-transform duration-(--duration-slow) ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <h3 className="text-body leading-tight font-semibold text-balance text-emulsion decoration-edge decoration-2 underline-offset-4 group-hover:underline">
          {title}
        </h3>
        <EdgeCode items={[year && { label: year }, rating && { label: rating, emphasis: true }]} />
      </Link>
      <SaveButton
        mediaType={mediaType}
        item={item}
        variant="chip"
        className="absolute top-2 right-2"
      />
    </article>
  );
};

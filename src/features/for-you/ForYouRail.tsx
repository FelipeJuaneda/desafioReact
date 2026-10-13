import { m } from "motion/react";
import { Rail } from "@/components/ui/Rail";
import { railColumns } from "@/components/ui/railColumns";
import { TitleCardSkeleton } from "@/components/ui/Skeleton";
import { TitleCard } from "@/features/catalog/TitleCard";
import { GRID_POSTER_SIZES } from "@/features/catalog/TitleGrid";
import { RISE } from "@/lib/motion";
import { useForYou } from "./useForYou";

interface ForYouRailProps {
  title?: string;
}

/** Renders nothing for guests or an empty list: there is nothing to base picks on. */
/** "Para vos": recommendations from the titles you saved last, merged into one rail. */
export const ForYouRail = ({ title = "Para vos" }: ForYouRailProps) => {
  const { status, hasSeeds, isPending, picks } = useForYou();
  if (status !== "ready" || !hasSeeds) return null;

  if (isPending && picks.length === 0) {
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
  if (picks.length === 0) return null;

  return (
    <m.div
      initial={RISE.initial}
      whileInView={RISE.animate}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={RISE.transition}
    >
      <Rail
        title={title}
        items={picks}
        getKey={(pick) => `${pick.mediaType}-${pick.item.id}`}
        renderItem={(pick) => (
          <TitleCard
            mediaType={pick.mediaType}
            item={pick.item}
            sizes={GRID_POSTER_SIZES}
            note={`Porque guardaste ${pick.because}`}
          />
        )}
      />
    </m.div>
  );
};

export default ForYouRail;

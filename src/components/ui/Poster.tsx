import { useState } from "react";
import { cn } from "@/lib/cn";
import { POSTER_WIDTHS, tmdbImage, tmdbSrcSet } from "@/services/tmdb/images";

interface PosterProps {
  path: string | null;
  /** Shown on the fallback frame when there is no image. */
  title: string;
  /** Rendered width of the poster at each breakpoint, for the browser to pick a file. */
  sizes: string;
  /** Empty by default: posters usually sit next to their title, which already names them. */
  alt?: string;
  /** Above-the-fold posters load eagerly with high priority. */
  priority?: boolean;
  className?: string;
}

/**
 * A 2:3 poster in a projector-aperture frame. The image "develops" from low-contrast gray to
 * full color when it loads; missing or broken images show the title on an unexposed frame.
 */
export const Poster = ({ path, title, sizes, alt = "", priority, className }: PosterProps) => {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const showImage = path !== null && status !== "error";

  return (
    <div
      className={cn(
        "relative aspect-2/3 overflow-hidden rounded-aperture bg-acetate-raised",
        "outline outline-1 -outline-offset-1 outline-frameline",
        className,
      )}
    >
      {showImage ? (
        <img
          src={tmdbImage(path, 342)}
          srcSet={tmdbSrcSet(path, POSTER_WIDTHS)}
          sizes={sizes}
          alt={alt}
          width={342}
          height={513}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cn(
            "size-full object-cover transition-[filter,opacity] duration-(--duration-develop) ease-out",
            status === "loaded"
              ? "opacity-100"
              : "opacity-70 brightness-[0.8] contrast-[0.55] grayscale",
            "motion-reduce:transition-none",
          )}
        />
      ) : (
        <div className="absolute inset-0 grid content-end gap-2 p-3.5">
          <span className="font-display text-2xl leading-[0.95] font-extrabold text-emulsion uppercase">
            {title}
          </span>
          <span className="font-code text-code text-emulsion-muted uppercase [font-stretch:75%]">
            Sin afiche
          </span>
        </div>
      )}
    </div>
  );
};

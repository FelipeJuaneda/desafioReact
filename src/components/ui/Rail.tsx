import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

interface RailProps<T> {
  title: string;
  items: T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
  /** Optional link or control shown next to the title (e.g. "Ver todas"). */
  action?: ReactNode;
  className?: string;
}

/** 35 mm film carries 4 perforations per frame. */
const PERFS_PER_FRAME = 4;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A horizontal strip of frames. Native scroll-snap does the scrolling (touch, trackpad, and
 * keyboard via focus); the perforation track lights the frames in view and the counter says
 * where you are.
 */
export const Rail = <T,>({ title, items, getKey, renderItem, action, className }: RailProps<T>) => {
  const titleId = useId();
  const scroller = useRef<HTMLUListElement>(null);
  const [visible, setVisible] = useState<ReadonlySet<number>>(new Set([0]));

  useEffect(() => {
    const list = scroller.current;
    if (!list || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) =>
        setVisible((previous) => {
          const next = new Set(previous);
          for (const entry of entries) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            if (entry.isIntersecting) next.add(index);
            else next.delete(index);
          }
          return next;
        }),
      { root: list, threshold: 0.85 },
    );
    for (const child of Array.from(list.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [items.length]);

  const first = visible.size > 0 ? Math.min(...visible) : 0;
  const last = visible.size > 0 ? Math.max(...visible) : 0;

  const scrollBy = (direction: -1 | 1) => {
    const list = scroller.current;
    if (!list) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({
      left: direction * list.clientWidth * 0.8,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section aria-labelledby={titleId} className={cn("grid gap-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-baseline gap-4">
          <h2
            id={titleId}
            className="font-display text-display-lg font-extrabold text-emulsion uppercase"
          >
            {title}
          </h2>
          {action}
        </div>
        <div className="flex items-center gap-3">
          <p className="font-code text-[0.8125rem] font-semibold tracking-[0.08em] whitespace-nowrap text-emulsion-muted [font-stretch:75%] tabular-nums">
            <span className="sr-only">Mostrando </span>
            <span className="text-edge">{pad(first + 1)}</span>
            <span aria-hidden> / </span>
            <span className="sr-only"> de </span>
            {pad(items.length)}
          </p>
          <div className="hidden gap-2 sm:flex">
            <Button
              variant="secondary"
              iconOnly
              aria-label={`Anteriores en ${title}`}
              disabled={first === 0}
              onClick={() => scrollBy(-1)}
            >
              <RiArrowLeftSLine aria-hidden />
            </Button>
            <Button
              variant="secondary"
              iconOnly
              aria-label={`Siguientes en ${title}`}
              disabled={last >= items.length - 1}
              onClick={() => scrollBy(1)}
            >
              <RiArrowRightSLine aria-hidden />
            </Button>
          </div>
        </div>
      </div>

      <div aria-hidden className="flex h-3 gap-[7px] overflow-hidden">
        {Array.from({ length: items.length * PERFS_PER_FRAME }, (_, i) => (
          <span
            key={i}
            className={cn(
              "mt-0.5 h-2 w-2.5 shrink-0 rounded-perf transition-colors duration-(--duration-base)",
              visible.has(Math.floor(i / PERFS_PER_FRAME)) ? "bg-edge" : "bg-acetate-raised",
            )}
          />
        ))}
      </div>

      <ul
        ref={scroller}
        className={cn(
          "grid snap-x snap-mandatory auto-cols-[clamp(9.5rem,7rem+9vw,13.5rem)] grid-flow-col gap-[clamp(0.75rem,0.5rem+0.8vw,1.25rem)]",
          "[scrollbar-width:none] overflow-x-auto overscroll-x-contain pb-2 [&::-webkit-scrollbar]:hidden",
        )}
      >
        {items.map((item, index) => (
          <li key={getKey(item)} data-index={index} className="snap-start">
            {renderItem(item, index)}
          </li>
        ))}
      </ul>
    </section>
  );
};

import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { railColumns, type RailDensity } from "@/components/ui/railColumns";
import { cn } from "@/lib/cn";

interface RailProps<T> {
  title: string;
  items: T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
  /** Optional link or control shown next to the title (e.g. "Ver todas"). */
  action?: ReactNode;
  density?: RailDensity;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A horizontal strip of frames. Native scroll-snap does the scrolling (touch, trackpad, and
 * keyboard via focus); the perforation track lights the stretch of the reel in view and the
 * counter says where you are.
 */
export const Rail = <T,>({
  title,
  items,
  getKey,
  renderItem,
  action,
  density = "posters",
  className,
}: RailProps<T>) => {
  const titleId = useId();
  const scroller = useRef<HTMLUListElement>(null);
  const [visible, setVisible] = useState<ReadonlySet<number>>(new Set([0]));
  // Visible stretch of the reel as fractions of its full width, for the perforation track.
  const [view, setView] = useState({ start: 0, end: 1 });

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

  useEffect(() => {
    const list = scroller.current;
    if (!list) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const { scrollLeft, clientWidth, scrollWidth } = list;
      if (scrollWidth === 0) return;
      setView({ start: scrollLeft / scrollWidth, end: (scrollLeft + clientWidth) / scrollWidth });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    list.addEventListener("scroll", schedule, { passive: true });
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    resize?.observe(list);
    return () => {
      cancelAnimationFrame(frame);
      list.removeEventListener("scroll", schedule);
      resize?.disconnect();
    };
  }, [items.length]);

  // Dragging the perforation track scrubs the reel like a scrollbar thumb. Snap is paused
  // while dragging (it would fight the pointer) and settles on a frame edge on release.
  const [scrubbing, setScrubbing] = useState(false);
  const grab = useRef(0); // where in the lit window the pointer took hold, as a fraction
  const trackFraction = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    return Math.min(Math.max((event.clientX - box.left) / box.width, 0), 1);
  };
  const scrubTo = (fraction: number) => {
    const list = scroller.current;
    if (list) list.scrollLeft = (fraction - grab.current) * list.scrollWidth;
  };
  const startScrub = (event: PointerEvent<HTMLDivElement>) => {
    const at = trackFraction(event);
    const width = view.end - view.start;
    // Inside the lit window: keep hold of that spot. Outside: centre the window on the pointer.
    grab.current = at >= view.start && at <= view.end ? at - view.start : width / 2;
    event.currentTarget.setPointerCapture(event.pointerId);
    setScrubbing(true);
    scrubTo(at);
  };
  const moveScrub = (event: PointerEvent<HTMLDivElement>) => {
    if (scrubbing) scrubTo(trackFraction(event));
  };
  const endScrub = () => setScrubbing(false);

  const first = visible.size > 0 ? Math.min(...visible) : 0;
  const last = visible.size > 0 ? Math.max(...visible) : 0;

  const scrollBy = (direction: -1 | 1) => {
    const list = scroller.current;
    if (!list) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // One full page of frames; snap-start lands it on a frame edge.
    list.scrollBy({
      left: direction * list.clientWidth,
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
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              iconOnly
              aria-label={`Anteriores en ${title}`}
              disabled={first === 0}
              onClick={() => scrollBy(-1)}
            >
              <RiArrowLeftSLine aria-hidden />
            </Button>
            <Button
              variant="secondary"
              size="sm"
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

      {/*
        Perforations span the rail exactly (whole holes only); amber marks the stretch in view.
        Dragging it scrubs the reel. It is a pointer shortcut only: keyboard and screen-reader
        users have the buttons and the list's native scrolling, so it stays out of the a11y tree.
      */}
      <div
        aria-hidden
        onPointerDown={startScrub}
        onPointerMove={moveScrub}
        onPointerUp={endScrub}
        onPointerCancel={endScrub}
        className={cn(
          "-my-2 touch-none py-2 select-none",
          scrubbing ? "cursor-grabbing" : "cursor-grab",
        )}
      >
        <div className="relative h-2">
          <div className="absolute inset-0 bg-acetate-raised perf-track" />
          <div
            className="absolute inset-0 bg-edge perf-track"
            style={{
              clipPath: `inset(0 ${(1 - view.end) * 100}% 0 ${view.start * 100}%)`,
            }}
          />
        </div>
      </div>

      <ul
        ref={scroller}
        className={cn(
          railColumns(density),
          scrubbing ? "snap-none" : "snap-x snap-mandatory",
          "overflow-x-auto overscroll-x-contain pb-2",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {items.map((item, index) => (
          <li key={getKey(item)} data-index={index} className="min-w-0 snap-start">
            {renderItem(item, index)}
          </li>
        ))}
      </ul>
    </section>
  );
};

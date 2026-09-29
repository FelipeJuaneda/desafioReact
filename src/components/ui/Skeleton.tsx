import { cn } from "@/lib/cn";

/** Placeholder with the exact shape of the content it stands for. Purely visual. */
export const Skeleton = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn("rounded-perf bg-acetate-raised motion-safe:animate-expose", className)}
  />
);

/** Poster frame + title + edge-code line, matching TitleCard. */
export const TitleCardSkeleton = () => (
  <div aria-hidden className="grid gap-2.5">
    <Skeleton className="aspect-2/3 w-full rounded-aperture" />
    <Skeleton className="h-4 w-4/5" />
    <Skeleton className="h-3 w-3/5" />
  </div>
);

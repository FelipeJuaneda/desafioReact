import { cn } from "@/lib/cn";

export type RailDensity = "posters" | "people";

/**
 * Whole frames per view: the column width is derived from the rail's own width, so the last
 * frame is never cut off. Posters use the same counts as TitleGrid; portraits run denser.
 */
const COLUMNS: Record<RailDensity, string> = {
  posters: "[--cols:2] sm:[--cols:3] md:[--cols:4] lg:[--cols:5] xl:[--cols:6]",
  people: "[--cols:3] sm:[--cols:4] md:[--cols:6] lg:[--cols:7] xl:[--cols:8]",
};

/** Grid classes for a rail (or its skeleton) at a given density. */
export const railColumns = (density: RailDensity) =>
  cn(
    COLUMNS[density],
    "grid grid-flow-col [--gap:clamp(0.75rem,0.5rem+1vw,1.5rem)] gap-(--gap)",
    "auto-cols-[calc((100%_-_(var(--cols)_-_1)_*_var(--gap))_/_var(--cols))]",
  );

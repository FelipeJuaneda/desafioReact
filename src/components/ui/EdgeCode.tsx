import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface EdgeCodeItem {
  label: ReactNode;
  /** Printed in the accent: media type and rating. */
  emphasis?: boolean;
}

interface EdgeCodeProps {
  items: Array<EdgeCodeItem | null | false | undefined>;
  tone?: "projection" | "lighttable";
  className?: string;
}

/**
 * The metadata line printed like the edge code of a 35 mm print:
 * condensed monospace, tabular figures, thin rules between fields.
 */
export const EdgeCode = ({ items, tone = "projection", className }: EdgeCodeProps) => {
  const visible = items.filter((item): item is EdgeCodeItem => Boolean(item));
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 font-code font-medium text-edge uppercase [font-stretch:75%] tabular-nums",
        tone === "projection" ? "text-emulsion-muted" : "text-lt-muted",
        className,
      )}
    >
      {visible.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <span aria-hidden className="h-[0.75em] w-px bg-current opacity-50" />}
          <span
            className={cn(
              item.emphasis && (tone === "projection" ? "text-edge" : "text-lt-edge-ink"),
            )}
          >
            {item.label}
          </span>
        </Fragment>
      ))}
    </p>
  );
};

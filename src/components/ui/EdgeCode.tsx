import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface EdgeCodeItem {
  label: ReactNode;
  /** Printed in the accent: media type and rating. */
  emphasis?: boolean;
}

interface EdgeCodeProps {
  /** Falsy entries and items without a label are skipped, so optional fields can be inlined. */
  items: Array<EdgeCodeItem | null | false | undefined | "">;
  className?: string;
}

/**
 * The metadata line printed like the edge code of a 35 mm print:
 * condensed monospace, tabular figures, thin rules between fields.
 */
export const EdgeCode = ({ items, className }: EdgeCodeProps) => {
  const visible = items.filter(
    (item): item is EdgeCodeItem =>
      typeof item === "object" && item !== null && item.label != null && item.label !== "",
  );
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2.5 gap-y-1 font-code text-code font-medium text-emulsion-muted uppercase [font-stretch:75%] tabular-nums",
        className,
      )}
    >
      {visible.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <span aria-hidden className="h-[0.75em] w-px bg-current opacity-50" />}
          <span className={cn(item.emphasis && "text-edge")}>{item.label}</span>
        </Fragment>
      ))}
    </p>
  );
};

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StatePanelProps {
  title: string;
  children?: ReactNode;
  /** Primary way out of the state: retry, explore, sign in… */
  action?: ReactNode;
  tone?: "projection" | "lighttable";
  /** Errors are announced to assistive tech; empty states are not. */
  role?: "alert" | "status";
  className?: string;
}

/** Empty, error and "nothing here" states: a title, one sentence, one way forward. */
export const StatePanel = ({
  title,
  children,
  action,
  tone = "projection",
  role,
  className,
}: StatePanelProps) => (
  <div
    role={role}
    className={cn(
      "grid justify-items-start gap-3 rounded-aperture border border-dashed p-6",
      tone === "projection" ? "border-frameline text-emulsion" : "border-lt-line text-lt-ink",
      className,
    )}
  >
    <p className="font-display text-display-md font-extrabold uppercase">{title}</p>
    {children && (
      <div
        className={cn(
          "max-w-[60ch] text-body",
          tone === "projection" ? "text-emulsion-muted" : "text-lt-muted",
        )}
      >
        {children}
      </div>
    )}
    {action && <div className="pt-1">{action}</div>}
  </div>
);

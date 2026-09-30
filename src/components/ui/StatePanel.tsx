import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StatePanelProps {
  title: string;
  children?: ReactNode;
  /** Primary way out of the state: retry, explore, sign in… */
  action?: ReactNode;
  /** Errors are announced to assistive tech; empty states are not. */
  role?: "alert" | "status";
  className?: string;
}

/** Empty, error and "nothing here" states: a title, one sentence, one way forward. */
export const StatePanel = ({ title, children, action, role, className }: StatePanelProps) => (
  <div
    role={role}
    className={cn(
      "grid justify-items-start gap-3 rounded-aperture border border-dashed border-frameline p-6 text-emulsion",
      className,
    )}
  >
    <p className="font-display text-display-md font-extrabold uppercase">{title}</p>
    {children && <div className="max-w-[60ch] text-body text-emulsion-muted">{children}</div>}
    {action && <div className="pt-1">{action}</div>}
  </div>
);
